import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getNews } from "@/lib/content";
import { getI18n } from "@/lib/locale";
import { newsPath } from "@/lib/paths";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.news.metaTitle, description: t.news.lead, alternates: alternatesFor("/medee", locale) };
}

export default async function NewsPage() {
  const { locale, t } = await getI18n();
  const items = await getNews(locale);

  return (
    <>
      <Header />
      <main className="pb-[90px] pt-[150px]">
        <div className="mx-auto max-w-[1180px] px-8 max-[600px]:px-4">
          <div className="mb-14 max-w-[640px]">
            <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.nav.news}</p>
            <h1 className="mt-3.5 font-display text-[clamp(32px,4.5vw,54px)] uppercase leading-[0.92]">
              {t.news.title}
            </h1>
            <p className="mt-4.5 text-base leading-relaxed text-muted">{t.news.lead}</p>
          </div>

          {items.length === 0 ? (
            <p className="rounded-3xl border border-line-strong bg-bg-1 px-7 py-10 text-center text-muted">
              {t.news.empty}
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((n) => (
                <li key={n.slug}>
                  <a
                    href={newsPath(n.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line-strong bg-bg-1 transition-all hover:-translate-y-0.5 hover:border-amber"
                  >
                    {n.image && (
                      <div className="relative aspect-[16/10] bg-bg-0">
                        <Image
                          src={n.image}
                          alt={n.title}
                          fill
                          sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col px-6 py-5">
                      <time dateTime={n.publishedAt} className="font-mono text-xs tracking-[.12em] text-muted">
                        {n.publishedAt.replaceAll("-", ".")}
                      </time>
                      <h2 className="mt-2 text-lg font-bold leading-snug">{n.title}</h2>
                      {n.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{n.summary}</p>}
                      <span className="mt-auto pt-4 text-xs font-bold uppercase tracking-[.12em] text-amber">
                        {t.news.readMore}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
