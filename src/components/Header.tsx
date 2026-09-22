"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export function Header() {
  const [scrolled, setScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,padding] duration-300 ${
        scrolled
          ? "bg-[rgba(var(--color-surface),0.92)] backdrop-blur-md py-4 border-b border-line"
          : "bg-gradient-to-b from-[rgba(var(--color-surface),0.92)] to-[rgba(var(--color-surface),0)] py-[22px] pb-10"
      }`}
    >
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="ТОТТИ Спортын Агентлаг"
            width={220}
            height={88}
            priority
            className="h-[68px] w-auto rounded-lg transition-[background-color,padding] duration-200 dark:bg-[#f5f4f0] dark:px-3.5 dark:py-1.5"
          />
        </Link>

        <div className="hidden gap-9 text-[13px] font-semibold uppercase tracking-wide md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-chalk"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <Link
            href="/meeting"
            className="hidden border border-line-strong px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:border-amber hover:bg-amber hover:text-ink md:inline-block"
          >
            Хамтран ажиллах
          </Link>
          <button
            type="button"
            aria-label="Цэс нээх"
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
        className={`mx-auto flex max-w-[1180px] flex-col overflow-hidden px-5 transition-[max-height,opacity,padding] duration-300 md:hidden ${
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
            {link.label}
          </a>
        ))}
        <Link
          href="/meeting"
          onClick={() => setMenuOpen(false)}
          className="mt-4 inline-flex items-center justify-center gap-2.5 bg-amber px-8 py-4 text-[13px] font-extrabold uppercase tracking-wider text-ink"
        >
          Хамтран ажиллах
        </Link>
      </div>
    </header>
  );
}
