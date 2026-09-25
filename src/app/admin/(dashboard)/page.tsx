import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db/client";
import { bookings } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [{ newBookingCount }] = await db
    .select({ newBookingCount: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "new"));

  const cards = [
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
    </div>
  );
}
