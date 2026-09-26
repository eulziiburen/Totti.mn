import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getNewsItem } from "@/lib/content";
import { getI18n } from "@/lib/locale";
import { newsPath } from "@/lib/paths";
import { alternatesFor, localizedPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const item = await getNewsItem(slug, locale);
  if (!item) return {};

  const description = (item.summary ?? item.body).replace(/\s+/g, " ").slice(0, 160);
  return {
    title: `${item.title} | ${t.meta.siteName}`,
    description,
    alternates: alternatesFor(newsPath(item.slug), locale),
    openGraph: {
      title: item.title,
      description,
      type: "article",
      publishedTime: item.publishedAt,
      images: item.image ? [{ url: item.image }] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const item = await getNewsItem(slug, locale);
  if (!item) notFound();

  const pageUrl = `${SITE_URL}${localizedPath(newsPath(item.slug), locale)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    url: pageUrl,
    image: item.image ? [item.image] : undefined,
    datePublished: item.publishedAt,
    description: (item.summary ?? item.body).replace(/\s+/g, " ").slice(0, 300),
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="pb-[90px] pt-[110px]">
        <article className="mx-auto max-w-[820px] px-8 max-[600px]:px-4">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
              client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
          <a
            href="/medee"
            className="text-xs font-bold uppercase tracking-[.14em] text-muted transition-colors hover:text-chalk"
          >
            {t.news.back}
          </a>
          <time dateTime={item.publishedAt} className="mt-8 block font-mono text-xs tracking-[.12em] text-amber">
            {item.publishedAt.replaceAll("-", ".")}
          </time>
          <h1 className="mt-3 font-display text-[clamp(32px,5vw,60px)] uppercase leading-[.95] [overflow-wrap:anywhere]">
            {item.title}
          </h1>
          {item.summary && <p className="mt-5 text-lg leading-relaxed text-muted">{item.summary}</p>}
          {item.image && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-line-strong bg-bg-1">
              <Image src={item.image} alt={item.title} fill priority sizes="(min-width: 820px) 760px, 100vw" className="object-cover" />
            </div>
          )}
          <div className="mt-8 whitespace-pre-line text-base leading-relaxed">{item.body}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
