"use client";

import { useEffect, useRef, useState } from "react";
import type { TimeSlot } from "@/lib/booking";
import { useI18n } from "@/components/LocaleProvider";

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PAD = Math.floor(VISIBLE_ROWS / 2) * ITEM_HEIGHT;

export function TimeWheel({
  options,
  value,
  onChange,
}: {
  options: TimeSlot[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useI18n();
  const listRef = useRef<HTMLDivElement>(null);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const [centerIndex, setCenterIndex] = useState(initialIndex);

  // keep the wheel in sync if the value is changed externally (e.g. reset)
  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    const el = listRef.current;
    if (idx === -1 || !el) return;
    if (idx !== centerIndex) {
      el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
      setCenterIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(options.length - 1, Math.round(el.scrollTop / ITEM_HEIGHT)));
    setCenterIndex(idx);

    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      const settledIdx = Math.max(
        0,
        Math.min(options.length - 1, Math.round(el.scrollTop / ITEM_HEIGHT))
      );
      const opt = options[settledIdx];
      if (opt && opt.value !== value) onChange(opt.value);
    }, 110);
  }

  function selectIndex(i: number) {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: i * ITEM_HEIGHT, behavior: "smooth" });
    setCenterIndex(i);
    onChange(options[i].value);
  }

  return (
    <div className="relative w-[180px] shrink-0 select-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 rounded-xl border-y-2 border-amber bg-amber/5"
        style={{ height: ITEM_HEIGHT }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-bg-0) 5%, transparent 38%, transparent 62%, var(--color-bg-0) 95%)",
        }}
      />

      <div
        ref={listRef}
        role="listbox"
        aria-label={t.booking.wheelAria}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            selectIndex(Math.min(options.length - 1, centerIndex + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            selectIndex(Math.max(0, centerIndex - 1));
          }
        }}
        className="no-scrollbar overflow-y-auto scroll-smooth outline-none focus-visible:outline-none"
        style={{
          height: ITEM_HEIGHT * VISIBLE_ROWS,
          scrollSnapType: "y mandatory",
          paddingTop: PAD,
          paddingBottom: PAD,
        }}
      >
        {options.map((opt, i) => {
          const dist = Math.abs(i - centerIndex);
          return (
            <div
              key={opt.value}
              role="option"
              aria-selected={i === centerIndex}
              onClick={() => selectIndex(i)}
              className="flex cursor-pointer items-center justify-center font-mono font-semibold tabular-nums transition-all duration-150"
              style={{
                height: ITEM_HEIGHT,
                scrollSnapAlign: "center",
                opacity: dist === 0 ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.28 : 0.12,
                fontSize: dist === 0 ? 22 : dist === 1 ? 17 : 15,
                color: dist === 0 ? "var(--color-chalk)" : "var(--color-muted)",
                transform: `scale(${dist === 0 ? 1 : 0.92})`,
              }}
            >
              {opt.range}
            </div>
          );
        })}
      </div>
    </div>
  );
}
