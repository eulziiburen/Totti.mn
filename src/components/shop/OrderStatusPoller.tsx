"use client";

import { useEffect, useRef, useState } from "react";
import { checkOrderStatus, retryQpayInvoice } from "@/app/delguur/actions";

const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 100; // ~5 minutes

export function OrderStatusPoller({
  orderNo,
  initialStatus,
  hasInvoice,
}: {
  orderNo: string;
  initialStatus: string;
  hasInvoice: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (status !== "pending" || !hasInvoice) return;
    const id = setInterval(async () => {
      attempts.current += 1;
      if (attempts.current > MAX_ATTEMPTS) {
        clearInterval(id);
        return;
      }
      const result = await checkOrderStatus(orderNo);
      if (result.status !== "pending") {
        setStatus(result.status);
        clearInterval(id);
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [orderNo, status, hasInvoice]);

  async function handleRetry() {
    setRetrying(true);
    setRetryError(null);
    const result = await retryQpayInvoice(orderNo);
    if (!result.ok) {
      setRetryError(result.error ?? "Алдаа гарлаа.");
      setRetrying(false);
      return;
    }
    window.location.reload();
  }

  if (status === "paid" || status === "fulfilled") {
    return (
      <div className="rounded-2xl border border-amber bg-amber/10 px-6 py-8 text-center">
        <p className="font-display text-2xl uppercase text-amber-dim">Төлбөр амжилттай хийгдлээ ✓</p>
        <p className="mt-2 text-muted">Таны захиалгыг бид удахгүй холбогдож баталгаажуулна.</p>
      </div>
    );
  }

  if (status === "cancelled" || status === "failed") {
    return (
      <div className="rounded-2xl border border-line-strong bg-bg-1 px-6 py-8 text-center">
        <p className="font-semibold">Энэ захиалга цуцлагдсан байна.</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
            client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
        <a href="/delguur" className="mt-3 inline-block text-sm font-semibold underline">
          Дэлгүүр рүү буцах
        </a>
      </div>
    );
  }

  if (!hasInvoice) {
    return (
      <div className="rounded-2xl border border-line-strong bg-bg-1 px-6 py-8 text-center">
        <p className="font-semibold text-red-600">Төлбөрийн нэхэмжлэх үүсгэгдээгүй байна.</p>
        {retryError && <p className="mt-2 text-[13px] text-red-600">{retryError}</p>}
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-ink disabled:opacity-60"
        >
          {retrying ? "Оролдож байна…" : "Дахин оролдох"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2.5 py-4 text-muted">
      <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
      Төлбөр хүлээгдэж байна…
    </div>
  );
}
