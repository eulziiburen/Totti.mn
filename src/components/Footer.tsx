import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-line py-14 pb-10">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
                client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
            <a href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="ТОТТИ Спортын Агентлаг"
                width={280}
                height={112}
                className="h-28 w-auto rounded-lg transition-[background-color,padding] duration-200 dark:bg-[#f5f4f0] dark:px-3.5 dark:py-1.5"
              />
            </a>
          </div>
          <div>
            <h5 className="mb-3.5 text-[13px] uppercase tracking-[0.1em] text-muted">Холбоо барих</h5>
            <a href="tel:+97688602941" className="mb-2 block text-sm text-chalk">
              +976 88602941
            </a>
            <a href="mailto:info@totti.mn" className="mb-2 block text-sm text-chalk">
              info@totti.mn
            </a>
            <p className="mb-2 text-sm text-chalk">Сүхбаатар дүүрэг, Улаанбаатар</p>
          </div>
          <div>
            <h5 className="mb-3.5 text-[13px] uppercase tracking-[0.1em] text-muted">Сүлжээ</h5>
            <a
              href="https://www.instagram.com/tott1sports.agency/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block text-sm text-chalk"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61593814558102"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block text-sm text-chalk"
            >
              Facebook
            </a>
            <a href="#" className="mb-2 block text-sm text-chalk">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-[13px] text-muted">
          <span>© 2026 Нью Тотти ХХК</span>
          <span>Бүх эрх хуулиар хамгаалагдсан</span>
        </div>
      </div>
    </footer>
  );
}
