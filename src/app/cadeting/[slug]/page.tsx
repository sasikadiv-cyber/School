import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Medal, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/eyebrow";
import { Crest } from "@/components/crest";
import { UNITS, getUnit } from "@/lib/units";

export function generateStaticParams() {
  return UNITS.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = getUnit(slug);
  if (!unit) return { title: "Unit not found — St. Thomas' College" };
  return {
    title: `${unit.name} — St. Thomas' College, Matale`,
    description: unit.text,
  };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = getUnit(slug);
  if (!unit) notFound();

  const others = UNITS.filter((u) => u.slug !== unit.slug);

  return (
    <main className="relative bg-surface text-fg">
      <Navbar />

      {/* 1 — Banner */}
      <section className="relative flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
        <Image
          src={unit.image}
          alt={unit.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/72" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-20">
          <Link
            href="/cadeting"
            className="animate-fade-up group inline-flex items-center gap-2.5 font-sans text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-gold"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            All Cadeting Units
          </Link>
          <p
            className="animate-fade-up mt-7 font-sans text-[11px] uppercase tracking-[0.4em] text-white/70"
            style={{ animationDelay: "120ms" }}
          >
            {unit.tagline}
          </p>
          <h1
            className="animate-fade-up mt-4 max-w-4xl font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "200ms" }}
          >
            {unit.name}
            <span className="text-gold">.</span>
          </h1>
        </div>
      </section>

      {/* 2 — Logo + 3 short description */}
      <section className="bg-surface py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="flex flex-col items-start gap-6 rounded-3xl bg-card p-9 text-white">
                  <Crest initials={unit.crest} label={unit.name} size="lg" />
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.01em]">
                      {unit.name}
                    </h2>
                    <p className="mt-1.5 font-sans text-[9.5px] uppercase tracking-[0.26em] text-gold">
                      {unit.founded}
                    </p>
                  </div>
                  <span className="block h-px w-8 bg-gold" />
                  <div className="grid w-full gap-3">
                    <div className="flex items-center gap-3 text-[13.5px] text-white/65">
                      <Users size={15} className="text-gold" />
                      {unit.strength}
                    </div>
                    <div className="flex items-center gap-3 text-[13.5px] text-white/65">
                      <Medal size={15} className="text-gold" />
                      {unit.achievements.length} recent honours
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unit.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full border border-white/15 px-3.5 py-1.5 text-[12px] text-white/70"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal delay={100}>
                <Eyebrow>About the Unit</Eyebrow>
              </Reveal>
              <Reveal delay={160}>
                <h2 className="mt-7 font-display text-3xl font-semibold leading-[1.15] tracking-[-0.02em] md:text-[2.6rem]">
                  {unit.text}
                </h2>
              </Reveal>
              <div className="mt-8 space-y-5">
                {unit.description.map((p, i) => (
                  <Reveal key={i} delay={200 + i * 70}>
                    <p className="text-[15.5px] leading-[1.85] text-fg/70">
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Latest achievements */}
      <section className="bg-surface-2 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <Eyebrow>Latest Achievements</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-7 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              Honours on the{" "}
              <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                board
              </span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {unit.achievements.map((a, i) => (
              <Reveal key={a.title} delay={i * 90} className="h-full">
                <div className="flex h-full flex-col rounded-3xl bg-card p-7 text-white transition-all duration-500 hover:-translate-y-1.5">
                  <span className="rounded-full bg-gold px-4 py-1.5 font-display text-sm font-semibold text-ink self-start">
                    {a.year}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold leading-tight tracking-[-0.01em]">
                    {a.title}
                  </h3>
                  <span className="mb-3 mt-4 block h-px w-7 bg-gold" />
                  <p className="text-[13px] leading-relaxed text-white/60">
                    {a.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Gallery */}
      <section className="bg-surface py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Reveal>
                <Eyebrow>Unit Gallery</Eyebrow>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="mt-7 font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
                  In the field
                </h2>
              </Reveal>
            </div>
            <Reveal delay={180}>
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2.5 rounded-full border border-fg/15 px-6 py-3 text-[13px] font-medium text-fg transition-colors hover:border-fg hover:bg-fg hover:text-surface"
              >
                Full Campus Gallery
                <ArrowRight size={14} className="slide-arrow" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {unit.gallery.map((g, i) => (
              <Reveal key={i} delay={(i % 4) * 90} className="h-full">
                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-card">
                  <Image
                    src={g.image}
                    alt={g.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/60" />
                  <p className="absolute inset-x-5 bottom-5 text-[13px] leading-snug text-white">
                    {g.caption}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Other units */}
      <section className="bg-surface-2 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <Eyebrow>Other Units</Eyebrow>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 80} className="h-full">
                <Link
                  href={`/cadeting/${o.slug}`}
                  className="group flex h-full items-center gap-4 rounded-3xl border border-fg/10 bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold"
                >
                  <Crest initials={o.crest} label={o.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold tracking-[-0.01em]">
                      {o.name}
                    </p>
                    <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.2em] text-fg/45">
                      {o.strength}
                    </p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="slide-arrow ml-auto shrink-0 text-fg/40"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
