"use server";

import { revalidatePath } from "next/cache";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { orders, orderItems, products, productVariants } from "@/db/schema";
import * as qpay from "@/lib/qpay";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { sendEmailSafely } from "@/lib/email";
import { adminNewOrderEmailHtml, orderConfirmationEmailHtml, orderPaidEmailHtml } from "@/lib/email-templates";

function generateOrderNo() {
  return `T${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

export type CreateOrderInput = {
  items: { variantId: number; quantity: number }[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    note?: string;
  };
};

export type CreateOrderResult = { ok: true; orderNo: string } | { ok: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const name = input.customer.name?.trim();
  const phone = input.customer.phone?.trim();
  if (!name || !phone) return { ok: false, error: "Нэр, утасны дугаар шаардлагатай." };
  if (!input.items?.length) return { ok: false, error: "Сагс хоосон байна." };

  const customerId = await getCurrentCustomerId();
  const orderNo = generateOrderNo();
  let insertedOrderId: number;
  let orderTotal: number;
  let orderLines: (typeof orderItems.$inferInsert)[] = [];

  try {
    const result = await db.transaction(async (tx) => {
      let subtotal = 0;
      const lines: (typeof orderItems.$inferInsert)[] = [];

      for (const item of input.items) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error("Тоо хэмжээ буруу байна.");
        }

        const rows = await tx
          .select({
            id: productVariants.id,
            productId: productVariants.productId,
            size: productVariants.size,
            color: productVariants.color,
            priceOverride: productVariants.priceOverride,
            isActive: productVariants.isActive,
            productName: products.name,
            productActive: products.isActive,
            basePrice: products.basePrice,
          })
          .from(productVariants)
          .innerJoin(products, eq(productVariants.productId, products.id))
          .where(eq(productVariants.id, item.variantId));
        const v = rows[0];
        if (!v || !v.isActive || !v.productActive) {
          throw new Error("Сонгосон бараа олдсонгүй.");
        }

        const decrement = await tx
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
          .where(and(eq(productVariants.id, item.variantId), gte(productVariants.stock, item.quantity)));
        if (decrement.rowsAffected === 0) {
          const label = [v.size, v.color].filter(Boolean).join(" / ") || v.productName;
          throw new Error(`"${label}" барааны үлдэгдэл хүрэлцэхгүй байна.`);
        }

        const unitPrice = v.priceOverride ?? v.basePrice;
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;
        lines.push({
          orderId: 0,
          productId: v.productId,
          variantId: v.id,
          productName: v.productName,
          variantLabel: [v.size, v.color].filter(Boolean).join(" / ") || "—",
          unitPrice,
          quantity: item.quantity,
          lineTotal,
        });
      }

      const [order] = await tx
        .insert(orders)
        .values({
          orderNo,
          customerId,
          customerName: name,
          customerPhone: phone,
          customerEmail: input.customer.email?.trim() || null,
          deliveryAddress: input.customer.address?.trim() || null,
          note: input.customer.note?.trim() || null,
          subtotal,
          total: subtotal,
          status: "pending",
        })
        .returning();
      await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));
      return { order, lines };
    });
    insertedOrderId = result.order.id;
    orderTotal = result.order.total;
    orderLines = result.lines;
  } catch (err) {
    console.error("createOrder failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "Захиалга үүсгэхэд алдаа гарлаа." };
  }

  const orderUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/delguur/order/${orderNo}`;
  const customerEmail = input.customer.email?.trim();
  if (customerEmail) {
    const mail = orderConfirmationEmailHtml({
      orderNo,
      items: orderLines.map((l) => ({
        productName: l.productName,
        variantLabel: l.variantLabel,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      })),
      total: orderTotal,
      orderUrl,
    });
    await sendEmailSafely({ to: customerEmail, subject: mail.subject, html: mail.html });
  }
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminEmail) {
    const adminMail = adminNewOrderEmailHtml({
      orderNo,
      customerName: name,
      customerPhone: phone,
      total: orderTotal,
      adminUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/orders`,
    });
    await sendEmailSafely({ to: adminEmail, subject: adminMail.subject, html: adminMail.html });
  }

  try {
    const invoice = await qpay.createInvoice({
      senderInvoiceNo: `${orderNo}-${Date.now()}`,
      amount: orderTotal,
      description: `Totti.mn захиалга ${orderNo}`,
      orderNo,
    });
    await db
      .update(orders)
      .set({
        qpayInvoiceId: invoice.invoiceId,
        qpayQrText: invoice.qrText,
        qpayQrImage: invoice.qrImage,
        qpayShortUrl: invoice.shortUrl,
      })
      .where(eq(orders.id, insertedOrderId));
  } catch (err) {
    console.error("QPay invoice creation failed", orderNo, err);
    // Order stays "pending" with no qpayInvoiceId; the order page offers a retry
    // button. Stock stays reserved — no rollback here, so retrying doesn't double-decrement.
  }

  revalidatePath("/admin/orders");
  return { ok: true, orderNo };
}

export async function retryQpayInvoice(orderNo: string): Promise<{ ok: boolean; error?: string }> {
  const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo));
  if (!order) return { ok: false, error: "Захиалга олдсонгүй." };
  if (order.status !== "pending") return { ok: true };

  try {
    const invoice = await qpay.createInvoice({
      senderInvoiceNo: `${orderNo}-${Date.now()}`,
      amount: order.total,
      description: `Totti.mn захиалга ${orderNo}`,
      orderNo,
    });
    await db
      .update(orders)
      .set({
        qpayInvoiceId: invoice.invoiceId,
        qpayQrText: invoice.qrText,
        qpayQrImage: invoice.qrImage,
        qpayShortUrl: invoice.shortUrl,
      })
      .where(eq(orders.id, order.id));
    revalidatePath(`/delguur/order/${orderNo}`);
    return { ok: true };
  } catch (err) {
    console.error("retryQpayInvoice failed", orderNo, err);
    return {
      ok: false,
      error: err instanceof qpay.QPayConfigError ? err.message : "Нэхэмжлэх үүсгэхэд алдаа гарлаа.",
    };
  }
}

// Shared by both the client-side status poller (checkOrderStatus) and the QPay
// webhook (src/app/api/qpay/callback/route.ts) — whichever one actually flips the
// row from pending -> paid (checked via rowsAffected) is the one that emails the
// customer, so the email fires exactly once regardless of which path wins the race.
export async function markOrderPaidAndNotify(order: typeof orders.$inferSelect): Promise<boolean> {
  const result = await db
    .update(orders)
    .set({ status: "paid", paidAt: sql`(current_timestamp)` })
    .where(and(eq(orders.id, order.id), eq(orders.status, "pending")));
  if (result.rowsAffected === 0) return false;

  revalidatePath("/admin/orders");
  if (order.customerEmail) {
    const orderUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/delguur/order/${order.orderNo}`;
    const mail = orderPaidEmailHtml(order.orderNo, orderUrl);
    await sendEmailSafely({ to: order.customerEmail, subject: mail.subject, html: mail.html });
  }
  return true;
}

export async function checkOrderStatus(orderNo: string): Promise<{ status: string }> {
  const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo));
  if (!order) return { status: "not_found" };
  if (order.status !== "pending" || !order.qpayInvoiceId) return { status: order.status };

  try {
    const paid = await qpay.checkPayment(order.qpayInvoiceId);
    if (paid) {
      await markOrderPaidAndNotify(order);
      return { status: "paid" };
    }
  } catch (err) {
    console.error("checkOrderStatus qpay check failed", orderNo, err);
  }
  return { status: order.status };
}
