import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Scoreboard } from "@/components/Scoreboard";
import { About } from "@/components/About";
import { Roster } from "@/components/Roster";
import { Services } from "@/components/Services";
import { Partners } from "@/components/Partners";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { getPartners, getRosterPlayers, getServices } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const [players, services, partners] = await Promise.all([
    getRosterPlayers(),
    getServices(),
    getPartners(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Scoreboard />
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
