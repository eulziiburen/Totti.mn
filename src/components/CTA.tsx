import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getI18n } from "@/lib/locale";

export async function CTA() {
  const { t } = await getI18n();
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-bg-1 py-[110px] text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 animate-cta-pulse rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.18), transparent 60%)",
        }}
      />
      <div className="relative z-[1] mx-auto max-w-[1180px] px-8">
        <RevealOnScroll>
          <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.cta.eyebrow}</p>
        </RevealOnScroll>
        <RevealOnScroll className="mt-3.5">
          <h2 className="font-display text-[clamp(36px,6vw,72px)] uppercase leading-[0.92]">
            {t.cta.title1}
            <br />
            {t.cta.title2}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll className="mt-4.5">
          <p className="text-base text-muted">{t.cta.lead}</p>
        </RevealOnScroll>
        <RevealOnScroll className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:info@totti.mn"
            className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.3)]"
          >
            info@totti.mn
          </a>
          <a
            href="tel:+97688602941"
            className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-8 py-4 text-sm font-bold uppercase tracking-wider text-chalk transition-all hover:-translate-y-0.5 hover:border-chalk"
          >
            {t.cta.call}
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
