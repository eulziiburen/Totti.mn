import { aboutItems } from "@/lib/data";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export function About() {
  return (
    <section id="about" className="py-[120px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 px-8 min-[900px]:grid-cols-2 min-[900px]:gap-16">
        <RevealOnScroll>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber">Бидний зарчим</p>
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
              className="group flex gap-4.5 border-b border-line pb-5 transition-[padding-left,border-color] hover:pl-2.5 hover:border-amber"
            >
              <div className="inline-block pt-0.5 font-mono text-sm text-amber-dim transition-[color,transform] group-hover:scale-[1.35] group-hover:text-amber">
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
