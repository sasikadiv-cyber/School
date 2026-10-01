import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Trophy,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/eyebrow";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact & Admissions — St. Thomas' College",
  description:
    "Get in touch with the admissions office, administration, or campus registry of St. Thomas' College, Matale.",
};

const DEPARTMENTS = [
  {
    icon: GraduationCap,
    name: "Admissions & Registry",
    phone: "+94 66 222 0175",
    email: "admissions@stcmatale.lk",
    hours: "Mon – Fri: 8.00 a.m. – 3.00 p.m.",
  },
  {
    icon: Building2,
    name: "Principal's Secretariat",
    phone: "+94 66 222 0176",
    email: "principal@stcmatale.lk",
    hours: "By prior appointment only",
  },
  {
    icon: Trophy,
    name: "Sports & Pavilion Complex",
    phone: "+94 66 222 0177",
    email: "sports@stcmatale.lk",
    hours: "Mon – Sat: 6.30 a.m. – 6.00 p.m.",
  },
  {
    icon: Users,
    name: "Old Thomians' Association",
    phone: "+94 66 222 0173",
    email: "oba@stcmatale.lk",
    hours: "Wed & Sat: 9.00 a.m. – 1.00 p.m.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type = "" } = await searchParams;

  return (
    <main className="relative bg-surface text-fg">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
        <Image
          src="/images/hero.jpg"
          alt="St. Thomas' College main gates"
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
              Matale · Central Province
            </p>
          </div>
          <h1
            className="animate-fade-up mt-7 max-w-4xl font-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "140ms" }}
          >
            Contact &amp; Admissions<span className="text-gold">.</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/65"
            style={{ animationDelay: "280ms" }}
          >
            We welcome inquiries from prospective families, alumni, and the
            wider academic community.
          </p>
        </div>
      </section>

      {/* Main Info + Form Section */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow>Direct Inquiries</Eyebrow>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="mt-7 font-display text-4xl font-semibold leading-[1.12] tracking-[-0.02em] md:text-5xl">
                  Connect with the{" "}
                  <span className="underline decoration-gold decoration-[3px] underline-offset-8">
                    college
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-[15.5px] leading-relaxed text-fg/60">
                  Whether you are planning a campus visit, applying for the 2027
                  academic intake, or connecting with our academic faculties, our
                  administrative staff are available during regular school hours.
                </p>
              </Reveal>

              {/* Quick Contact Cards */}
              <div className="mt-10 space-y-4">
                <Reveal delay={240}>
                  <div className="flex items-start gap-4 rounded-3xl border border-fg/10 bg-surface-2 p-6 transition-colors hover:border-fg/20">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-ink">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-fg/50">
                        Campus Address
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold leading-snug">
                        St. Thomas' College, Matale, Sri Lanka
                      </p>
                      <p className="mt-1 font-sans text-xs text-fg/50">
                        Main Gate Access via Albert Crescent
                      </p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={280}>
                  <div className="flex items-start gap-4 rounded-3xl border border-fg/10 bg-surface-2 p-6 transition-colors hover:border-fg/20">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-ink">
                      <Phone size={18} />
                    </span>
                    <div>
                      <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-fg/50">
                        Telephone Lines
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold leading-snug">
                        +94 66 222 0173 / +94 66 222 0174
                      </p>
                      <p className="mt-1 font-sans text-xs text-fg/50">
                        Admissions Hotline: +94 77 123 4567
                      </p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={320}>
                  <div className="flex items-start gap-4 rounded-3xl border border-fg/10 bg-surface-2 p-6 transition-colors hover:border-fg/20">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-ink">
                      <Clock size={18} />
                    </span>
                    <div>
                      <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-fg/50">
                        Administration Hours
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold leading-snug">
                        Monday – Friday: 7.30 a.m. – 3.30 p.m.
                      </p>
                      <p className="mt-1 font-sans text-xs text-fg/50">
                        Saturday (Registry only): 8.30 a.m. – 12.00 p.m.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <Reveal delay={160}>
                <ContactForm initialType={type} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Department Directory */}
      <section className="bg-surface-2 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div>
            <Reveal>
              <Eyebrow>Campus Directory</Eyebrow>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-7 font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
                Department contacts
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <Reveal key={dept.name} delay={i * 90} className="h-full">
                  <div className="flex h-full flex-col justify-between rounded-3xl border border-fg/10 bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-soft">
                    <div>
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-fg text-surface">
                        <Icon size={18} />
                      </span>
                      <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.01em]">
                        {dept.name}
                      </h3>
                      <div className="mt-4 space-y-2 text-sm text-fg/60">
                        <p className="flex items-center gap-2">
                          <Phone size={13} className="text-gold" />
                          {dept.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail size={13} className="text-gold" />
                          {dept.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-fg/10 pt-4">
                      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-fg/40">
                        {dept.hours}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visitor Protocol Note */}
      <section className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-fg/10 bg-card p-8 text-white md:flex-row md:items-center md:p-10">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                  <ShieldAlert size={20} />
                </span>
                <div>
                  <h4 className="font-display text-xl font-semibold">
                    Campus Visitor Protocols
                  </h4>
                  <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-white/60">
                    All visitors must produce valid identification (National
                    Identity Card or Passport) at the security gate to receive a
                    temporary visitor badge. School hours operate under strict
                    child protection guidelines.
                  </p>
                </div>
              </div>
              <Link
                href="/#home"
                className="shrink-0 rounded-full border border-white/20 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:border-gold hover:text-gold"
              >
                Back to Home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
