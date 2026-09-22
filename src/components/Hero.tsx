import { PdfTriggerLink } from "@/components/PdfTriggerLink";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center pt-[120px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 82% 8%, rgba(212,175,55,0.14), transparent 60%), radial-gradient(ellipse 700px 500px at 10% 100%, rgba(212,175,55,0.06), transparent 60%), var(--color-bg-0)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 hidden pointer-events-none md:block"
        style={{
          background:
            "linear-gradient(90deg, var(--color-bg-0) 0%, var(--color-bg-0) 32%, rgba(var(--color-surface),0.75) 50%, rgba(var(--color-surface),0.35) 68%, rgba(var(--color-surface),0.08) 85%, transparent 97%), url('/images/hero-basketball.png') right center/cover no-repeat",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-55 pointer-events-none md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(var(--color-surface),0.55), rgba(var(--color-surface),0.8)), url('/images/hero-basketball.png') 82% 35%/cover no-repeat",
        }}
      />
      <svg
        className="absolute inset-0 z-0 opacity-50 pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMaxYMin slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="1500" cy="120" r="420" fill="none" stroke="rgba(242,240,234,0.08)" strokeWidth="2" />
        <circle cx="1500" cy="120" r="300" fill="none" stroke="rgba(242,240,234,0.06)" strokeWidth="2" />
        <path d="M 900 900 A 500 500 0 0 1 1440 420" fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="2" />
        <line x1="1440" y1="120" x2="900" y2="120" stroke="rgba(242,240,234,0.06)" strokeWidth="2" />
      </svg>

      <div className="relative z-[2] mx-auto w-full max-w-[1180px] px-8">
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-amber/30 bg-amber/10 py-2 pl-2 pr-4">
          <span className="h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-amber">
            Спортын агентлаг · Улаанбаатар
          </span>
        </div>

        <h1
          className="font-display text-[clamp(40px,6.5vw,92px)] uppercase leading-[0.92] tracking-[0.01em] text-chalk"
          style={{ textShadow: "0 2px 30px rgba(var(--color-surface),0.6)" }}
        >
          ТАНЫ КАРЬЕР
          <br />
          <span className="text-amber"> БИДНИЙ СТРАТЕГИ.</span>
        </h1>

        <p className="mt-7 max-w-[520px] text-[17px] leading-[1.65] text-muted">
          Гэрээ хэлэлцээрээс эхлээд брэндийн түншлэл хүртэл — бид сагсан бөмбөгийн тамирчдын
          карьерын бүхий л үе шатыг стратегийн түвшинд төлөвлөж, мэргэжлийн түвшинд удирдан
          хэрэгжүүлнэ.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/meeting"
            className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8 py-4 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.35)]"
          >
            Уулзалт товлох →
          </a>
          <PdfTriggerLink
            pdfKey="male"
            className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-chalk transition-all hover:-translate-y-0.5 hover:border-chalk"
          >
            Тамирчдыг үзэх
          </PdfTriggerLink>
        </div>
      </div>
    </section>
  );
}
