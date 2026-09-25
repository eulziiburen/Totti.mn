import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Scoreboard } from "@/components/Scoreboard";
import { About } from "@/components/About";
import { Roster } from "@/components/Roster";
import { Services } from "@/components/Services";
import { Partners } from "@/components/Partners";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { getPartners, getRosterPlayers, getScoreboardStats, getServices } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function HomePage() {
  const locale = await getLocale();
  const [players, services, partners, stats] = await Promise.all([
    getRosterPlayers(locale),
    getServices(locale),
    getPartners(),
    getScoreboardStats(locale),
  ]);

  return (
    <>
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
