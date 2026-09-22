"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/data";

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(target);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            const duration = 1200;
            const start = performance.now();
            function tick(now: number) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(eased * target));
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <div ref={ref} className="font-mono text-[clamp(30px,4vw,46px)] font-bold tabular-nums text-amber">
      {value}
    </div>
  );
}

export function Scoreboard({ stats }: { stats: Stat[] }) {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-3 px-8 min-[900px]:grid-cols-4 min-[900px]:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-line bg-bg-0/95 px-6 py-8 text-center shadow-[0_16px_40px_rgba(13,12,10,0.08)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-amber/40"
          >
            <Counter target={stat.value} />
            <div className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
