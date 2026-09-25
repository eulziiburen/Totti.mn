"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/LocaleProvider";

function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitch() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    saveLocale(next);
    // A "?lang=" in the URL outranks the cookie, so it has to change with it.
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      if (next === "en") url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");
      startTransition(() => router.replace(url.pathname + url.search + url.hash, { scroll: false }));
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`flex flex-shrink-0 items-center gap-0.5 rounded-full border border-line-strong p-[3px] transition-opacity ${
        pending ? "opacity-60" : ""
      }`}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          onClick={() => choose(l)}
          className={`flex h-[26px] min-w-[30px] items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold uppercase tracking-wide transition-colors md:h-7 md:min-w-[34px] ${
            locale === l ? "bg-amber text-ink" : "text-muted hover:text-chalk"
          }`}
        >
          {l === "mn" ? "MN" : "EN"}
        </button>
      ))}
    </div>
  );
}
