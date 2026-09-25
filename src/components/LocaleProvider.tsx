"use client";

import { createContext, useContext } from "react";
import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; t: Dictionary }>({
  locale: "mn",
  t: getDictionary("mn"),
});

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, t: getDictionary(locale) }}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  return useContext(LocaleContext);
}
