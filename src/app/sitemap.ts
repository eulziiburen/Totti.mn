import type { MetadataRoute } from "next";
import { getRosterPlayers } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { playerPath } from "@/lib/paths";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const players = await getRosterPlayers();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/meeting`, changeFrequency: "monthly", priority: 0.6 },
    ...players.map((p) => ({
      url: `${SITE_URL}${playerPath(p.id)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
