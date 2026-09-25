import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Scoreboard } from "@/components/Scoreboard";
import { About } from "@/components/About";
import { Roster } from "@/components/Roster";
import { Services } from "@/components/Services";
import { Partners } from "@/components/Partners";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { getPartners, getRosterPlayers, getScoreboardStats, getServices } from "@/lib/content";
import { getI18n } from "@/lib/locale";
import { alternatesFor, organizationJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return { alternates: alternatesFor("/", locale) };
}

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const [players, services, partners, stats] = await Promise.all([
    getRosterPlayers(locale),
    getServices(locale),
    getPartners(),
    getScoreboardStats(locale),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd(t.meta.description)} />
      <Header />
      <main>
        <Hero />
        <Scoreboard stats={stats} />
        <About />
        <Roster players={players} />
        <Services items={services} />
        <Partners items={partners} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
