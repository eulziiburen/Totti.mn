"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useCart } from "@/components/CartProvider";
import { getAccountStatus } from "@/app/account/actions";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [account, setAccount] = useState<{ loggedIn: boolean; name?: string } | null>(null);
  const { totalCount, openDrawer } = useCart();

  useEffect(() => {
    getAccountStatus().then(setAccount).catch(() => setAccount({ loggedIn: false }));
  }, []);

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
            alt="ТОТТИ Спортын Агентлаг"
            width={220}
            height={88}
            priority
            className="h-9 w-auto rounded-lg transition-[background-color,padding] duration-200 dark:bg-[#f5f4f0] dark:px-2.5 dark:py-1"
          />
        </a>

        <div className="hidden items-center gap-1 text-sm font-semibold uppercase tracking-wide md:flex">
          {navLinks.map((link) =>
            link.href === "/delguur" ? (
              <a
                key={link.href}
                href={link.href}
                className="ml-2 whitespace-nowrap rounded-full bg-amber px-4 py-2 text-ink transition-all hover:-translate-y-0.5 hover:bg-amber-dim"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-muted transition-colors hover:bg-bg-1 hover:text-chalk"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center md:flex">
            {searchOpen && (
              <form action="/delguur" method="get" className="mr-1">
                <input
                  type="text"
                  name="q"
                  autoFocus
                  placeholder="Бараа хайх…"
                  className="w-40 border-0 border-b-2 border-line-strong bg-transparent py-1.5 text-sm outline-none focus:border-amber"
                />
              </form>
            )}
            <button
              type="button"
              aria-label="Хайх"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-chalk transition-colors hover:border-chalk"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </div>
          <ThemeSwitch />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
              client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
          <a
            href={account?.loggedIn ? "/account" : "/account/login"}
            aria-label={account?.loggedIn ? `Миний бүртгэл (${account.name})` : "Нэвтрэх"}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-chalk transition-colors hover:border-chalk"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" />
            </svg>
            {account?.loggedIn && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-0 bg-amber" />
            )}
          </a>
          <button
            type="button"
            aria-label="Сагс нээх"
            onClick={openDrawer}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-chalk transition-colors hover:border-chalk"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L4 2H2" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[11px] font-bold text-ink">
                {totalCount}
              </span>
            )}
          </button>
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
            {link.label}
          </a>
        ))}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
            client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
        <a
          href="/meeting"
          onClick={() => setMenuOpen(false)}
          className="mt-4 inline-flex items-center justify-center gap-2.5 rounded-full bg-amber px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink"
        >
          Хамтран ажиллах
        </a>
      </div>
    </header>
  );
}
