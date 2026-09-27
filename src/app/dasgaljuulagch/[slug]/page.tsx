import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getCoach } from "@/lib/content";
import { getI18n } from "@/lib/locale";
import { linkHost } from "@/lib/links";
import { coachPath } from "@/lib/paths";
import { alternatesFor, localizedPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { normalizeUrl, youtubeEmbedUrl } from "@/lib/video";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const coach = await getCoach(slug, locale);
  if (!coach) return {};

  const title = `${coach.name} · ${coach.role}`;
  const description = (coach.bio ?? `${coach.name}, ${coach.role}, ${coach.team}. ${t.coach.metaSuffix}`).replace(/\s+/g, " ").slice(0, 160);
  return {
    title: `${title} | ${t.meta.siteName}`,
    description,
    alternates: alternatesFor(coachPath(coach.id), locale),
    openGraph: { title, description, type: "profile", images: coach.photo ? [{ url: coach.photo }] : undefined },
  };
}

export default async function CoachPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const coach = await getCoach(slug, locale);
  if (!coach) notFound();

  const embedUrl = coach.videoUrl ? youtubeEmbedUrl(coach.videoUrl) : null;
  const facts = [
    { label: t.coach.role, value: coach.role },
    { label: t.coach.team, value: coach.team },
    coach.experience && { label: t.coach.experience, value: coach.experience },
    coach.license && { label: t.coach.license, value: coach.license },
  ].filter((f): f is { label: string; value: string } => !!f);

  const pageUrl = `${SITE_URL}${localizedPath(coachPath(coach.id), locale)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${pageUrl}#person`,
        name: coach.name,
        url: pageUrl,
        image: coach.photo,
        description: coach.bio?.replace(/\s+/g, " ").slice(0, 300),
        jobTitle: `Basketball coach · ${coach.role}`,
        memberOf: coach.team ? { "@type": "SportsTeam", name: coach.team, sport: "Basketball" } : undefined,
        award: coach.achievements.length ? coach.achievements : undefined,
        affiliation: { "@id": `${SITE_URL}/#organization` },
        sameAs: coach.links?.map((l) => l.url),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.meta.siteName, item: `${SITE_URL}${localizedPath("/", locale)}` },
          { "@type": "ListItem", position: 2, name: t.nav.coaches, item: `${SITE_URL}${localizedPath("/", locale)}#coaches` },
          { "@type": "ListItem", position: 3, name: coach.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="pb-[90px] pt-[110px]">
        <div className="mx-auto max-w-[1180px] px-8 max-[600px]:px-4">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
              client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
          <a href="/#coaches" className="text-xs font-bold uppercase tracking-[.14em] text-muted transition-colors hover:text-chalk">
            {t.coach.back}
          </a>

          <section
            className="relative mt-6 grid overflow-hidden rounded-3xl text-white min-[901px]:grid-cols-[1.15fr_1fr]"
            style={{
              background:
                "radial-gradient(80% 90% at 0% 0%, rgba(212,175,55,.16), transparent 60%), linear-gradient(160deg, #1c1a15 0%, #0d0c0a 70%)",
            }}
          >
            {coach.photo && (
              <div className="relative aspect-[4/5] min-[901px]:order-2 min-[901px]:aspect-auto min-[901px]:min-h-[560px]">
                <Image
                  src={coach.photo}
                  alt={coach.name}
                  fill
                  priority
                  sizes="(min-width: 1180px) 520px, (min-width: 901px) 46vw, 100vw"
                  quality={90}
                  className="object-cover object-top brightness-[1.04] contrast-[1.06] saturate-[1.1]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#0d0c0a_0%,rgba(13,12,10,0)_35%)] min-[901px]:bg-[linear-gradient(to_right,#15130f_0%,rgba(21,19,15,0)_30%)]"
                  aria-hidden="true"
                />
              </div>
            )}

            <div className="relative flex flex-col justify-end px-10 pb-10 pt-16 min-[901px]:min-h-[560px] max-[600px]:px-6 max-[600px]:pb-7 max-[600px]:pt-6">
              <div className="relative flex items-center gap-2">
                <span className="rounded-full bg-amber px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[.1em] text-ink">{coach.role}</span>
                {coach.license && <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold tracking-[.04em]">{coach.license}</span>}
              </div>
              <h1 className="relative mt-4.5 font-display text-[clamp(40px,6vw,80px)] uppercase leading-[.95] [overflow-wrap:anywhere]">{coach.name}</h1>
              <div className="relative mt-2.5 text-[15px] text-white/72">{coach.team}</div>
              {coach.experience && (
                <div className="relative mt-6.5 border-t border-white/22 pt-5.5">
                  <b className="block font-display text-[46px] leading-none text-amber max-[600px]:text-[38px]">{coach.experience}</b>
                  <span className="mt-1.5 block text-xs font-semibold uppercase tracking-[.12em] text-white/62">{t.coach.experience}</span>
                </div>
              )}
            </div>
          </section>

          <div className="mt-12 grid gap-12 min-[901px]:grid-cols-[1fr_320px]">
            <div className="min-w-0">
              {coach.achievements.length > 0 && (
                <section className="mb-12">
                  <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.coach.achievements}</p>
                  <ul className="mt-4 grid gap-3">
                    {coach.achievements.map((a) => (
                      <li key={a} className="flex gap-3 rounded-2xl border border-line-strong bg-bg-1 px-5 py-4 text-[15px] font-semibold">
                        <span aria-hidden="true" className="text-amber">
                          ★
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {embedUrl && (
                <section className="mb-12">
                  <div className="aspect-video overflow-hidden rounded-3xl border border-line-strong bg-ink">
                    <iframe
                      src={embedUrl}
                      title={coach.name}
                      className="h-full w-full"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </section>
              )}
              {!embedUrl && coach.videoUrl && (
                <a
                  href={normalizeUrl(coach.videoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-12 inline-flex items-center gap-2.5 rounded-full border border-line-strong px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors hover:border-chalk"
                >
                  {t.player.watchVideo}
                </a>
              )}

              <section>
                <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.coach.bio}</p>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted">{coach.bio ?? t.coach.bioEmpty}</p>
              </section>

              {coach.links && coach.links.length > 0 && (
                <section className="mt-12">
                  <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.player.links}</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {coach.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 rounded-2xl border border-line-strong bg-bg-1 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-amber"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-semibold">{link.label || linkHost(link.url)}</span>
                            <span className="mt-0.5 block truncate text-xs text-muted">{linkHost(link.url)}</span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line-strong text-sm transition-colors group-hover:border-amber group-hover:bg-amber group-hover:text-ink"
                          >
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="flex flex-col gap-6">
              <dl className="rounded-3xl border border-line-strong bg-bg-1 px-7 py-6">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4 border-b border-line py-3 last:border-b-0">
                    <dt className="text-xs font-bold uppercase tracking-[.12em] text-muted">{f.label}</dt>
                    <dd className="text-right text-sm font-semibold">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-3xl bg-amber px-7 py-7 text-ink">
                <h2 className="font-display text-2xl uppercase leading-none">{t.coach.interestTitle}</h2>
                <p className="mt-2.5 text-sm leading-normal">{t.coach.interestLead}</p>
                <a
                  href="/meeting"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5"
                >
                  {t.player.book}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
