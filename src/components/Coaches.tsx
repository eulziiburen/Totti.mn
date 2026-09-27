import Image from "next/image";
import type { Coach } from "@/lib/data";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getI18n } from "@/lib/locale";
import { coachPath } from "@/lib/paths";

// Hidden entirely until at least one coach is published from the admin
export async function Coaches({ items }: { items: Coach[] }) {
  if (items.length === 0) return null;
  const { t } = await getI18n();

  return (
    <section id="coaches" className="py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <RevealOnScroll className="mb-14 max-w-[640px]">
          <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.coaches.eyebrow}</p>
          <h2 className="mt-3.5 font-display text-[clamp(32px,4.5vw,54px)] uppercase leading-[0.92]">{t.coaches.title}</h2>
          <p className="mt-4.5 text-base leading-relaxed text-muted">{t.coaches.lead}</p>
        </RevealOnScroll>

        <RevealOnScroll className="grid grid-cols-1 gap-5 sm:grid-cols-2 min-[900px]:grid-cols-3">
          {items.map((coach) => (
            // eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a>, same as the player cards (scroll-restoration bug with <Link>)
            <a
              key={coach.id}
              href={coachPath(coach.id)}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl text-white transition-transform duration-300 hover:-translate-y-1.5"
              style={{
                background:
                  "radial-gradient(circle at 30% 0%, rgba(212,175,55,.16), transparent 60%), linear-gradient(160deg, #1c1a15 0%, #0d0c0a 70%)",
              }}
            >
              {coach.photo && (
                <Image
                  src={coach.photo}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 380px, (min-width: 640px) 50vw, 100vw"
                  quality={85}
                  className="object-cover object-[center_20%] grayscale-[.35] transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(13,12,10,.92) 0%, rgba(13,12,10,.4) 38%, rgba(13,12,10,0) 62%)" }}
                aria-hidden="true"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-amber transition-transform duration-500 group-hover:scale-x-100"
              />
              <div className="relative px-6 pb-6 [text-shadow:0_2px_14px_rgba(0,0,0,.55)]">
                <span className="rounded-full bg-amber px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-ink [text-shadow:none]">
                  {coach.role}
                </span>
                <h3 className="mt-3 font-display text-[clamp(26px,2.6vw,34px)] uppercase leading-[.95] [overflow-wrap:anywhere]">{coach.name}</h3>
                <div className="mt-1.5 text-[13px] text-white/75">{coach.team}</div>
                {coach.achievements[0] && (
                  <div className="mt-3 border-t border-white/22 pt-3 text-[13px] leading-snug text-white/85">★ {coach.achievements[0]}</div>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-amber">
                  {t.coaches.details}
                </span>
              </div>
            </a>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
