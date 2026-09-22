import { RevealOnScroll } from "@/components/RevealOnScroll";

export function CTA() {
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
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber">Дараагийн шат</p>
        </RevealOnScroll>
        <RevealOnScroll className="mt-3.5">
          <h2 className="font-display text-[clamp(36px,6vw,72px)] uppercase leading-[0.92]">
            ЦАГ ЗАРЦУУЛАХГҮЙ,
            <br />
            ШУУД ТОГЛООМД ОРНО
          </h2>
        </RevealOnScroll>
        <RevealOnScroll className="mt-4.5">
          <p className="text-base text-muted">Тамирчин уу, эсвэл клубын төлөөлөгч үү — бидэнтэй ярилцъя.</p>
        </RevealOnScroll>
        <RevealOnScroll className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:info@totti.mn"
            className="inline-flex items-center gap-2.5 bg-amber px-8 py-4 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.25)]"
          >
            info@totti.mn
          </a>
          <a
            href="tel:+97688602941"
            className="inline-flex items-center gap-2.5 border border-line-strong px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-chalk transition-colors hover:border-chalk"
          >
            Залгах: +976 8860-2941
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
