"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useI18n } from "@/components/LocaleProvider";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-bg-0 py-2.5">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-8">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
            client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
        <a href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt={t.brand.logoAlt}
            width={220}
            height={88}
            priority
            className="h-9 w-auto rounded-lg transition-[background-color,padding] duration-200 dark:bg-[#f5f4f0] dark:px-2.5 dark:py-1"
          />
        </a>

        <div className="hidden items-center gap-1 text-sm font-semibold uppercase tracking-wide md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-muted transition-colors hover:bg-bg-1 hover:text-chalk"
            >
              {t.nav[link.key]}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitch />
          <ThemeSwitch />
          <button
            type="button"
            aria-label={t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 flex-none flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`block h-0.5 w-full bg-chalk transition-transform ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-chalk transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-chalk transition-transform ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        id="mobileMenu"
        className={`mx-auto flex max-w-[1180px] flex-col overflow-hidden rounded-b-3xl px-5 transition-[max-height,opacity,padding] duration-300 md:hidden ${
          menuOpen ? "max-h-[420px] pt-1.5 pb-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="border-b border-line px-0.5 py-3.5 text-[15px] font-semibold uppercase tracking-wide text-chalk"
          >
            {t.nav[link.key]}
          </a>
        ))}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
            client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
        <a
          href="/meeting"
          onClick={() => setMenuOpen(false)}
          className="mt-4 inline-flex items-center justify-center gap-2.5 rounded-full bg-amber px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink"
        >
          {t.nav.partner}
        </a>
      </div>
    </header>
  );
}
