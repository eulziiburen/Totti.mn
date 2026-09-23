"use client";

import { useTransition } from "react";
import { deleteCustomer } from "./actions";

function formatTimestamp(sqliteTimestamp: string): string {
  const [datePart, timePart] = sqliteTimestamp.split(" ");
  if (!datePart) return sqliteTimestamp;
  const [y, m, d] = datePart.split("-");
  return `${y}.${m}.${d}${timePart ? ` ${timePart.slice(0, 5)}` : ""}`;
}

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

export function CustomerRow({ customer, orderCount }: { customer: Customer; orderCount: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-b-0">
      <div>
        <span className="font-semibold">{customer.name}</span>{" "}
        <span className="text-sm text-muted">
          · {customer.email} {customer.phone && `· ${customer.phone}`}
        </span>
        <div className="mt-0.5 text-[13px] text-muted">
          Бүртгүүлсэн: {formatTimestamp(customer.createdAt)} · {orderCount} захиалга
        </div>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Энэ хэрэглэгчийг устгах уу? Захиалгын түүх хадгалагдана.")) {
            startTransition(() => {
              deleteCustomer(customer.id);
            });
          }
        }}
        className="border border-line-strong px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:border-red-600"
      >
        Устгах
      </button>
    </div>
  );
}
