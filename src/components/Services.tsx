import type { ServiceItem } from "@/lib/data";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getI18n } from "@/lib/locale";

export async function Services({ items: services }: { items: ServiceItem[] }) {
  const { t } = await getI18n();
  return (
    <section id="services" className="py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <RevealOnScroll className="mb-14 max-w-[640px]">
          <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.services.eyebrow}</p>
          <h2 className="mt-3.5 font-display text-[clamp(32px,4.5vw,54px)] uppercase leading-[0.92]">
            {t.services.title}
          </h2>
          <p className="mt-4.5 text-base leading-relaxed text-muted">
            {t.services.lead}
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.idx}
              className="group relative overflow-hidden rounded-3xl border border-line bg-bg-0 px-8 py-11 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber/40 hover:shadow-[0_24px_48px_rgba(13,12,10,0.12)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 -top-[0.12em] select-none font-display text-[120px] leading-none text-chalk opacity-[0.045] transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-2 group-hover:opacity-[0.09]"
              >
                {service.idx}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-[3px] origin-left scale-x-0 rounded-full bg-amber transition-transform duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100"
              />
              <div className="relative z-[1] mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/10 transition-colors duration-300 group-hover:bg-amber/15">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="block h-7 w-7 text-amber transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-[-6deg] group-hover:scale-[1.15]"
                >
                  <path d={service.path} />
                </svg>
              </div>
              <h3 className="relative z-[1] mb-3 text-xl font-semibold">{service.title}</h3>
              <p className="relative z-[1] text-sm leading-relaxed text-muted">{service.desc}</p>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
