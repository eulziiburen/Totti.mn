"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { RosterPlayer } from "@/lib/data";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { PdfTriggerLink } from "@/components/PdfTriggerLink";

export function Roster({ players: rosterPlayers }: { players: RosterPlayer[] }) {
  const [activeId, setActiveId] = useState(rosterPlayers[0]?.id ?? "");
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover:hover) and (pointer:fine) and (min-width:901px)");
    setCanHover(mq.matches);
    const listener = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  function focusPanel(i: number) {
    const el = panelRefs.current[(i + rosterPlayers.length) % rosterPlayers.length];
    el?.focus();
  }

  return (
    <section id="roster" className="border-y border-line bg-bg-1 py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <RevealOnScroll className="mb-14 max-w-[640px]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber">Бидний баг</p>
          <h2 className="mt-3.5 font-display text-[clamp(32px,4.5vw,54px)] uppercase leading-[0.92]">
            ТӨЛӨӨЛӨГЧ ТАМИРЧИД
          </h2>
          <p className="mt-4.5 text-base leading-relaxed text-muted">
            Лигийн шилдэг тоглогчдоос ирээдүйтэй залуу авьяас хүртэл — та бүхэнд тохирсон
            тоглогчоо олно.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="flex h-[600px] flex-col gap-2.5 min-[901px]:flex-row max-[900px]:h-auto">
          {rosterPlayers.map((player, i) => {
            const active = player.id === activeId;
            return (
              <article
                key={player.id}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                tabIndex={0}
                role="button"
                aria-expanded={active}
                aria-label={`${player.name}, ${player.pos}`}
                onClick={() => setActiveId(player.id)}
                onFocus={() => setActiveId(player.id)}
                onMouseEnter={() => canHover && setActiveId(player.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId(player.id);
                  }
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    focusPanel(i + 1);
                  }
                  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    focusPanel(i - 1);
                  }
                }}
                className={`group relative min-w-0 cursor-pointer overflow-hidden rounded-3xl bg-ink text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] max-[900px]:h-[88px] max-[900px]:flex-none max-[900px]:transition-[height] ${
                  active
                    ? "flex-[3.4_1_0%] cursor-default max-[900px]:h-[470px]"
                    : "flex-[1_1_0%]"
                }`}
              >
                <span
                  className={`absolute inset-x-0 top-0 z-[4] h-1 origin-left scale-x-0 bg-amber transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
                    active ? "scale-x-100" : ""
                  }`}
                  aria-hidden="true"
                />

                {player.photo && (
                  <Image
                    src={player.photo}
                    alt=""
                    fill
                    sizes="(min-width: 901px) 40vw, 100vw"
                    className={`absolute inset-0 object-cover object-[center_20%] transition-[filter,transform] duration-[1200ms] ease-out ${
                      active ? "scale-100 grayscale-0 brightness-[.85]" : "scale-[1.06] grayscale brightness-[.6]"
                    }`}
                  />
                )}
                <div
                  className="absolute inset-0 z-[1]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(13,12,10,.96) 0%, rgba(13,12,10,.55) 45%, rgba(13,12,10,.12) 100%)",
                  }}
                  aria-hidden="true"
                />

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-5 top-[18px] z-[2] whitespace-nowrap font-display text-[300px] leading-[.85] tracking-[.01em] text-transparent transition-colors duration-500 [-webkit-text-stroke:2px_rgba(255,255,255,.16)] group-hover:[-webkit-text-stroke-color:rgba(212,175,55,.45)] max-[900px]:left-auto max-[900px]:right-3.5 max-[900px]:top-[-26px] max-[900px]:text-[230px] ${
                    active ? "[-webkit-text-stroke-color:rgba(212,175,55,.6)]" : ""
                  }`}
                >
                  {player.ghost}
                </div>

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 z-[3] transition-opacity duration-300 ${
                    active ? "opacity-0" : ""
                  }`}
                >
                  <span className="absolute right-5 top-5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-amber/80 text-lg leading-none text-amber transition-colors group-hover:bg-amber group-hover:text-ink max-[900px]:right-4.5 max-[900px]:top-[27px] max-[900px]:h-8 max-[900px]:w-8">
                    +
                  </span>
                  <span className="absolute bottom-6.5 left-5.5 whitespace-nowrap font-display text-3xl uppercase tracking-[.03em] [writing-mode:vertical-rl] rotate-180 max-[900px]:[writing-mode:horizontal-tb] max-[900px]:rotate-0 max-[900px]:left-5.5 max-[900px]:bottom-auto max-[900px]:top-7 max-[900px]:text-[26px]">
                    {player.name}
                  </span>
                </div>

                <div
                  className={`absolute inset-x-0 bottom-0 z-[3] w-full min-w-[340px] px-10 pb-10 transition-[opacity,transform] max-[900px]:min-w-0 max-[900px]:px-6 max-[900px]:pb-7 ${
                    active
                      ? "translate-y-0 pointer-events-auto opacity-100 duration-500 delay-300"
                      : "translate-y-[18px] pointer-events-none opacity-0 duration-300"
                  }`}
                  style={{ width: "min(580px, 100%)" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber px-3.5 py-1.5 text-[11px] font-extrabold tracking-[.1em] text-ink">
                      {player.pos}
                    </span>
                    {player.jersey && (
                      <span className="rounded-full border border-white/40 px-3 py-1 font-display text-sm tracking-[.04em]">
                        {player.jersey}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4.5 font-display text-[clamp(44px,5vw,68px)] uppercase leading-[.95] max-[900px]:text-[clamp(30px,9vw,44px)] max-[900px]:[overflow-wrap:anywhere]">
                    {player.name}
                  </h3>
                  <div className="mt-2.5 text-[15px] text-white/72">{player.team}</div>
                  <div className="mt-6.5 flex gap-10 border-t border-white/22 pt-5.5 max-[900px]:gap-7">
                    {player.stats.map((s) => (
                      <div key={s.label}>
                        <b className="block font-display text-[46px] leading-none tabular-nums text-amber max-[900px]:text-[38px]">
                          {s.value}
                        </b>
                        <span className="mt-1.5 block text-[11px] font-semibold tracking-[.12em] text-white/62">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </RevealOnScroll>

        <RevealOnScroll
          className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-line-strong bg-bg-1 px-9 py-8"
        >
          <div>
            <h3 className="font-display text-[28px] uppercase leading-none tracking-[.01em]">
              Тоглогчдын танилцуулга 2026–27
            </h3>
            <p className="mt-2 text-[15px] leading-normal text-muted">
              Эрэгтэй, эмэгтэй тоглогчдын бүрэн жагсаалт — байрлал, өндөр, нас, туршлага, EuroBasket
              профайл.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PdfTriggerLink
              pdfKey="male"
              className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8 py-4 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.3)]"
            >
              Эрэгтэй тоглогчид →
            </PdfTriggerLink>
            <PdfTriggerLink
              pdfKey="female"
              className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-chalk transition-all hover:-translate-y-0.5 hover:border-chalk"
            >
              Эмэгтэй тоглогчид →
            </PdfTriggerLink>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
