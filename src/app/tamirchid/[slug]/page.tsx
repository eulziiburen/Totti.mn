import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getRosterPlayer } from "@/lib/content";
import { youtubeEmbedUrl } from "@/lib/video";
import { getI18n } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const player = await getRosterPlayer(slug, locale);
  if (!player) return {};

  const title = `${player.name} · ${player.pos}`;
  const description = player.bio?.slice(0, 160) ?? `${player.name}, ${player.pos}, ${player.team}. ${t.player.metaSuffix}`;
  return {
    title: `${title} | ${t.meta.siteName}`,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: player.photo ? [{ url: player.photo }] : undefined,
    },
  };
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const player = await getRosterPlayer(slug, locale);
  if (!player) notFound();

  const embedUrl = player.videoUrl ? youtubeEmbedUrl(player.videoUrl) : null;
  const facts = [
    { label: t.player.position, value: player.pos },
    { label: t.player.club, value: player.team },
    player.height && { label: t.player.height, value: player.height },
    player.jersey && { label: t.player.jersey, value: player.jersey },
  ].filter((f): f is { label: string; value: string } => !!f);

  return (
    <>
      <Header />
      <main className="pb-[90px] pt-[110px]">
        <div className="mx-auto max-w-[1180px] px-8 max-[600px]:px-4">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
              client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
          <a
            href="/#roster"
            className="text-xs font-bold uppercase tracking-[.14em] text-muted transition-colors hover:text-chalk"
          >
            {t.player.back}
          </a>

          <section
            className="relative mt-6 grid overflow-hidden rounded-3xl text-white min-[901px]:grid-cols-[1.15fr_1fr]"
            style={{
              background:
                "radial-gradient(80% 90% at 0% 0%, rgba(212,175,55,.16), transparent 60%), linear-gradient(160deg, #1c1a15 0%, #0d0c0a 70%)",
            }}
          >
            {player.photo && (
              <div className="relative aspect-[4/5] min-[901px]:order-2 min-[901px]:aspect-auto min-[901px]:min-h-[560px]">
                <Image
                  src={player.photo}
                  alt={player.name}
                  fill
                  priority
                  sizes="(min-width: 1180px) 520px, (min-width: 901px) 46vw, 100vw"
                  quality={90}
                  className="object-cover object-top brightness-[1.04] contrast-[1.06] saturate-[1.1]"
                />
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  style={{
                    background:
                      "radial-gradient(90% 70% at 100% 0%, rgba(232,196,90,.55), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(212,175,55,.25), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                {/* Fade the photo into the dark text panel: downward on mobile, leftward on desktop */}
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#0d0c0a_0%,rgba(13,12,10,0)_35%)] min-[901px]:bg-[linear-gradient(to_right,#15130f_0%,rgba(21,19,15,0)_30%)]"
                  aria-hidden="true"
                />
              </div>
            )}

            <div className="relative flex flex-col justify-end px-10 pb-10 pt-16 min-[901px]:min-h-[560px] max-[600px]:px-6 max-[600px]:pb-7 max-[600px]:pt-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-6 top-4 font-display text-[clamp(140px,20vw,260px)] leading-[.85] text-transparent [-webkit-text-stroke:2px_rgba(212,175,55,.35)] max-[900px]:hidden"
              >
                {player.ghost}
              </div>
              <div className="relative flex items-center gap-2">
                <span className="rounded-full bg-amber px-3.5 py-1.5 text-xs font-extrabold tracking-[.1em] text-ink">
                  {player.pos}
                </span>
                {player.jersey && (
                  <span className="rounded-full border border-white/40 px-3 py-1 font-display text-sm tracking-[.04em]">
                    {player.jersey}
                  </span>
                )}
              </div>
              <h1 className="relative mt-4.5 font-display text-[clamp(40px,6vw,80px)] uppercase leading-[.95] [overflow-wrap:anywhere]">
                {player.name}
              </h1>
              <div className="relative mt-2.5 text-[15px] text-white/72">{player.team}</div>

              {player.stats.length > 0 && (
                <div className="relative mt-6.5 flex flex-wrap gap-10 border-t border-white/22 pt-5.5 max-[600px]:gap-7">
                  {player.stats.map((s) => (
                    <div key={s.label}>
                      <b className="block font-display text-[46px] leading-none tabular-nums text-amber max-[600px]:text-[38px]">
                        {s.value}
                      </b>
                      <span className="mt-1.5 block text-xs font-semibold tracking-[.12em] text-white/62">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="mt-12 grid gap-12 min-[901px]:grid-cols-[1fr_320px]">
            <div className="min-w-0">
              {embedUrl && (
                <section className="mb-12">
                  <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.player.highlight}</p>
                  <div className="mt-4 aspect-video overflow-hidden rounded-3xl border border-line-strong bg-ink">
                    <iframe
                      src={embedUrl}
                      title={`${player.name} — ${t.player.videoTitle}`}
                      className="h-full w-full"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </section>
              )}
              {!embedUrl && player.videoUrl && (
                <a
                  href={player.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-12 inline-flex items-center gap-2.5 rounded-full border border-line-strong px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors hover:border-chalk"
                >
                  {t.player.watchVideo}
                </a>
              )}

              <section>
                <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">{t.player.bio}</p>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted">
                  {player.bio ?? t.player.bioEmpty}
                </p>
              </section>
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
                <h2 className="font-display text-2xl uppercase leading-none">{t.player.interestTitle}</h2>
                <p className="mt-2.5 text-sm leading-normal">
                  {t.player.interestLead}
                </p>
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
