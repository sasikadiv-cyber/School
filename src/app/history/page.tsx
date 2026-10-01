import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/eyebrow";
import { PORTRAIT } from "@/lib/media";

export const metadata = {
  title: "Our History — St. Thomas' College, Matale",
  description:
    "From a church verandah in 1873 to a leading boys' school in Matale — the story of St. Thomas' College.",
};

type Milestone = {
  year: string;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
};

const milestones: Milestone[] = [
  {
    year: "1873",
    title: "The Church Verandah",
    text: "Founded on 10 August 1873 by the Catholic Church in the verandah of a small mud-and-wattle church in Matale. The first roll call: seventy-five boys and twelve girls.",
  },
  {
    year: "1876",
    title: "Two Schools, One Founding",
    text: "Rev. Fr. Aloysius J. M. Marrer divides the school into separate boys' and girls' institutions. Leo de Silva leads the boys' school; Rosa Perera leads the girls', which becomes St. Agnes Convent — today's St. Thomas' Girls' School.",
  },
  {
    year: "1880",
    title: "The Half-Century Priest",
    text: "Rev. Fr. Pius Fernando arrives from Negombo in January 1880. He spends half a century of his priestly life in Matale, shaping the college until his death in 1930.",
    image: "/images/hero.jpg",
    imageAlt: "The college campus",
  },
  {
    year: "1901",
    title: "Robinson Memorial Hall",
    text: "The Robinson Memorial Hall is built on land donated by John Croos of Negombo. More than a century later, it remains the heart of the college.",
    image: "/images/about.jpg",
    imageAlt: "Robinson Memorial Hall reading room",
  },
  {
    year: "1923",
    title: "The Robinson Era",
    text: "Charles Robinson is appointed headmaster on 1 September 1923, serving thirty-five years until 1958. Around him serve headmasters J. M. Direckse, A. S. Scharnignivel, L. D'w. Jayasighe and C. J. Rodrigo — with Joseph Master, the beloved pupil-teacher of 1904, retiring in 1946.",
  },
  {
    year: "1935",
    title: "3rd Matale Scout Troop",
    text: "The Scout Troop 3rd Matale is inaugurated with F. de S. Gunawardena as Scout Master and S. B. Pamunuwa as his assistant — a tradition of service that continues today.",
  },
  {
    year: "1938",
    title: "The Cadet Platoon",
    text: "The Cadet Platoon (Junior) is inaugurated on 10 December 1938 under the charge of J. B. Madasekara, with Lt. E. A. Perusinghe later taking command.",
  },
  {
    year: "1953",
    title: "The Old Thomians' Association",
    text: "A group of former students of Charles Robinson founds the Old Boys' Association with his support, with K. M. D. Jayanetti as founder President. Revitalised decisively in 1983 with the backing of Principal A. J. Wijesinghe, MOTA today unites four local and three overseas branches.",
  },
  {
    year: "1958",
    title: "The Modern Era",
    text: "Robinson retires and is succeeded by D. Aidan de Silva, beginning the modern line of principals: W. B. Gopallawa, A. J. Wijesinghe, Upali Weragama, J. H. M. W. Ranjith, E. M. P. Ekanayake, Dampiya Wanasinghe, K. A. J. Kulasuriya and D. M. W. Dissanayake.",
    image: "/images/principal.jpg",
    imageAlt: "The college leadership",
  },
  {
    year: "2020",
    title: "Principal Dhammika Hewawasam",
    text: "Mr. Dhammika Hewawasam is appointed Principal. Today the college educates more than 2,000 boys from Grade 6 to the Advanced Level, served by over 140 staff.",
  },
];

const legacy = [
  { value: "153", label: "Years in Matale" },
  { value: "2,000+", label: "Students Today" },
  { value: "140+", label: "Staff & Educators" },
  { value: "4", label: "College Houses" },
];

const oldThomians = [
  { name: "Gen. Shavendra Silva", note: "23rd Commander of the Sri Lanka Army (2019–2022) & Chief of Defence Staff", field: "Military", image: PORTRAIT.man1 },
  { name: "Chanaka Welegedara", note: "Sri Lanka Test cricketer, 2007–2014", field: "Cricket", image: PORTRAIT.man2 },
  { name: "Lakdasa Kodituwakku", note: "Inspector General of Police, 1998–2002", field: "Public Service", image: PORTRAIT.man3 },
  { name: "Lahiru Madushanka", note: "ODI & T20I cricketer, 2017–2021", field: "Cricket", image: PORTRAIT.boy4 },
  { name: "Ranjith Wijekoon", note: "Sri Lanka national & Asia hockey teams", field: "Hockey", image: PORTRAIT.man4 },
  { name: "Kingsley Jayasekera", note: "Actor & singer", field: "Arts", image: PORTRAIT.man5 },
  { name: "Dayan Witharana", note: "Singer & photographer", field: "Music", image: PORTRAIT.man6 },
  { name: "Sanath Wimalasiri", note: "Actor & dramatist", field: "Theatre", image: PORTRAIT.man7 },
  { name: "Hemal Ranasinghe", note: "Actor & model", field: "Cinema", image: PORTRAIT.man8 },
  { name: "Damith Wijayathunga", note: "Actor & model", field: "Cinema", image: PORTRAIT.boy5 },
  { name: "Ruwantha Kellepotha", note: "First-class cricketer", field: "Cricket", image: PORTRAIT.man9 },
  { name: "Don Spater Senanayake", note: "Entrepreneur & philanthropist", field: "Business", image: PORTRAIT.man10 },
];

export default function HistoryPage() {
  return (
    <main className="relative bg-surface text-fg">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
        <Image
          src="/images/hero.jpg"
          alt="St. Thomas' College, Matale campus"
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
              St. Thomas&apos; College · Est. 1873
            </p>
          </div>
          <h1
            className="animate-fade-up mt-7 max-w-4xl font-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "140ms" }}
          >
            Our History<span className="text-gold">.</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/65"
            style={{ animationDelay: "280ms" }}
          >
            From a church verandah in 1873 to the leading boys&apos; school of
            Matale — the milestones that made St. Thomas&apos; College.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="flex justify-center">
            <Eyebrow>The Timeline</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mx-auto mt-7 max-w-2xl text-center font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              Written one{" "}
              <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                generation
              </span>{" "}
              at a time
            </h2>
          </Reveal>

          <div className="relative mt-16 md:mt-20">
            {/* Rail */}
            <span className="timeline-rail absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-fg/15 md:left-1/2" aria-hidden="true" />

            <div className="space-y-14 md:space-y-20">
              {milestones.map((m, i) => {
                const leftSide = i % 2 === 0;
                return (
                  <Reveal key={m.year} delay={80}>
                    <div className="relative grid md:grid-cols-2 md:gap-24">
                      {/* Dot */}
                      <span
                        className="absolute left-0 top-2 grid h-[15px] w-[15px] place-items-center md:left-1/2 md:-translate-x-1/2"
                        aria-hidden="true"
                      >
                        <span
                          className="timeline-dot h-[15px] w-[15px] rounded-full border-2 border-gold bg-surface"
                          style={{ animationDelay: `${i * 260}ms` }}
                        />
                      </span>

                      <div
                        className={`pl-10 md:pl-0 ${
                          leftSide
                            ? "md:col-start-1 md:text-right"
                            : "md:col-start-2"
                        }`}
                      >
                        <p className="font-display text-5xl font-semibold tracking-[-0.03em] text-gold lg:text-6xl">
                          {m.year}
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.01em] md:text-3xl">
                          {m.title}
                        </h3>
                        <p
                          className={`mt-3 text-[15px] leading-relaxed text-fg/60 ${
                            leftSide ? "md:ml-auto" : ""
                          } max-w-xl`}
                        >
                          {m.text}
                        </p>

                        {m.image && (
                          <div
                            className={`mt-6 overflow-hidden rounded-3xl ${
                              leftSide ? "md:ml-auto" : ""
                            } max-w-md`}
                          >
                            <Image
                              src={m.image}
                              alt={m.imageAlt ?? m.title}
                              width={800}
                              height={500}
                              className="aspect-[16/10] w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Old Thomians */}
      <section className="bg-surface-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="flex justify-center">
            <Eyebrow>Illustrious Old Thomians</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mx-auto mt-7 max-w-2xl text-center font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              Sons of the college
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {oldThomians.map((o, i) => (
              <Reveal key={o.name} delay={(i % 4) * 90} className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card text-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative m-2.5 mb-0 aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-ink">
                    <Image
                      src={o.image}
                      alt={o.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1.5 font-sans text-[8.5px] uppercase tracking-[0.22em] text-gold">
                      {o.field}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.01em]">
                      {o.name}
                    </h3>
                    <span className="mb-3 mt-3 block h-px w-7 bg-gold" />
                    <p className="text-[13px] leading-relaxed text-white/60">
                      {o.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <p className="mx-auto mt-12 max-w-2xl text-center text-[14.5px] leading-relaxed text-fg/55">
              The Matale Old Thomians&apos; Association — founded 1953 and
              revived in 1983, with four local and three overseas branches —
              keeps this brotherhood alive through the Sports Festival,
              Colours Nite and the annual Back to School programme.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Legacy numbers + CTA */}
      <section className="bg-surface py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <Eyebrow>The Ledger of Legacy</Eyebrow>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {legacy.map((s, i) => (
              <Reveal key={s.label} delay={i * 100} className="h-full">
                <div className="h-full rounded-3xl bg-card p-7 transition-all duration-500 hover:-translate-y-1">
                  <p className="font-display text-4xl font-semibold tracking-[-0.03em] text-white lg:text-5xl">
                    {s.value}
                  </p>
                  <span className="mb-3 mt-6 block h-px w-7 bg-gold" />
                  <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/50">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <div className="mt-14 flex flex-col items-start justify-between gap-8 rounded-3xl bg-card p-8 text-white md:flex-row md:items-center md:p-12">
              <div className="flex items-start gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-ink">
                  <Landmark size={22} />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.01em]">
                    Be part of the next chapter
                  </h3>
                  <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-white/60">
                    The 2027 Grade 6 intake is now open. Join a family of
                    students, teachers and Old Thomians 153 years strong.
                  </p>
                </div>
              </div>
              <Link
                href="/contact?type=Admissions"
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-white"
              >
                Apply for 2027
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
