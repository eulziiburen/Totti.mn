import { aboutItems } from "@/lib/data";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function About() {
  return (
    <section id="about" className="py-[120px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 px-8 min-[900px]:grid-cols-2 min-[900px]:gap-16">
        <RevealOnScroll>
          <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">Бидний зарчим</p>
          <p className="mt-[18px] font-display text-[clamp(26px,2.6vw,34px)] normal-case leading-[1.25] text-chalk">
            Бид тоглолтын статистик шиг л{" "}
            <span className="text-amber">тодорхой, шударга, шалгагдсан</span> тоонуудаар
            ажилладаг агентлаг.
          </p>
        </RevealOnScroll>
        <RevealOnScroll className="mt-9 flex flex-col gap-5">
          {aboutItems.map((item) => (
            <div
              key={item.idx}
              className="group flex items-start gap-4.5 rounded-2xl border-b border-line p-3 pb-5 transition-all hover:border-transparent hover:bg-bg-1"
            >
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber/10 font-mono text-sm text-amber-dim transition-colors group-hover:bg-amber group-hover:text-ink">
                {item.idx}
              </div>
              <div>
                <h4 className="mb-1.5 text-base font-semibold">{item.title}</h4>
                <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
