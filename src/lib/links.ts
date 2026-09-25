import { normalizeUrl } from "./video";

export type PlayerLink = { label: string; url: string };

const MAX_LINKS = 20;

// Parses the stored JSON and keeps only well-formed http(s) links.
export function parseLinks(json: string | null | undefined): PlayerLink[] {
  let raw: unknown;
  try {
    raw = JSON.parse(json || "[]");
  } catch {
    return [];
  }
  return sanitizeLinks(raw);
}

export function sanitizeLinks(raw: unknown): PlayerLink[] {
  if (!Array.isArray(raw)) return [];
  const links: PlayerLink[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = String((item as PlayerLink).label ?? "").trim();
    const urlText = String((item as PlayerLink).url ?? "").trim();
    if (!urlText) continue;
    let url: URL;
    try {
      url = new URL(normalizeUrl(urlText));
    } catch {
      continue;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    links.push({ label: label.slice(0, 80), url: url.toString() });
    if (links.length >= MAX_LINKS) break;
  }
  return links;
}

export function linkHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
