"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

export function CartDrawer() {
  const { items, updateQuantity, removeItem, totalPrice, isDrawerOpen, closeDrawer } = useCart();

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Сагс"
      className="fixed inset-0 z-[300] flex justify-end bg-[rgba(13,12,10,0.6)] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
    >
      <div className="flex h-full w-full max-w-[420px] flex-col bg-bg-0 shadow-[0_0_60px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg uppercase tracking-wide">Сагс</h2>
          <button
            type="button"
            aria-label="Хаах"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong hover:border-chalk"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-10 text-center text-muted">Сагс хоосон байна.</p>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-3.5">
                  <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-bg-1">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" unoptimized />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.productName}</p>
                    {item.variantLabel && item.variantLabel !== "—" && (
                      <p className="text-[13px] text-muted">{item.variantLabel}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2.5">
                      <div className="flex items-center rounded-full border border-line-strong">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-sm"
                          aria-label="Хасах"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockAtAdd}
                          className="flex h-7 w-7 items-center justify-center text-sm disabled:opacity-30"
                          aria-label="Нэмэх"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-amber-dim">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="self-start text-[13px] font-semibold text-red-600 underline"
                  >
                    Хасах
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-muted">Нийт</span>
              <span className="font-display text-2xl">{formatPrice(totalPrice)}</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
                client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
            <a
              href="/delguur/checkout"
              onClick={closeDrawer}
              className="flex items-center justify-center gap-2.5 rounded-full bg-amber px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.35)]"
            >
              Захиалах →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
