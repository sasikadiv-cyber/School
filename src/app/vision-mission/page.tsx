import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HeartHandshake,
  Music,
  Quote,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/eyebrow";

export const metadata = {
  title: "Vision & Mission — St. Thomas' College",
  description:
    "The vision, mission and enduring values that guide every classroom at St. Thomas' College, Matale.",
};

const missionPoints = [
  {
    title: "Rigorous Scholarship",
    text: "To hold every student to the highest academic standard while teaching them to love the work itself — not merely the result.",
  },
  {
    title: "Whole-Person Formation",
    text: "To develop the body through sport, the imagination through art, and the conscience through service, as one indivisible education.",
  },
  {
    title: "Character Before Credit",
    text: "To place integrity above achievement, so that every Thomian leaves our gates ready to stand tall in any room in the world.",
  },
  {
    title: "Heritage and Innovation",
    text: "To honour the traditions that made us while equipping every student for a century we cannot yet imagine.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    name: "Discipline",
    text: "The quiet architecture of everything we build — punctuality, precision, and pride in work done properly.",
  },
  {
    icon: BookOpen,
    name: "Wisdom",
    text: "Knowledge that looks beyond the syllabus — judgment, curiosity and the humility to keep learning.",
  },
  {
    icon: Compass,
    name: "Character",
    text: "Doing what is right when no one is watching; the truest measure of a Thomian.",
  },
  {
    icon: HeartHandshake,
    name: "Service",
    text: "Excellence is only worth having when it is spent on others — our classrooms train guardians, not guests.",
  },
];

export default function VisionMissionPage() {
  return (
    <main className="relative bg-surface text-fg">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
        <Image
          src="/images/about.jpg"
          alt="Students studying in the Great Hall Library"
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
              Our Compass Since 1873
            </p>
          </div>
          <h1
            className="animate-fade-up mt-7 max-w-4xl font-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "140ms" }}
          >
            Vision &amp; Mission<span className="text-gold">.</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/65"
            style={{ animationDelay: "280ms" }}
          >
            The convictions that shape every timetable, every assembly and
            every conversation at St. Thomas' College.
          </p>
        </div>
      </section>

      {/* Vision statement */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="rounded-[2rem] bg-card p-10 text-white md:p-16">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ink">
                  <Quote size={20} className="fill-current" />
                </span>
                <Eyebrow tone="light">Our Vision</Eyebrow>
              </div>
              <p className="mt-9 max-w-4xl font-display text-3xl font-medium leading-[1.3] tracking-[-0.01em] md:text-5xl md:leading-[1.25]">
                To nurture generations of Sri Lankan youth whose{" "}
                <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                  intellect
                </span>
                ,{" "}
                <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                  character
                </span>{" "}
                and{" "}
                <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                  compassion
                </span>{" "}
                illuminate their nation and the world.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-surface-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_2fr] lg:items-start">
            <div>
              <Reveal>
                <Eyebrow>Our Mission</Eyebrow>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="mt-7 font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
                  Four promises to every{" "}
                  <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                    family
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-fg/60">
                  A mission statement hangs on many walls. Ours lives in daily
                  practice — here is what we owe every student who walks these
                  corridors.
                </p>
              </Reveal>
            </div>

            <div className="space-y-5">
              {missionPoints.map((m, i) => (
                <Reveal key={m.title} delay={i * 100}>
                  <div className="group flex gap-6 rounded-3xl border border-fg/10 bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-fg/25 md:p-8">
                    <span className="mt-1 h-px w-8 shrink-0 bg-gold" />
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.01em]">
                        {m.title}
                      </h3>
                      <p className="mt-2.5 text-[15px] leading-relaxed text-fg/60">
                        {m.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Colours, Crest & Song */}
      <section id="colours" className="scroll-mt-24 bg-surface-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="flex justify-center">
            <Eyebrow>Colours, Houses &amp; Song</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mx-auto mt-7 max-w-2xl text-center font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              The marks of a{" "}
              <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                Thomian
              </span>
            </h2>
          </Reveal>

          {/* Colours */}
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <Reveal delay={80} className="h-full lg:col-span-2">
              <div className="h-full rounded-3xl bg-card p-8 text-white md:p-10">
                <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold">
                  College Colours
                </p>
                <h3 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
                  Gold and Double Blue
                </h3>
                <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-white/60">
                  Gold for the light of learning and the courage of the motto;
                  the double blue — one light, one deep — for constancy and
                  faith. Worn on the college tie, the first XI cap and every
                  colours blazer awarded on Colours Nite.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    { name: "College Gold", hex: "#FFD444", swatch: "bg-gold" },
                    { name: "Light Blue", hex: "#3E7CB1", swatch: "bg-[#3E7CB1]" },
                    { name: "Deep Blue", hex: "#081428", swatch: "bg-[#081428] border border-white/20" },
                  ].map((c) => (
                    <div key={c.name} className="rounded-2xl border border-white/10 p-4">
                      <span className={`block h-14 w-full rounded-xl ${c.swatch}`} />
                      <p className="mt-3 font-display text-base font-semibold">
                        {c.name}
                      </p>
                      <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-white/45">
                        {c.hex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Houses */}
            <Reveal delay={160} className="h-full">
              <div className="h-full rounded-3xl border border-fg/10 bg-surface p-8 md:p-10">
                <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-fg/45">
                  The Four Houses
                </p>
                <h3 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em]">
                  Austin · Bede · Clement · Pius
                </h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-fg/60">
                  Every Thomian is placed in one of four houses on the day he
                  enrols, and competes for it until the day he leaves — at the
                  inter-house sports meet, the drill competition and the
                  house music festival.
                </p>
                <div className="mt-7 space-y-3">
                  {[
                    { name: "Austin", color: "bg-emerald-600", label: "Green" },
                    { name: "Bede", color: "bg-[#0b2a5b]", label: "Navy Blue" },
                    { name: "Clement", color: "bg-gold", label: "Yellow" },
                    { name: "Pius", color: "bg-red-600", label: "Red" },
                  ].map((h) => (
                    <div
                      key={h.name}
                      className="flex items-center gap-4 rounded-2xl border border-fg/10 px-5 py-3.5 transition-colors hover:border-gold"
                    >
                      <span className={`h-3 w-3 rounded-full ${h.color}`} />
                      <p className="font-display text-lg font-semibold tracking-[-0.01em]">
                        {h.name} House
                      </p>
                      <span className="ml-auto font-sans text-[10px] uppercase tracking-[0.2em] text-fg/45">
                        {h.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* College Song */}
          <Reveal delay={140}>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-fg/10 bg-surface p-8 md:p-10 lg:col-span-3">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ink">
                    <Music size={21} />
                  </span>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-fg/45">
                      The College Song
                    </p>
                    <h3 className="mt-1.5 font-display text-3xl font-semibold tracking-[-0.02em]">
                      Sung by every Thomian, standing
                    </h3>
                  </div>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <div className="rounded-2xl bg-card p-7 text-white md:p-8">
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold">
                      The Refrain
                    </p>
                    <p className="mt-5 font-display text-2xl font-medium italic leading-[1.6] tracking-[-0.01em] md:text-[1.7rem]">
                      &ldquo;Animo et Fide, Thomians true,
                      <br />
                      Gold of the morning, double blue —
                      <br />
                      Courage to strive and faith to stand,
                      <br />
                      Sons of Matale, heart and hand.&rdquo;
                    </p>
                    <span className="mt-6 block h-px w-8 bg-gold" />
                    <p className="mt-4 text-[13px] text-white/50">
                      The refrain as sung at assembly, Prize Giving and the
                      Battle of the Golds.
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="mb-7 overflow-hidden rounded-2xl border border-fg/10 bg-ink">
                      <div className="relative aspect-video w-full">
                        <iframe
                          src="https://www.youtube.com/embed/RL94GHWvcFA"
                          title="St. Thomas' College, Matale — College Song"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                      <p className="bg-card px-5 py-3 font-sans text-[10px] uppercase tracking-[0.22em] text-white/60">
                        Watch · The College Song
                      </p>
                    </div>
                    <p className="text-[15px] leading-relaxed text-fg/65">
                      The college song is sung at the opening of every general
                      assembly, at Prize Giving, at Colours Nite, and — loudest
                      of all — from the pavilion at the Battle of the Golds.
                    </p>
                    <p className="mt-5 text-[15px] leading-relaxed text-fg/65">
                      Old Thomians will tell you that the song is the one thing
                      that never changes: the boy who sang it in 1968 and the
                      boy who sings it today are singing the same four lines,
                      and mean them equally.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2.5">
                      {["Sung at Assembly", "Prize Giving", "Colours Nite", "Big Match"].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-fg/15 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.2em] text-fg/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="flex justify-center">
            <Eyebrow>Our Values</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mx-auto mt-7 max-w-2xl text-center font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              The pillars that hold the College
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.name} delay={i * 100} className="h-full">
                  <div className="flex h-full flex-col rounded-3xl bg-card p-8 text-white transition-all duration-500 hover:-translate-y-1.5">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-ink">
                      <Icon size={19} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.01em]">
                      {v.name}
                    </h3>
                    <span className="mt-4 block h-px w-7 bg-gold" />
                    <p className="mt-4 text-[14px] leading-relaxed text-white/60">
                      {v.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Motto */}
          <Reveal delay={140}>
            <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-fg/10 bg-surface-2 px-8 py-12 text-center md:py-16">
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-fg/40">
                The College Motto
              </p>
              <p className="mt-5 font-display text-4xl font-semibold italic tracking-[-0.02em] md:text-6xl">
                Animo Et Fide
              </p>
              <p className="mt-4 text-[15px] italic text-fg/50">
                — &ldquo;Courage & Faith&rdquo;
              </p>
              <Link
                href="/staff"
                className="group mt-9 inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.25em] text-fg"
              >
                Meet the people who carry it
                <span className="h-px w-10 bg-fg/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold" />
                <ArrowRight size={14} className="slide-arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
