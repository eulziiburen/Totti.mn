import { services } from "@/lib/data";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function Services() {
  return (
    <section id="services" className="py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <RevealOnScroll className="mb-14 max-w-[640px]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber">Юу хийдэг вэ</p>
          <h2 className="mt-3.5 font-display text-[clamp(32px,4.5vw,54px)] uppercase leading-[0.92]">
            ТОГЛООМООС ГАДНАХ ЖИЛ БҮР
          </h2>
          <p className="mt-4.5 text-base leading-relaxed text-muted">
            Талбай дээрх амжилтыг талбайн гадна тогтвортой карьер болгон хувиргах бол бидний ажил.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="grid grid-cols-1 gap-px border border-line bg-line min-[900px]:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.idx}
              className="group relative overflow-hidden bg-bg-0 px-8 py-11 transition-colors hover:bg-bg-1"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 -top-[0.12em] select-none font-display text-[120px] leading-none text-chalk opacity-[0.045] transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-2 group-hover:opacity-[0.09]"
              >
                {service.idx}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-0 bg-amber transition-transform duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-y-100"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="relative z-[1] mb-6 block h-9 w-9 text-amber transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-[-6deg] group-hover:scale-[1.15]"
              >
                <path d={service.path} />
              </svg>
              <h3 className="relative z-[1] mb-3 text-xl font-semibold">{service.title}</h3>
              <p className="relative z-[1] text-sm leading-relaxed text-muted">{service.desc}</p>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
