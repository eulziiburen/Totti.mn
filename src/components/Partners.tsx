import Image from "next/image";
import type { Partner } from "@/lib/data";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getI18n } from "@/lib/locale";

export async function Partners({ items: partners }: { items: Partner[] }) {
  const { t } = await getI18n();
  const track = [...partners, ...partners];

  return (
    <section
      className="border-y border-line py-[120px] text-center"
      style={{
        background:
          "radial-gradient(ellipse 700px 400px at 50% 0%, rgba(212,175,55,0.08), transparent 65%), var(--color-bg-1)",
      }}
    >
      <div className="mx-auto max-w-[1180px] px-8">
        <RevealOnScroll className="mx-auto mb-14 max-w-[640px] text-center">
          <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.partners.eyebrow}</p>
          <h2 className="mt-3.5 font-display text-[clamp(32px,4.5vw,54px)] uppercase leading-[0.92]">
            {t.partners.title}
          </h2>
          <p className="mt-4.5 text-base leading-relaxed text-muted">
            {t.partners.lead}
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          className="mt-4 overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <div className="group flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
            {track.map((partner, i) => (
              <div
                key={partner.name + i}
                className="group flex h-[150px] w-[200px] flex-none items-center justify-center rounded-3xl border border-line bg-[#f5f4f0] px-7 py-8 transition-all hover:-translate-y-1.5 hover:border-amber hover:shadow-[0_20px_40px_rgba(13,12,10,0.1)] min-[720px]:w-[260px] min-[720px]:px-10"
              >
                <Image
                  src={partner.src}
                  alt={i < partners.length ? partner.name : ""}
                  aria-hidden={i >= partners.length}
                  width={200}
                  height={90}
                  className="max-h-full max-w-full object-contain grayscale contrast-[1.1] opacity-55 transition-[filter,opacity] duration-[350ms] group-hover:grayscale-0 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
