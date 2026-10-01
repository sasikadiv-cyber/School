import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { PrincipalMessage } from "@/components/principal-message";
import { AboutUs } from "@/components/about-us";
import { NewsEvents } from "@/components/news-events";
import { Academics } from "@/components/academics";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main id="home" className="relative bg-surface text-fg">
      <Navbar />
      <Hero />
      <PrincipalMessage />
      <AboutUs />
      <NewsEvents />
      <Academics />
      <Footer />
    </main>
  );
}
