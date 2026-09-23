import { NextRequest } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { orders } from "@/db/schema";
import * as qpay from "@/lib/qpay";

async function handle(req: NextRequest) {
  try {
    const orderNo = req.nextUrl.searchParams.get("order");
    if (!orderNo) return new Response("SUCCESS", { status: 200 });

    const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo));
    if (!order || order.status !== "pending" || !order.qpayInvoiceId) {
      return new Response("SUCCESS", { status: 200 });
    }

    // Never trust the callback payload itself (its exact shape is unconfirmed) —
    // always independently re-verify with QPay before marking an order paid.
    const paid = await qpay.checkPayment(order.qpayInvoiceId);
    if (paid) {
      await db
        .update(orders)
        .set({ status: "paid", paidAt: sql`(current_timestamp)` })
        .where(and(eq(orders.id, order.id), eq(orders.status, "pending")));
    }
  } catch (err) {
    console.error("QPay callback handling failed", err);
  }
  // Always ack 200/"SUCCESS", even on internal error, to avoid QPay retry storms
  // against an endpoint whose payload we can't fully trust or parse. The client-side
  // poller and the admin "Дахин шалгах" action are the backstops if this write fails.
  return new Response("SUCCESS", { status: 200 });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
