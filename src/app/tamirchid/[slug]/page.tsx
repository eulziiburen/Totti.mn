import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getRosterPlayer, getRosterPlayers } from "@/lib/content";
import { youtubeEmbedUrl } from "@/lib/video";

export const revalidate = 60;

export async function generateStaticParams() {
  const players = await getRosterPlayers();
  return players.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = await getRosterPlayer(slug);
  if (!player) return {};

  const title = `${player.name} · ${player.pos}`;
  const description =
    player.bio?.slice(0, 160) ?? `${player.name}, ${player.pos}, ${player.team}. ТОТТИ Спортын агентын тамирчин.`;
  return {
    title: `${title} | ТОТТИ Спортын агент`,
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
  const player = await getRosterPlayer(slug);
  if (!player) notFound();

  const embedUrl = player.videoUrl ? youtubeEmbedUrl(player.videoUrl) : null;
  const facts = [
    { label: "Байрлал", value: player.pos },
    { label: "Клуб", value: player.team },
    player.height && { label: "Өндөр", value: player.height },
    player.jersey && { label: "Дугаар", value: player.jersey },
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
            ← Бүх тамирчид
          </a>

          <section className="relative mt-6 overflow-hidden rounded-3xl bg-ink text-white">
            {player.photo && (
              <Image
                src={player.photo}
                alt={player.name}
                fill
                priority
                sizes="(min-width: 1180px) 1180px, 100vw"
                className="object-cover object-[center_20%] brightness-[.8]"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(13,12,10,.96) 0%, rgba(13,12,10,.55) 45%, rgba(13,12,10,.12) 100%)",
              }}
              aria-hidden="true"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-2 font-display text-[clamp(160px,26vw,320px)] leading-[.85] text-transparent [-webkit-text-stroke:2px_rgba(212,175,55,.5)]"
            >
              {player.ghost}
            </div>

            <div className="relative flex min-h-[520px] flex-col justify-end px-10 pb-10 pt-40 max-[600px]:min-h-[440px] max-[600px]:px-6 max-[600px]:pb-7">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber px-3.5 py-1.5 text-xs font-extrabold tracking-[.1em] text-ink">
                  {player.pos}
                </span>
                {player.jersey && (
                  <span className="rounded-full border border-white/40 px-3 py-1 font-display text-sm tracking-[.04em]">
                    {player.jersey}
                  </span>
                )}
              </div>
              <h1 className="mt-4.5 font-display text-[clamp(40px,7vw,88px)] uppercase leading-[.95] [overflow-wrap:anywhere]">
                {player.name}
              </h1>
              <div className="mt-2.5 text-[15px] text-white/72">{player.team}</div>

              {player.stats.length > 0 && (
                <div className="mt-6.5 flex flex-wrap gap-10 border-t border-white/22 pt-5.5 max-[600px]:gap-7">
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
                  <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">Хайлайт</p>
                  <div className="mt-4 aspect-video overflow-hidden rounded-3xl border border-line-strong bg-ink">
                    <iframe
                      src={embedUrl}
                      title={`${player.name} — видео хайлайт`}
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
                  Видео хайлайт үзэх ↗
                </a>
              )}

              <section>
                <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-amber">Намтар</p>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted">
                  {player.bio ?? "Тамирчны дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ."}
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
                <h2 className="font-display text-2xl uppercase leading-none">Энэ тамирчныг сонирхож байна уу?</h2>
                <p className="mt-2.5 text-sm leading-normal">
                  Клуб, скаутуудад гэрээ болон туршилтын талаар бид холбогдоно.
                </p>
                <a
                  href="/meeting"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5"
                >
                  Уулзалт товлох →
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
