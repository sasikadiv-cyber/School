import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/eyebrow";
import { Crest } from "@/components/crest";

export const metadata = {
  title: "Clubs & Societies — St. Thomas' College",
  description:
    "Over forty clubs and societies at St. Thomas' College — debating, robotics, chess, drama, music and more.",
};

const clubs = [
  { crest: "DS", name: "Debating Society", members: "38 members", day: "Tue & Thu", note: "National champions 2026", founded: "1986" },
  { crest: "SS", name: "Science Society", members: "120 members", day: "Wednesday", note: "Science fair organisers", founded: "1978" },
  { crest: "RC", name: "Robotics & ICT Circle", members: "64 members", day: "Friday", note: "New lab, opened 2026", founded: "2016" },
  { crest: "CC", name: "Chess Circle", members: "52 members", day: "Mon & Wed", note: "U15 national champions", founded: "1992" },
  { crest: "DT", name: "Drama & Theatre", members: "80 members", day: "Thursday", note: "Annual Shakespeare production", founded: "1981" },
  { crest: "CH", name: "Choir & Classical Music", members: "95 members", day: "Daily, 7 a.m.", note: "All-island gold, 3rd consecutive year", founded: "1976" },
  { crest: "OR", name: "Orchestra", members: "46 members", day: "Wed & Sat", note: "Festival of Strings hosts", founded: "1994" },
  { crest: "PS", name: "Photography Society", members: "57 members", day: "Tuesday", note: "The college archive's keepers", founded: "2003" },
  { crest: "EC", name: "Environmental Circle", members: "110 members", day: "Alternate Fridays", note: "Campus reforestation programme", founded: "1998" },
  { crest: "CM", name: "Catholic Students' Movement", members: "150 members", day: "Monday", note: "The founding faith of the college", founded: "1875" },
  { crest: "UN", name: "Model United Nations", members: "42 members", day: "Friday", note: "CIMUN best delegation 2025", founded: "2008" },
  { crest: "SC", name: "3rd Matale Scout Troop", members: "94 members", day: "Saturday", note: "Founded 1935 · district champions", founded: "1935" },
];

export default function ClubsSocietiesPage() {
  return (
    <main className="relative bg-surface text-fg">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
        <Image
          src="/images/clubs.jpg"
          alt="Students in a society meeting"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-20">
          <div className="animate-fade-up flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-white/70">
              Co-Curricular Life
            </p>
          </div>
          <h1
            className="animate-fade-up mt-7 max-w-4xl font-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "140ms" }}
          >
            Clubs &amp; Societies<span className="text-gold">.</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/65"
            style={{ animationDelay: "280ms" }}
          >
            Forty societies, one rule: every student joins at least two — and
            stays long enough to lead one.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6"
            style={{ animationDelay: "400ms" }}
          >
            {[
              { value: "40+", label: "Active Societies" },
              { value: "2,100+", label: "Memberships Held" },
              { value: "52", label: "Society Prefects" },
              { value: "14", label: "National Titles Held" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold tracking-[-0.02em]">
                  {s.value}
                </p>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.28em] text-white/45">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs grid */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <Eyebrow>The Directory</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-7 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              Our{" "}
              <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                Clubs &amp; Societies
              </span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((c, i) => {
              return (
                <Reveal key={c.name} delay={(i % 3) * 90} className="h-full">
                  <div className="group flex h-full flex-col rounded-2xl border border-fg/10 bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-fg/25 hover:shadow-soft">
                    <div className="flex items-center justify-between">
                      <Crest initials={c.crest} label={c.name} />
                      <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-fg/35">
                        Est. {c.founded}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.01em]">
                      {c.name}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] text-fg/55">{c.note}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-fg/10 pt-4 mt-5">
                      <span className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-fg/45">
                        {c.members}
                      </span>
                      <span className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-fg/45">
                        Meets · {c.day}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={120}>
            <div className="mt-14 flex flex-col items-start justify-between gap-8 rounded-2xl bg-card p-8 text-white md:flex-row md:items-center md:p-12">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.01em]">
                  And twenty-nine more
                </h3>
                <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-white/60">
                  From the Astronomical Society to the Young Zoologists&apos;
                  Circle — and if a club doesn&apos;t exist, any group of eight
                  students may petition the Principal to found it.
                </p>
              </div>
              <Link
                href="/contact?type=Sports & Co-Curricular"
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-white"
              >
                Enquire About Societies
                <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
