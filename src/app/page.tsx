import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Scoreboard } from "@/components/Scoreboard";
import { About } from "@/components/About";
import { Roster } from "@/components/Roster";
import { Services } from "@/components/Services";
import { Partners } from "@/components/Partners";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Scoreboard />
        <About />
        <Roster />
        <Services />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
