"use client";

import { useState, useTransition } from "react";
import { deleteOrder, recheckPayment, updateOrderStatus } from "./actions";

const statusOptions = [
  { value: "pending", label: "Хүлээгдэж буй" },
  { value: "paid", label: "Төлөгдсөн" },
  { value: "failed", label: "Амжилтгүй" },
  { value: "cancelled", label: "Цуцалсан" },
  { value: "fulfilled", label: "Хүргэсэн" },
];

const statusColor: Record<string, string> = {
  pending: "bg-amber text-ink",
  paid: "bg-ink text-white",
  failed: "bg-bg-2 text-red-600",
  cancelled: "bg-bg-2 text-muted line-through",
  fulfilled: "bg-bg-2 text-chalk",
};

function formatTimestamp(sqliteTimestamp: string): string {
  const [datePart, timePart] = sqliteTimestamp.split(" ");
  if (!datePart) return sqliteTimestamp;
  const [y, m, d] = datePart.split("-");
  return `${y}.${m}.${d}${timePart ? ` ${timePart.slice(0, 5)}` : ""}`;
}

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

type Item = {
  id: number;
  productName: string;
  variantLabel: string;
  quantity: number;
  lineTotal: number;
};

type Order = {
  id: number;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string | null;
  total: number;
  status: string;
  qpayInvoiceId: string | null;
  createdAt: string;
};

export function OrderRow({ order, items }: { order: Order; items: Item[] }) {
  const [isPending, startTransition] = useTransition();
  const [recheckMsg, setRecheckMsg] = useState<string | null>(null);

  return (
    <div className="border-b border-line px-5 py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-semibold">{order.customerName}</span>
            <span className="text-xs text-muted">· #{order.orderNo}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusColor[order.status] ?? "bg-bg-2"}`}
            >
              {statusOptions.find((s) => s.value === order.status)?.label ?? order.status}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 text-sm">
            <span>📞 {order.customerPhone}</span>
            {order.customerEmail && <span>✉ {order.customerEmail}</span>}
            {order.deliveryAddress && <span>📍 {order.deliveryAddress}</span>}
          </div>
          <ul className="mt-2 flex flex-col gap-0.5 text-sm text-muted">
            {items.map((item) => (
              <li key={item.id}>
                {item.productName}
                {item.variantLabel && item.variantLabel !== "—" ? ` (${item.variantLabel})` : ""} × {item.quantity}{" "}
                — {formatPrice(item.lineTotal)}
              </li>
            ))}
          </ul>
          <div className="mt-1.5 text-sm font-bold">{formatPrice(order.total)}</div>
        </div>
        <div className="flex flex-none flex-col items-end gap-2">
          <span className="text-xs text-muted">{formatTimestamp(order.createdAt)}</span>
          <div className="flex items-center gap-2">
            {order.status === "pending" && order.qpayInvoiceId && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await recheckPayment(order.orderNo);
                    setRecheckMsg(result.status === "paid" ? "Төлөгдсөн ✓" : "Хараахан төлөгдөөгүй");
                  });
                }}
                className="border border-line-strong px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-chalk"
              >
                Дахин шалгах
              </button>
            )}
            <select
              defaultValue={order.status}
              disabled={isPending}
              onChange={(e) =>
                startTransition(() => {
                  updateOrderStatus(order.id, e.target.value);
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
                if (confirm("Энэ захиалгыг устгах уу?")) {
                  startTransition(() => {
                    deleteOrder(order.id);
                  });
                }
              }}
              className="border border-line-strong px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:border-red-600"
            >
              Устгах
            </button>
          </div>
          {recheckMsg && <span className="text-[11px] font-semibold text-amber-dim">{recheckMsg}</span>}
        </div>
      </div>
    </div>
  );
}
