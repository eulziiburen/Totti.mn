"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { orderItems, orders, productVariants } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { checkOrderStatus } from "@/app/delguur/actions";
import { sendEmailSafely } from "@/lib/email";
import { orderPaidEmailHtml } from "@/lib/email-templates";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function updateOrderStatus(id: number, status: string) {
  await requireAuth();

  const newlyPaidOrder = await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, id));
    if (!order) throw new Error("Захиалга олдсонгүй.");

    if (status === "cancelled" && order.status !== "cancelled") {
      const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
      for (const item of items) {
        await tx
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
          .where(eq(productVariants.id, item.variantId));
      }
    }

    const becamePaid = status === "paid" && order.status !== "paid";
    await tx
      .update(orders)
      .set({ status, ...(becamePaid ? { paidAt: sql`(current_timestamp)` } : {}) })
      .where(eq(orders.id, id));

    return becamePaid ? order : null;
  });

  if (newlyPaidOrder?.customerEmail) {
    const mail = orderPaidEmailHtml(
      newlyPaidOrder.orderNo,
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/delguur/order/${newlyPaidOrder.orderNo}`
    );
    await sendEmailSafely({ to: newlyPaidOrder.customerEmail, subject: mail.subject, html: mail.html });
  }

  revalidatePath("/admin/orders");
}

export async function recheckPayment(orderNo: string) {
  await requireAuth();
  const result = await checkOrderStatus(orderNo);
  revalidatePath("/admin/orders");
  return result;
}

export async function deleteOrder(id: number) {
  await requireAuth();
  await db.delete(orderItems).where(eq(orderItems.orderId, id));
  await db.delete(orders).where(eq(orders.id, id));
  revalidatePath("/admin/orders");
}
