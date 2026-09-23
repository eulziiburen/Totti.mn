import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db/client";
import { bookings, customers, orders, products } from "@/db/schema";

export const dynamic = "force-dynamic";

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

function formatTimestamp(sqliteTimestamp: string): string {
  const [datePart, timePart] = sqliteTimestamp.split(" ");
  if (!datePart) return sqliteTimestamp;
  const [y, m, d] = datePart.split("-");
  return `${y}.${m}.${d}${timePart ? ` ${timePart.slice(0, 5)}` : ""}`;
}

export default async function AdminDashboardPage() {
  const [
    [{ revenue }],
    [{ paidCount }],
    [{ pendingCount }],
    [{ customerCount }],
    [{ productCount }],
    [{ newBookingCount }],
    recentOrders,
  ] = await Promise.all([
    db.select({ revenue: sql<number>`coalesce(sum(${orders.total}), 0)` }).from(orders).where(eq(orders.status, "paid")),
    db.select({ paidCount: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "paid")),
    db.select({ pendingCount: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "pending")),
    db.select({ customerCount: sql<number>`count(*)` }).from(customers),
    db.select({ productCount: sql<number>`count(*)` }).from(products).where(eq(products.isActive, true)),
    db.select({ newBookingCount: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "new")),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ]);

  const cards = [
    { label: "Орлого (төлөгдсөн)", value: formatPrice(revenue), href: "/admin/orders" },
    { label: "Төлөгдсөн захиалга", value: String(paidCount), href: "/admin/orders" },
    { label: "Хүлээгдэж буй захиалга", value: String(pendingCount), href: "/admin/orders" },
    { label: "Бүртгэлтэй хэрэглэгч", value: String(customerCount), href: "/admin/customers" },
    { label: "Идэвхтэй бараа", value: String(productCount), href: "/admin/products" },
    { label: "Шинэ уулзалтын хүсэлт", value: String(newBookingCount), href: "/admin/bookings" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase">Тойм</h1>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="border border-line-strong bg-bg-0 p-5 transition-colors hover:border-chalk"
          >
            <div className="text-2xl font-bold text-amber-dim">{c.value}</div>
            <div className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-muted">{c.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Сүүлийн захиалгууд</h2>
      {recentOrders.length === 0 ? (
        <p className="border border-dashed border-line-strong px-6 py-10 text-center text-muted">
          Одоогоор захиалга алга.
        </p>
      ) : (
        <div className="border border-line-strong bg-bg-0">
          {recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-b-0">
              <div>
                <span className="font-semibold">#{o.orderNo}</span>{" "}
                <span className="text-sm text-muted">
                  · {o.customerName} · {formatTimestamp(o.createdAt)}
                </span>
              </div>
              <span className="font-bold">{formatPrice(o.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
