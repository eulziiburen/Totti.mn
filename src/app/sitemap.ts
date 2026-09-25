import type { MetadataRoute } from "next";
import { getRosterPlayers } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { playerPath } from "@/lib/paths";
import { localizedPath } from "@/lib/seo";

export const revalidate = 3600;

// Each page is listed once per language, with hreflang alternates pointing at each other.
function entries(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap {
  const languages = {
    mn: `${SITE_URL}${path}`,
    en: `${SITE_URL}${localizedPath(path, "en")}`,
  };
  const lastModified = new Date();
  return [
    { url: languages.mn, lastModified, changeFrequency, priority, alternates: { languages } },
    { url: languages.en, lastModified, changeFrequency, priority: priority * 0.9, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const players = await getRosterPlayers();
  return [
    ...entries("/", "weekly", 1),
    ...entries("/meeting", "monthly", 0.6),
    ...players.flatMap((p) => entries(playerPath(p.id), "weekly", 0.8)),
  ];
}
