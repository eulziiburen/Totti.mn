import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { bookings } from "@/db/schema";
import { BookingRow } from "./BookingRow";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase">Уулзалт товлох хүсэлтүүд</h1>
        <span className="text-sm text-muted">{rows.length} хүсэлт</span>
      </div>
      {rows.length === 0 ? (
        <p className="border border-dashed border-line-strong px-6 py-10 text-center text-muted">
          Одоогоор хүсэлт алга.
        </p>
      ) : (
        <div className="border border-line-strong bg-bg-0">
          {rows.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
