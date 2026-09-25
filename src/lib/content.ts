import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import {
  partners as partnersTable,
  playerDocuments as playerDocumentsTable,
  rosterPlayers as rosterTable,
  scoreboardStats as scoreboardStatsTable,
  services as servicesTable,
} from "@/db/schema";
import {
  partners as staticPartners,
  pdfDocuments as staticPdfDocuments,
  rosterPlayers as staticRoster,
  scoreboardStats as staticScoreboardStats,
  services as staticServices,
  type Partner,
  type PdfDocuments,
  type RosterPlayer,
  type ServiceItem,
  type Stat,
} from "./data";
import { localizeContent, type Locale } from "./i18n";
import { decodeSlug } from "./paths";
import { parseLinks } from "./links";

export async function getRosterPlayers(locale: Locale = "mn"): Promise<RosterPlayer[]> {
  try {
    const rows = await db.select().from(rosterTable).orderBy(asc(rosterTable.sortOrder));
    if (rows.length === 0) return staticRoster;
    return rows.map((r) => ({
      id: r.slug,
      ghost: r.ghost,
      pos: r.pos,
      jersey: r.jersey ?? undefined,
      name: r.name,
      team: r.team,
      photo: r.photoUrl ?? undefined,
      stats: JSON.parse(r.statsJson || "[]"),
      height: r.height ?? undefined,
      bio: (locale === "en" ? r.bioEn || r.bio : r.bio) ?? undefined,
      videoUrl: r.videoUrl ?? undefined,
      links: parseLinks(r.linksJson),
    }));
  } catch (err) {
    console.error("getRosterPlayers failed, falling back to static data", err);
    return staticRoster;
  }
}

export async function getRosterPlayer(slug: string, locale: Locale = "mn"): Promise<RosterPlayer | null> {
  const players = await getRosterPlayers(locale);
  const wanted = decodeSlug(slug);
  return players.find((p) => p.id === wanted) ?? null;
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const rows = await db.select().from(partnersTable).orderBy(asc(partnersTable.sortOrder));
    if (rows.length === 0) return staticPartners;
    return rows.map((p) => ({ name: p.name, src: p.logoUrl }));
  } catch (err) {
    console.error("getPartners failed, falling back to static data", err);
    return staticPartners;
  }
}

export async function getServices(locale: Locale = "mn"): Promise<ServiceItem[]> {
  const localizeStatic = (items: ServiceItem[]) =>
    items.map((s) => ({ ...s, title: localizeContent(locale, s.title), desc: localizeContent(locale, s.desc) }));
  try {
    const rows = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
    if (rows.length === 0) return localizeStatic(staticServices);
    return rows.map((s) => ({
      idx: s.idx,
      title: localizeContent(locale, s.title, s.titleEn),
      desc: localizeContent(locale, s.description, s.descriptionEn),
      path: s.iconPath,
    }));
  } catch (err) {
    console.error("getServices failed, falling back to static data", err);
    return localizeStatic(staticServices);
  }
}

export async function getScoreboardStats(locale: Locale = "mn"): Promise<Stat[]> {
  const localizeStatic = (items: Stat[]) => items.map((s) => ({ ...s, label: localizeContent(locale, s.label) }));
  try {
    const rows = await db
      .select()
      .from(scoreboardStatsTable)
      .orderBy(asc(scoreboardStatsTable.sortOrder));
    if (rows.length === 0) return localizeStatic(staticScoreboardStats);
    return rows.map((s) => ({ value: s.value, label: localizeContent(locale, s.label, s.labelEn) }));
  } catch (err) {
    console.error("getScoreboardStats failed, falling back to static data", err);
    return localizeStatic(staticScoreboardStats);
  }
}

export async function getPlayerDocuments(): Promise<PdfDocuments> {
  try {
    const rows = await db.select().from(playerDocumentsTable);
    if (rows.length === 0) return staticPdfDocuments;
    const result: PdfDocuments = { ...staticPdfDocuments };
    for (const row of rows) {
      const key = row.key;
      if (key === "male" || key === "female") {
        result[key] = { name: row.fileName, url: row.url, label: row.label };
      }
    }
    return result;
  } catch (err) {
    console.error("getPlayerDocuments failed, falling back to static data", err);
    return staticPdfDocuments;
  }
}
