"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DOW_LONG,
  MAIL_TO,
  buildNext14Days,
  formatOptions,
  roleOptions,
  timeOptions,
  type DayOption,
} from "@/lib/booking";
import { createBooking } from "@/app/meeting/actions";
import { TimeWheel } from "@/components/TimeWheel";
import { useI18n } from "@/components/LocaleProvider";

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
      <div className="text-[11px] font-bold uppercase tracking-[.14em] text-white/55">{label}</div>
      <div
        className={`mt-3 font-display text-[30px] leading-none transition-colors sm:text-[40px] ${
          active ? "text-amber" : "text-white/28"
        }`}
        style={{ overflowWrap: "anywhere" }}
      >
        {value}
      </div>
      <div className="mt-2 min-h-[1.3em] text-[13px] text-white/60">{sub}</div>
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
  const { t } = useI18n();
  const b = t.booking;
  return (
    <div className="relative rounded-t-3xl bg-ink text-white min-[980px]:rounded-bl-3xl min-[980px]:rounded-tr-none">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-amber min-[980px]:rounded-tr-none" />
      <aside className="relative flex min-h-[520px] flex-col px-6 pb-9 pt-10 min-[980px]:sticky min-[980px]:top-[110px] sm:px-10 sm:pt-11">
      <a
        href="/"
        className="inline-flex w-fit items-center gap-2 self-start text-sm font-semibold text-white/65 transition-colors hover:text-amber"
      >
        {b.back}
      </a>
      <h1 className="mt-8.5 font-display text-[clamp(46px,5.4vw,74px)] uppercase leading-[0.95]">
        {b.title1}
        <span className="block text-amber">{b.title2}</span>
      </h1>
      <p className="mt-5.5 max-w-[340px] text-[15px] leading-relaxed text-white/72">
        {b.lead}
      </p>

      <div
        className="mt-9.5 grid grid-cols-3 rounded-2xl border border-white/22 bg-white/[0.03]"
        aria-live="polite"
        aria-label={b.summaryAria}
      >
        <Cell label={b.day} value={dayValue} sub={dayLabel} active={dayLabel !== b.notSelected} />
        <Cell label={b.time} value={timeLabel} sub={timeSub} active={timeSub !== b.notSelected} />
        <Cell label={b.format} value={formatLabel} sub={formatSub} active={formatSub !== b.notSelected} />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <div>
          <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-[.14em] text-white/45">
            {b.phoneTap}
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
          <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-[.14em] text-white/45">{b.email}</span>
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
          <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-[.14em] text-white/45">{b.address}</span>
          <p className="text-white/78">{t.brand.address}</p>
        </div>
      </div>
      </aside>
    </div>
  );
}

export function Booking() {
  const { locale, t } = useI18n();
  const b = t.booking;
  const monthLabel = (month: number) =>
    locale === "en"
      ? new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(2000, month - 1, 1))
      : `${month}${b.monthSuffix}`;
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
  const formatIndex = formatOptions.findIndex((f) => f.value === format);
  const selectedFormat = formatIndex >= 0 ? formatOptions[formatIndex] : null;
  const selectedFormatText = formatIndex >= 0 ? b.formats[formatIndex] : null;
  const roleText = (value: string) => b.roles[roleOptions.indexOf(value)] ?? value;

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

    if (!role) nextErrors.role = b.errRole;
    if (!selectedDay) nextErrors.date = b.errDate;
    if (!selectedTime) nextErrors.time = b.errTime;
    if (!selectedFormat) nextErrors.format = b.errFormat;

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
        nextErrors.contact = b.errEmail;
      } else {
        nextErrors.contact = b.errContact;
      }
    }

    setErrors(nextErrors);
    setInvalidFields(nextInvalid);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById("bookingFieldset")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!selectedDay || !selectedTime || !selectedFormat || !selectedFormatText) return;

    // Stored for the admin in Mongolian regardless of the visitor's language.
    const dayLabel = `${DOW_LONG[selectedDay.weekday]}, ${selectedDay.month}-р сар ${selectedDay.dayNum} (${selectedDay.iso})`;
    const localDayLabel = `${b.dowLong[selectedDay.weekday]}, ${monthLabel(selectedDay.month)} ${selectedDay.dayNum} (${selectedDay.iso})`;
    const timeLabel = `${selectedTime.range}${b.hoursSuffix}`;
    const rows: [string, string][] = [
      [b.who, roleText(role)],
      [b.day, localDayLabel],
      [b.time, timeLabel],
      [b.format, selectedFormatText.value],
      [b.name, trimmedName],
      [b.phone, trimmedPhone || "—"],
      [b.email, trimmedEmail || "—"],
    ];
    if (msg.trim()) rows.push([b.purpose, msg.trim()]);

    const body = `${b.mailGreeting}\n\n${b.mailIntro}\n\n${rows
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")}\n\n${b.mailThanks}`;
    const subject = `${b.mailSubject} — ${trimmedName}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      MAIL_TO
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailto = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSummary({
      role: roleText(role),
      dayLabel: localDayLabel,
      timeLabel,
      formatLabel: selectedFormatText.value,
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
        dayLabel={selectedDay ? `${b.dowLong[selectedDay.weekday]}, ${monthLabel(selectedDay.month)}` : b.notSelected}
        timeLabel={selectedTime ? selectedTime.range : "—"}
        timeSub={selectedTime ? b.ubTime : b.notSelected}
        formatLabel={selectedFormatText ? selectedFormatText.value : "—"}
        formatSub={selectedFormatText ? selectedFormatText.sub : b.notSelected}
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
              {b.doneTitle}
            </h2>
            <p className="mt-4 max-w-[480px] leading-relaxed text-muted">
              {b.doneLead1} <b>info@totti.mn</b> {b.doneLead2}
            </p>
            <div className="mt-6.5 border-y border-line">
              {[
                [b.who, summary.role],
                [b.day, summary.dayLabel],
                [b.time, summary.timeLabel],
                [b.format, summary.formatLabel],
                [b.name, summary.name],
                [b.phone, summary.phone],
                [b.email, summary.email],
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
                className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.3)]"
              >
                {b.openGmail}
              </a>
              <a
                href="tel:+97688602941"
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-7.5 py-4.25 text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:border-chalk"
              >
                {b.call}
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-7.5 py-4.25 text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:border-chalk"
              >
                {b.edit}
              </button>
            </div>
            <p className="mt-4.5 text-sm">
              {b.noGmail1}{" "}
              <a href={mailtoUrl} className="font-semibold underline">
                {b.noGmailLink}
              </a>{" "}
              {b.noGmail2} <a href="/" className="font-semibold underline">{b.backHome}</a>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="px-6 py-5 sm:px-10 sm:py-7" id="bookingFieldset">
            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-[13px] font-bold text-amber-dim">01</span> {b.step1}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {roleOptions.map((opt, i) => (
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
                      {b.roles[i]}
                    </span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="mt-1.5 text-sm font-semibold text-red-600">{errors.role}</p>}
            </fieldset>

            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-[13px] font-bold text-amber-dim">02</span> {b.step2}{" "}
                <small className="ml-auto text-[13px] font-medium text-muted">{b.next14}</small>
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
                        className={`text-xs font-bold uppercase tracking-wider ${
                          dateIso === d.iso ? "text-ink/75" : d.isWeekend ? "text-amber-dim" : ""
                        }`}
                      >
                        {b.dowShort[d.weekday]}
                      </span>
                      <span className="mt-2 font-display text-[30px] leading-none">{d.dayNum}</span>
                      <span className={`mt-1.5 text-xs ${dateIso === d.iso ? "text-ink/75" : "text-muted"}`}>
                        {monthLabel(d.month)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.date && <p className="mt-1.5 text-sm font-semibold text-red-600">{errors.date}</p>}
            </fieldset>

            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-[13px] font-bold text-amber-dim">03</span> {b.step3}{" "}
                <small className="ml-auto text-[13px] font-medium text-muted">{b.ubHours}</small>
              </legend>
              <div className="mb-3.5 flex items-center gap-4">
                <TimeWheel
                  options={timeOptions}
                  value={time}
                  onChange={(v) => {
                    setTime(v);
                    clearError("time");
                  }}
                />
                <p className="text-sm leading-relaxed text-muted">
                  {b.wheelHint}
                </p>
              </div>
              {errors.time && <p className="-mt-1 mb-3.5 text-sm font-semibold text-red-600">{errors.time}</p>}
              <div className="flex flex-wrap gap-2.5">
                {formatOptions.map((opt, i) => (
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
                      {b.formats[i].value}
                      <em className="text-[13px] font-medium not-italic opacity-70">{b.formats[i].sub}</em>
                    </span>
                  </label>
                ))}
              </div>
              {errors.format && <p className="mt-1.5 text-sm font-semibold text-red-600">{errors.format}</p>}
            </fieldset>

            <fieldset className="mb-8.5 min-w-0 border-0 p-0">
              <legend className="mb-4 flex w-full items-baseline gap-3 border-b border-line pb-3 text-base font-bold">
                <span className="font-mono text-[13px] font-bold text-amber-dim">04</span> {b.step4}
              </legend>
              <div className="grid grid-cols-1 gap-5.5 min-[640px]:grid-cols-2 min-[640px]:gap-x-6.5">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="name" className="text-[13px] font-bold uppercase tracking-wide text-muted">
                    {b.name}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={b.namePlaceholder}
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
                  <label htmlFor="phone" className="text-[13px] font-bold uppercase tracking-wide text-muted">
                    {b.phone}
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
                  <label htmlFor="email" className="text-[13px] font-bold uppercase tracking-wide text-muted">
                    {b.email}
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
                  <label htmlFor="msg" className="text-[13px] font-bold uppercase tracking-wide text-muted">
                    {b.topic}{" "}
                    <span className="text-[13px] font-medium normal-case tracking-normal">{b.optional}</span>
                  </label>
                  <textarea
                    id="msg"
                    name="msg"
                    placeholder={b.topicPlaceholder}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="min-h-24 w-full resize-y border-0 border-b-2 border-line-strong bg-transparent py-2.5 text-base leading-relaxed text-chalk outline-none transition-colors placeholder:text-[#a3a097] focus:border-amber"
                  />
                </div>
              </div>
              {errors.contact && <p className="mt-1.5 text-sm font-semibold text-red-600">{errors.contact}</p>}
            </fieldset>

            <div className="mt-2 flex flex-wrap items-center gap-5.5">
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8.5 py-4.5 text-sm font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.35)]"
              >
                {b.submit}
              </button>
              <p className="max-w-80 text-sm leading-relaxed text-muted">
                {b.note1}{" "}
                <a href="tel:+97688602941" className="font-bold underline">
                  +976 88602941
                </a>
                {b.note2}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
