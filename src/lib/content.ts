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

export async function getRosterPlayers(): Promise<RosterPlayer[]> {
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
    }));
  } catch (err) {
    console.error("getRosterPlayers failed, falling back to static data", err);
    return staticRoster;
  }
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

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const rows = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
    if (rows.length === 0) return staticServices;
    return rows.map((s) => ({
      idx: s.idx,
      title: s.title,
      desc: s.description,
      path: s.iconPath,
    }));
  } catch (err) {
    console.error("getServices failed, falling back to static data", err);
    return staticServices;
  }
}

export async function getScoreboardStats(): Promise<Stat[]> {
  try {
    const rows = await db
      .select()
      .from(scoreboardStatsTable)
      .orderBy(asc(scoreboardStatsTable.sortOrder));
    if (rows.length === 0) return staticScoreboardStats;
    return rows.map((s) => ({ value: s.value, label: s.label }));
  } catch (err) {
    console.error("getScoreboardStats failed, falling back to static data", err);
    return staticScoreboardStats;
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
