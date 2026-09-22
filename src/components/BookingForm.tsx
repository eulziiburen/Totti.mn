"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DOW_LONG,
  DOW_SHORT,
  MAIL_TO,
  buildNext14Days,
  formatOptions,
  roleOptions,
  timeOptions,
  type DayOption,
} from "@/lib/booking";
import { createBooking } from "@/app/meeting/actions";

type Errors = Partial<Record<"role" | "date" | "time" | "format" | "contact", string>>;

type Summary = {
  role: string;
  dayLabel: string;
  timeLabel: string;
  formatLabel: string;
  name: string;
  phone: string;
  email: string;
};

function Cell({ label, value, sub, active }: { label: string; value: string; sub: string; active: boolean }) {
  return (
    <div className="min-w-0 border-r border-white/16 px-3.5 pb-4.5 pt-4 last:border-r-0">
      <div className="text-[10px] font-bold uppercase tracking-[.14em] text-white/55">{label}</div>
      <div
        className={`mt-3 font-display text-[30px] leading-none transition-colors sm:text-[40px] ${
          active ? "text-amber" : "text-white/28"
        }`}
        style={{ overflowWrap: "anywhere" }}
      >
        {value}
      </div>
      <div className="mt-2 min-h-[1.3em] text-xs text-white/60">{sub}</div>
    </div>
  );
}

function Sidebar({
  dayLabel,
  dayValue,
  timeLabel,
  timeSub,
  formatLabel,
  formatSub,
}: {
  dayLabel: string;
  dayValue: string;
  timeLabel: string;
  timeSub: string;
  formatLabel: string;
  formatSub: string;
}) {
  return (
    <div className="relative rounded-t-3xl bg-ink text-white min-[980px]:rounded-bl-3xl min-[980px]:rounded-tr-none">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-amber min-[980px]:rounded-tr-none" />
      <aside className="relative flex min-h-[520px] flex-col px-6 pb-9 pt-10 min-[980px]:sticky min-[980px]:top-[110px] sm:px-10 sm:pt-11">
      <a
        href="/"
        className="inline-flex w-fit items-center gap-2 self-start text-[13px] font-semibold text-white/65 transition-colors hover:text-amber"
      >
        ← Нүүр хуудас руу буцах
      </a>
      <h1 className="mt-8.5 font-display text-[clamp(46px,5.4vw,74px)] uppercase leading-[0.95]">
        Уулзалт
        <span className="block text-amber">товлох</span>
      </h1>
      <p className="mt-5.5 max-w-[340px] text-[15px] leading-relaxed text-white/72">
        Тохиромжтой өдөр, цагаа сонгоод үлдээгээрэй. Бид тантай холбогдож уулзалтын цагийг
        баталгаажуулна.
      </p>

      <div
        className="mt-9.5 grid grid-cols-3 rounded-2xl border border-white/22 bg-white/[0.03]"
        aria-live="polite"
        aria-label="Таны сонгосон уулзалтын хураангуй"
      >
        <Cell label="Өдөр" value={dayValue} sub={dayLabel} active={dayLabel !== "сонгоогүй"} />
        <Cell label="Цаг" value={timeLabel} sub={timeSub} active={timeSub !== "сонгоогүй"} />
        <Cell label="Хэлбэр" value={formatLabel} sub={formatSub} active={formatSub !== "сонгоогүй"} />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <div>
          <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-[.14em] text-white/45">
            Утас · дарж залгах
          </span>
          <a
            href="tel:+97688602941"
            className="inline-flex items-center gap-2.5 font-display text-2xl tracking-[.02em] text-white transition-colors hover:text-amber"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-none text-amber">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            +976 88602941
          </a>
        </div>
        <div>
          <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-[.14em] text-white/45">Имэйл</span>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=info%40totti.mn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/78 transition-colors hover:text-amber"
          >
            info@totti.mn
          </a>
        </div>
        <div>
          <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-[.14em] text-white/45">Хаяг</span>
          <p className="text-white/78">Сүхбаатар дүүрэг, Улаанбаатар</p>
        </div>
      </div>
      </aside>
    </div>
  );
}

export function Booking() {
  const [days, setDays] = useState<DayOption[]>([]);
  useEffect(() => setDays(buildNext14Days()), []);

  const [role, setRole] = useState("");
  const [dateIso, setDateIso] = useState("");
  const [time, setTime] = useState("");
  const [format, setFormat] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [mailtoUrl, setMailtoUrl] = useState("");
  const [gmailUrl, setGmailUrl] = useState("");

  const selectedDay = useMemo(() => days.find((d) => d.iso === dateIso) ?? null, [days, dateIso]);
  const selectedTime = timeOptions.find((t) => t.value === time) ?? null;
  const selectedFormat = formatOptions.find((f) => f.value === format) ?? null;

  function clearError(key: keyof Errors) {
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Errors = {};
    const nextInvalid = new Set<string>();

    if (!role) nextErrors.role = "Та хэн болохоо сонгоно уу.";
    if (!selectedDay) nextErrors.date = "Уулзалтын өдрөө сонгоно уу.";
    if (!selectedTime) nextErrors.time = "Тохиромжтой цагийн хүрээгээ сонгоно уу.";
    if (!selectedFormat) nextErrors.format = "Уулзалтын хэлбэрээ сонгоно уу.";

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const emailOk = !trimmedEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedName || (!trimmedPhone && !trimmedEmail) || !emailOk) {
      if (!trimmedName) nextInvalid.add("name");
      if (!trimmedPhone && !trimmedEmail) {
        nextInvalid.add("phone");
        nextInvalid.add("email");
      }
      if (!emailOk) {
        nextInvalid.add("email");
        nextErrors.contact = "Имэйл хаягийн формат буруу байна.";
      } else {
        nextErrors.contact = "Нэрээ бичиж, утас эсвэл имэйлийн аль нэгийг оруулна уу.";
      }
    }

    setErrors(nextErrors);
    setInvalidFields(nextInvalid);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById("bookingFieldset")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!selectedDay || !selectedTime || !selectedFormat) return;

    const dayLabel = `${DOW_LONG[selectedDay.weekday]}, ${selectedDay.month}-р сар ${selectedDay.dayNum} (${selectedDay.iso})`;
    const rows: [string, string][] = [
      ["Хэн", role],
      ["Өдөр", dayLabel],
      ["Цаг", `${selectedTime.value} (${selectedTime.range})`],
      ["Хэлбэр", selectedFormat.value],
      ["Нэр", trimmedName],
      ["Утас", trimmedPhone || "—"],
      ["Имэйл", trimmedEmail || "—"],
    ];
    if (msg.trim()) rows.push(["Зорилго", msg.trim()]);

    const body = `Сайн байна уу,\n\nУулзалт товлох хүсэлт:\n\n${rows
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")}\n\nБаярлалаа.`;
    const subject = `Уулзалт товлох хүсэлт — ${trimmedName}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      MAIL_TO
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailto = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSummary({
      role,
      dayLabel,
      timeLabel: `${selectedTime.value} (${selectedTime.range})`,
      formatLabel: selectedFormat.value,
      name: trimmedName,
      phone: trimmedPhone || "—",
      email: trimmedEmail || "—",
    });
    setGmailUrl(gmail);
    setMailtoUrl(mailto);
    setSubmitted(true);
    window.open(gmail, "_blank", "noopener");

    createBooking({
      role,
      dateIso: selectedDay.iso,
      dayLabel,
      timeSlot: selectedTime.value,
      timeRange: selectedTime.range,
      format: selectedFormat.value,
      formatSub: selectedFormat.sub,
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      message: msg.trim(),
    }).catch(() => {});
  }

  return (
    <div className="grid grid-cols-1 rounded-3xl border border-line-strong bg-bg-0 min-[980px]:grid-cols-[5fr_7fr]">
      <Sidebar
        dayValue={selectedDay ? String(selectedDay.dayNum) : "—"}
        dayLabel={selectedDay ? `${DOW_LONG[selectedDay.weekday]}, ${selectedDay.month}-р сар` : "сонгоогүй"}
        timeLabel={selectedTime ? selectedTime.value : "—"}
        timeSub={selectedTime ? selectedTime.range : "сонгоогүй"}
        formatLabel={selectedFormat ? selectedFormat.value : "—"}
        formatSub={selectedFormat ? selectedFormat.sub : "сонгоогүй"}
      />

      <div className="min-w-0">
        {submitted && summary ? (
          <div className="px-6 py-5 sm:px-10 sm:py-7" tabIndex={-1}>
            <div className="mb-6.5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d0c0a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2 className="font-display text-[clamp(34px,4vw,52px)] uppercase leading-[0.95]">
              Хүсэлт бэлэн боллоо
            </h2>
            <p className="mt-4 max-w-[480px] leading-relaxed text-muted">
              Gmail дээр <b>info@totti.mn</b> руу бэлдсэн захидал шинэ табаар нээгдсэн байх ёстой.
              Gmail-д нэвтэрсэн бол &ldquo;Илгээх&rdquo; товчийг дарж хүсэлтээ дуусгана уу. Таб
              нээгдээгүй бол доорх товчийг дарна уу.
            </p>
            <div className="mt-6.5 border-y border-line">
              {[
                ["Хэн", summary.role],
                ["Өдөр", summary.dayLabel],
                ["Цаг", summary.timeLabel],
                ["Хэлбэр", summary.formatLabel],
                ["Нэр", summary.name],
                ["Утас", summary.phone],
                ["Имэйл", summary.email],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-5 border-b border-line py-3.5 text-[15px] last:border-b-0">
                  <span className="text-muted">{k}</span>
                  <b className="text-right">{v}</b>
                </div>
              ))}
            </div>
            <div className="mt-7.5 flex flex-wrap gap-3.5">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8 py-4 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.3)]"
              >
                Gmail дээр нээх
              </a>
              <a
                href="tel:+97688602941"
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-7.5 py-4.25 text-[13px] font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:border-chalk"
              >
                Залгах
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-7.5 py-4.25 text-[13px] font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:border-chalk"
              >
                Засварлах
              </button>
            </div>
            <p className="mt-4.5 text-[13px]">
              Gmail ашигладаггүй бол{" "}
              <a href={mailtoUrl} className="font-semibold underline">
                өөр имэйл програмаар нээх
              </a>{" "}
              эсвэл <a href="/" className="font-semibold underline">нүүр хуудас руу буцах</a>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="px-6 py-5 sm:px-10 sm:py-7" id="bookingFieldset">
            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-xs font-bold text-amber-dim">01</span> Та хэн бэ?
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {roleOptions.map((opt) => (
                  <label key={opt} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={opt}
                      checked={role === opt}
                      onChange={() => {
                        setRole(opt);
                        clearError("role");
                      }}
                      className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4.5 py-3 text-sm font-semibold transition-all ${
                        role === opt
                          ? "border-ink bg-ink text-white shadow-[inset_0_-3px_0_var(--color-amber)]"
                          : "border-line-strong bg-bg-0 hover:border-chalk"
                      }`}
                    >
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="mt-1.5 text-[13px] font-semibold text-red-600">{errors.role}</p>}
            </fieldset>

            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-xs font-bold text-amber-dim">02</span> Өдөр сонгох{" "}
                <small className="ml-auto text-xs font-medium text-muted">Ирэх 14 хоног</small>
              </legend>
              <div
                className="flex gap-2.5 overflow-x-auto py-0.5 pb-3 pr-6"
                style={{
                  WebkitMaskImage: "linear-gradient(to right,#000 92%,transparent)",
                  maskImage: "linear-gradient(to right,#000 92%,transparent)",
                }}
              >
                {days.map((d) => (
                  <label key={d.iso} className="relative flex-none cursor-pointer">
                    <input
                      type="radio"
                      name="date"
                      value={d.iso}
                      checked={dateIso === d.iso}
                      onChange={() => {
                        setDateIso(d.iso);
                        clearError("date");
                      }}
                      className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span
                      className={`flex w-[72px] flex-col items-center rounded-2xl border px-0 pb-3.5 pt-3 transition-all ${
                        dateIso === d.iso
                          ? "-translate-y-1 border-amber bg-amber text-ink shadow-[0_10px_20px_rgba(212,175,55,0.28)]"
                          : "border-line-strong bg-bg-0 hover:border-chalk"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          dateIso === d.iso ? "text-ink/75" : d.isWeekend ? "text-amber-dim" : ""
                        }`}
                      >
                        {DOW_SHORT[d.weekday]}
                      </span>
                      <span className="mt-2 font-display text-[30px] leading-none">{d.dayNum}</span>
                      <span className={`mt-1.5 text-[11px] ${dateIso === d.iso ? "text-ink/75" : "text-muted"}`}>
                        {d.month}-р сар
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.date && <p className="mt-1.5 text-[13px] font-semibold text-red-600">{errors.date}</p>}
            </fieldset>

            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-xs font-bold text-amber-dim">03</span> Цаг, хэлбэр
              </legend>
              <div className="mb-3.5 flex flex-wrap gap-2.5">
                {timeOptions.map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="time"
                      value={opt.value}
                      checked={time === opt.value}
                      onChange={() => {
                        setTime(opt.value);
                        clearError("time");
                      }}
                      className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4.5 py-3 text-sm font-semibold transition-all ${
                        time === opt.value
                          ? "border-ink bg-ink text-white shadow-[inset_0_-3px_0_var(--color-amber)]"
                          : "border-line-strong bg-bg-0 hover:border-chalk"
                      }`}
                    >
                      {opt.value}
                    </span>
                  </label>
                ))}
              </div>
              {errors.time && <p className="-mt-1 mb-3.5 text-[13px] font-semibold text-red-600">{errors.time}</p>}
              <div className="flex flex-wrap gap-2.5">
                {formatOptions.map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={opt.value}
                      checked={format === opt.value}
                      onChange={() => {
                        setFormat(opt.value);
                        clearError("format");
                      }}
                      className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span
                      className={`flex min-w-[150px] flex-col items-start gap-0.5 rounded-2xl border px-4.5 py-3 text-sm font-semibold transition-all ${
                        format === opt.value
                          ? "border-ink bg-ink text-white shadow-[inset_0_-3px_0_var(--color-amber)]"
                          : "border-line-strong bg-bg-0 hover:border-chalk"
                      }`}
                    >
                      {opt.value}
                      <em className="text-xs font-medium not-italic opacity-70">{opt.sub}</em>
                    </span>
                  </label>
                ))}
              </div>
              {errors.format && <p className="mt-1.5 text-[13px] font-semibold text-red-600">{errors.format}</p>}
            </fieldset>

            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-xs font-bold text-amber-dim">04</span> Холбоо барих мэдээлэл
              </legend>
              <div className="grid grid-cols-1 gap-5.5 min-[640px]:grid-cols-2 min-[640px]:gap-x-6.5">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-muted">
                    Нэр
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Овог нэр"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("contact");
                      setInvalidFields((s) => {
                        const n = new Set(s);
                        n.delete("name");
                        return n;
                      });
                    }}
                    className={`w-full border-0 border-b-2 bg-transparent py-2.5 text-base text-chalk outline-none transition-colors placeholder:text-[#a3a097] focus:border-amber ${
                      invalidFields.has("name") ? "border-red-600" : "border-line-strong"
                    }`}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wide text-muted">
                    Утас
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="8888-8888"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearError("contact");
                      setInvalidFields((s) => {
                        const n = new Set(s);
                        n.delete("phone");
                        return n;
                      });
                    }}
                    className={`w-full border-0 border-b-2 bg-transparent py-2.5 text-base text-chalk outline-none transition-colors placeholder:text-[#a3a097] focus:border-amber ${
                      invalidFields.has("phone") ? "border-red-600" : "border-line-strong"
                    }`}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 min-[640px]:col-span-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-muted">
                    Имэйл
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("contact");
                      setInvalidFields((s) => {
                        const n = new Set(s);
                        n.delete("email");
                        return n;
                      });
                    }}
                    className={`w-full border-0 border-b-2 bg-transparent py-2.5 text-base text-chalk outline-none transition-colors placeholder:text-[#a3a097] focus:border-amber ${
                      invalidFields.has("email") ? "border-red-600" : "border-line-strong"
                    }`}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 min-[640px]:col-span-2">
                  <label htmlFor="msg" className="text-xs font-bold uppercase tracking-wide text-muted">
                    Юуны тухай ярилцах вэ?{" "}
                    <span className="text-xs font-medium normal-case tracking-normal">(заавал биш)</span>
                  </label>
                  <textarea
                    id="msg"
                    name="msg"
                    placeholder="Жишээ нь: гадаадад тоглох боломж, гэрээний хэлэлцээр, спонсорлолт…"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="min-h-24 w-full resize-y border-0 border-b-2 border-line-strong bg-transparent py-2.5 text-base leading-relaxed text-chalk outline-none transition-colors placeholder:text-[#a3a097] focus:border-amber"
                  />
                </div>
              </div>
              {errors.contact && <p className="mt-1.5 text-[13px] font-semibold text-red-600">{errors.contact}</p>}
            </fieldset>

            <div className="mt-2 flex flex-wrap items-center gap-5.5">
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8.5 py-4.5 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.35)]"
              >
                Хүсэлт илгээх →
              </button>
              <p className="max-w-80 text-[13px] leading-relaxed text-muted">
                Энэ нь цаг товлох хүсэлт. Бид тантай холбогдож эцсийн цагийг баталгаажуулна. Яаралтай
                бол{" "}
                <a href="tel:+97688602941" className="font-bold underline">
                  +976 88602941
                </a>{" "}
                руу залгана уу.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
