"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { createOrder } from "@/app/delguur/actions";

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

export function CheckoutForm({
  prefill,
}: {
  prefill?: { name: string; email: string; phone: string };
}) {
  const { items, totalPrice, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!name || !phone) {
      setError("Нэр, утасны дугаараа бөглөнө үү.");
      return;
    }
    if (items.length === 0) {
      setError("Сагс хоосон байна.");
      return;
    }

    setSubmitting(true);
    const result = await createOrder({
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      customer: {
        name,
        phone,
        email: String(form.get("email") ?? "").trim(),
        address: String(form.get("address") ?? "").trim(),
        note: String(form.get("note") ?? "").trim(),
      },
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      return;
    }

    clear();
    // Full navigation — this codebase deliberately avoids next/link / router.push for
    // cross-page moves due to a confirmed Next.js client-nav scroll-restoration bug.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/delguur/order/${result.orderNo}`;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-line-strong bg-bg-0 px-6 py-16 text-center">
        <p className="text-muted">Сагс хоосон байна.</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
            client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
        <a href="/delguur" className="mt-4 inline-block text-sm font-semibold underline">
          Дэлгүүр рүү буцах
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 rounded-3xl border border-line-strong bg-bg-0 p-6 sm:p-10 lg:grid-cols-[5fr_7fr]">
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">Захиалгын дэлгэрэнгүй</h2>
        <ul className="flex flex-col gap-4 border-b border-line pb-5">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-3">
              <div className="relative h-14 w-14 flex-none overflow-hidden rounded-xl bg-bg-1">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" unoptimized />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.productName}</p>
                {item.variantLabel && item.variantLabel !== "—" && (
                  <p className="text-[13px] text-muted">
                    {item.variantLabel} · {item.quantity}ш
                  </p>
                )}
              </div>
              <span className="flex-none text-sm font-bold text-amber-dim">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-muted">Нийт төлөх дүн</span>
          <span className="font-display text-2xl">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">Холбоо барих мэдээлэл</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-[13px] font-bold uppercase tracking-wide text-muted">
              Нэр
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={prefill?.name}
              placeholder="Овог нэр"
              className="border-0 border-b-2 border-line-strong bg-transparent py-2 outline-none focus:border-amber"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-[13px] font-bold uppercase tracking-wide text-muted">
              Утас
            </label>
            <input
              id="phone"
              name="phone"
              required
              defaultValue={prefill?.phone}
              placeholder="8888-8888"
              className="border-0 border-b-2 border-line-strong bg-transparent py-2 outline-none focus:border-amber"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-bold uppercase tracking-wide text-muted">
              Имэйл <span className="font-medium normal-case tracking-normal">(заавал биш)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={prefill?.email}
              placeholder="name@example.com"
              className="border-0 border-b-2 border-line-strong bg-transparent py-2 outline-none focus:border-amber"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-[13px] font-bold uppercase tracking-wide text-muted">
              Хаяг <span className="font-medium normal-case tracking-normal">(заавал биш)</span>
            </label>
            <input
              id="address"
              name="address"
              placeholder="Хүргэлтийн хаяг"
              className="border-0 border-b-2 border-line-strong bg-transparent py-2 outline-none focus:border-amber"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="note" className="text-[13px] font-bold uppercase tracking-wide text-muted">
              Нэмэлт тэмдэглэл <span className="font-medium normal-case tracking-normal">(заавал биш)</span>
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              className="resize-none border-0 border-b-2 border-line-strong bg-transparent py-2 outline-none focus:border-amber"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-[13px] font-semibold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-amber px-8.5 py-4.5 text-sm font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Илгээж байна…" : "Төлбөр төлөх →"}
        </button>
      </form>
    </div>
  );
}
