"use client";

import { useTransition } from "react";
import { deleteBooking, updateBookingStatus } from "./actions";

const statusOptions = [
  { value: "new", label: "Шинэ" },
  { value: "contacted", label: "Холбогдсон" },
  { value: "confirmed", label: "Баталгаажсан" },
  { value: "declined", label: "Цуцалсан" },
];

const statusColor: Record<string, string> = {
  new: "bg-amber text-ink",
  contacted: "bg-bg-2 text-chalk",
  confirmed: "bg-ink text-white",
  declined: "bg-bg-2 text-muted line-through",
};

// Deterministic, locale/timezone-independent formatting (avoids SSR/CSR hydration
// mismatches that Intl/Date.toLocaleString can produce for the same input).
function formatTimestamp(sqliteTimestamp: string): string {
  const [datePart, timePart] = sqliteTimestamp.split(" ");
  if (!datePart) return sqliteTimestamp;
  const [y, m, d] = datePart.split("-");
  return `${y}.${m}.${d}${timePart ? ` ${timePart.slice(0, 5)}` : ""}`;
}

type Booking = {
  id: number;
  role: string;
  dayLabel: string;
  timeSlot: string;
  timeRange: string;
  format: string;
  formatSub: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

export function BookingRow({ booking }: { booking: Booking }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-b border-line px-5 py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-semibold">{booking.name || "Нэргүй"}</span>
            <span className="text-xs text-muted">· {booking.role}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusColor[booking.status] ?? "bg-bg-2"}`}
            >
              {statusOptions.find((s) => s.value === booking.status)?.label ?? booking.status}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted">
            {booking.dayLabel} · {booking.timeSlot} ({booking.timeRange}) · {booking.format} (
            {booking.formatSub})
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 text-sm">
            {booking.phone && <span>📞 {booking.phone}</span>}
            {booking.email && <span>✉ {booking.email}</span>}
          </div>
          {booking.message && (
            <p className="mt-2 max-w-xl text-sm text-muted">{booking.message}</p>
          )}
        </div>
        <div className="flex flex-none flex-col items-end gap-2">
          <span className="text-xs text-muted">{formatTimestamp(booking.createdAt)}</span>
          <div className="flex items-center gap-2">
            <select
              defaultValue={booking.status}
              disabled={isPending}
              onChange={(e) =>
                startTransition(() => {
                  updateBookingStatus(booking.id, e.target.value);
                })
              }
              className="border border-line-strong bg-bg-0 px-2 py-1.5 text-xs font-semibold uppercase"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (confirm("Энэ хүсэлтийг устгах уу?")) {
                  startTransition(() => {
                    deleteBooking(booking.id);
                  });
                }
              }}
              className="border border-line-strong px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:border-red-600"
            >
              Устгах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
