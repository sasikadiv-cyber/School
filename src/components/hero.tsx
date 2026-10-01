import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-ink text-white">
      {/* Cinematic video backdrop — solid overlay, no gradients */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/37780595/16025454_3840_2160_50fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-ink/60" />
        <div className="grain absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-28 pt-32 md:px-8 md:pb-32">
        <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="mb-9 flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-white/70">
              St. Thomas&apos; College · Matale · Since 1873
            </p>
          </div>
        </div>

        <h1 className="max-w-5xl font-display text-[clamp(2.9rem,7.2vw,6.5rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
          <span className="animate-fade-up block" style={{ animationDelay: "280ms" }}>
            Animo et
          </span>
          <span className="animate-fade-up block" style={{ animationDelay: "420ms" }}>
            Fide<span className="text-gold">.</span>
          </span>
        </h1>

        <p
          className="animate-fade-up mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
          style={{ animationDelay: "560ms" }}
        >
          Courage and Faith — the motto that has guided Thomians in the heart
          of Matale since 1873. A boys&apos; school of two thousand students,
          from Grade 6 to the Advanced Level.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "700ms" }}
        >
          <a
            href="/#academics"
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-white"
          >
            Explore Academics
            <ArrowRight size={15} className="slide-arrow" />
          </a>
          <a
            href="/history"
            className="group inline-flex items-center gap-3.5 rounded-full border border-white/25 px-8 py-4 text-sm font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-current">
              <Play size={9} className="ml-0.5 fill-current" />
            </span>
            Our Story Since 1873
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-10 left-5 hidden items-center gap-4 md:left-8 lg:flex">
        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/45 [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="scroll-line block h-14 w-px bg-gold" />
        </div>
      </div>
    </section>
  );
}
