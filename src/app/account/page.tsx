import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { db } from "@/db/client";
import { orderItems, orders } from "@/db/schema";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { logoutCustomer } from "./actions";

export const metadata: Metadata = { title: "Миний бүртгэл | ТОТТИ Дэлгүүр" };
export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  paid: "Төлөгдсөн",
  failed: "Амжилтгүй",
  cancelled: "Цуцалсан",
  fulfilled: "Хүргэсэн",
};

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");

  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customer.id))
    .orderBy(desc(orders.createdAt));

  const items =
    myOrders.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(
            inArray(
              orderItems.orderId,
              myOrders.map((o) => o.id)
            )
          )
      : [];

  return (
    <>
      <Header />
      <main className="pb-[110px] pt-[150px]">
        <div className="mx-auto max-w-[820px] px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber">Миний бүртгэл</p>
              <h1 className="mt-2 font-display text-[clamp(28px,3.5vw,40px)] uppercase leading-[0.98]">
                {customer.name}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {customer.email} {customer.phone && `· ${customer.phone}`}
              </p>
            </div>
            <form action={logoutCustomer}>
              <button
                type="submit"
                className="rounded-full border border-line-strong px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors hover:border-chalk"
              >
                Гарах
              </button>
            </form>
          </div>

          <h2 className="mb-3 mt-10 text-sm font-bold uppercase tracking-wide text-muted">Захиалгын түүх</h2>
          {myOrders.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center text-muted">
              Та одоогоор захиалга хийгээгүй байна.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {myOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-line-strong bg-bg-0 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">#{order.orderNo}</span>
                    <span className="rounded-full bg-bg-1 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-col gap-1 text-sm text-muted">
                    {items
                      .filter((i) => i.orderId === order.id)
                      .map((i) => (
                        <li key={i.id}>
                          {i.productName}
                          {i.variantLabel && i.variantLabel !== "—" ? ` (${i.variantLabel})` : ""} × {i.quantity}
                        </li>
                      ))}
                  </ul>
                  <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                    <span className="text-[13px] text-muted">{order.createdAt}</span>
                    <span className="font-bold">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
