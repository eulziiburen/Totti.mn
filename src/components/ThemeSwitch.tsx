"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";

const options = [
  {
    value: "light",
    label: "light",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "dark",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "system",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="13" rx="1.5" />
        <path d="M8 20h8M12 17v3" />
      </svg>
    ),
  },
] as const;

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => setMounted(true), []);

  return (
    <div
      role="group"
      aria-label={t.theme.group}
      className="flex flex-shrink-0 items-center gap-0.5 rounded-full border border-line-strong p-[3px]"
    >
      {options.map((opt) => {
        const active = mounted && theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={t.theme[opt.label]}
            title={t.theme[opt.label]}
            onClick={() => setTheme(opt.value)}
            className={`flex h-[26px] w-[26px] items-center justify-center rounded-full transition-colors md:h-7 md:w-7 ${
              active ? "bg-amber text-ink" : "text-muted hover:text-chalk"
            }`}
          >
            <span className="h-[15px] w-[15px]">{opt.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
