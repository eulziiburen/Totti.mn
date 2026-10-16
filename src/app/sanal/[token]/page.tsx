import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { db } from "@/db/client";
import { crmOfferViews } from "@/db/schema";
import { getCrmUser } from "@/lib/crm-auth";
import { findCrmDocBy, listCrmDocs, type CrmDoc } from "@/lib/crm-store";
import { normalizeUrl, youtubeEmbedUrl } from "@/lib/video";

// A club's offer page: the players Totti has put forward to that club (CRM deals that
// haven't failed). Reached only through the unguessable link made in the CRM, so it's
// kept out of search engines. Shows public facts only, never salary, share or notes.

export const metadata: Metadata = {
  title: "Тоглогчийн санал · ТОТТИ",
  robots: { index: false, follow: false },
};

const FAILED_STAGE = "Амжилтгүй";

type OfferPlayer = {
  id: string;
  name: string;
  pos: string;
  height: string;
  age: string;
  country: string;
  links: string[];
};

const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v).trim() : "");

function toOfferPlayer(p: CrmDoc & { id: string }): OfferPlayer {
  const links = Array.isArray(p.links) ? p.links.map(str).filter(Boolean).map(normalizeUrl) : [];
  return {
    id: p.id,
    name: str(p.name),
    pos: str(p.pos),
    height: str(p.height),
    age: str(p.age),
    country: str(p.country),
    links: links.filter((u) => /^https?:\/\//i.test(u)),
  };
}

function heightLabel(cm: string) {
  const n = parseFloat(cm);
  if (!n || n < 120 || n > 240) return cm;
  const inches = Math.round(n / 2.54);
  return `${Math.round(n)} см · ${Math.floor(inches / 12)}'${inches % 12}"`;
}

function linkLabel(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (/youtu/.test(host)) return "Видео";
    if (/eurobasket|usbasket|realgm|proballers/.test(host)) return "Профайл";
    return host;
  } catch {
    return "Холбоос";
  }
}

export default async function OfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{16}$/.test(token)) notFound();

  const club = await findCrmDocBy("clubs", "shareToken", token);
  if (!club) notFound();

  const [deals, players] = await Promise.all([listCrmDocs("deals"), listCrmDocs("players")]);
  const offered = deals
    .filter((d) => d.clubId === club.id && d.stage !== FAILED_STAGE)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .map((d) => players.find((p) => p.id === d.playerId))
    .filter((p): p is CrmDoc & { id: string } => !!p)
    .map(toOfferPlayer)
    .filter((p, i, all) => all.findIndex((x) => x.id === p.id) === i);

  // Count opens by the club, not by the team checking the link from the CRM.
  if (!(await getCrmUser())) {
    await db
      .insert(crmOfferViews)
      .values({
        clubId: club.id,
        at: new Date().toISOString(),
        userAgent: (await headers()).get("user-agent")?.slice(0, 300) ?? null,
      })
      .catch((err) => console.error("offer view log failed", err));
  }

  return (
    <>
      <Header />
      <main className="pb-[90px] pt-[110px]">
        <div className="mx-auto max-w-[1180px] px-8 max-[600px]:px-4">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-amber">ТОТТИ · Тоглогчийн санал</p>
          <h1 className="mt-3 font-display text-4xl uppercase leading-none max-[600px]:text-3xl">{str(club.name)}</h1>
          <p className="mt-4 max-w-[640px] text-muted">
            Танай багт санал болгож буй тоглогчид. Дэлгэрэнгүй мэдээлэл, гэрээний нөхцөлийн талаар доорх
            утас, имэйлээр холбогдоно уу.
          </p>

          {offered.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-line p-8 text-muted">Одоогоор санал болгосон тоглогч алга.</p>
          ) : (
            <div className="mt-10 grid gap-6 min-[901px]:grid-cols-2">
              {offered.map((p) => {
                const embed = p.links.map(youtubeEmbedUrl).find(Boolean) ?? null;
                const facts = [
                  p.pos && { label: "Байрлал", value: p.pos },
                  p.height && { label: "Өндөр", value: heightLabel(p.height) },
                  p.age && { label: "Нас", value: p.age },
                  p.country && { label: "Иргэншил", value: p.country },
                ].filter((f): f is { label: string; value: string } => !!f);
                return (
                  <article key={p.id} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-bg-0">
                    {embed && (
                      <div className="relative aspect-video bg-black">
                        <iframe
                          src={embed}
                          title={`${p.name} — видео`}
                          loading="lazy"
                          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full border-0"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-5 p-6">
                      <h2 className="font-display text-2xl uppercase leading-tight">{p.name}</h2>
                      {facts.length > 0 && (
                        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
                          {facts.map((f) => (
                            <div key={f.label} className="bg-bg-0 px-4 py-3">
                              <dt className="text-[11px] font-bold uppercase tracking-[.1em] text-muted">{f.label}</dt>
                              <dd className="mt-0.5 font-semibold">{f.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {p.links.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-2">
                          {p.links.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-amber hover:text-amber"
                            >
                              {linkLabel(url)} ↗
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl border border-line p-6">
            <p className="font-semibold">Сонирхсон тоглогч байна уу?</p>
            <a href="tel:+97688602941" className="rounded-full bg-amber px-5 py-2.5 text-sm font-extrabold text-ink">
              +976 88602941
            </a>
            <a href="mailto:info@totti.mn" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
              info@totti.mn
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
