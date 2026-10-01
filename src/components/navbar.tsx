"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const links: NavLink[] = [
  { label: "Home", href: "/#home" },
  {
    label: "About Us",
    href: "/#about",
    children: [
      { label: "History", href: "/history" },
      { label: "Vision & Mission", href: "/vision-mission" },
      { label: "Principal's Message", href: "/principals-message" },
      { label: "Colours & Song", href: "/vision-mission#colours" },
      { label: "Staff", href: "/staff" },
    ],
  },
  {
    label: "Academics",
    href: "/#academics",
    children: [
      { label: "Advanced Level", href: "/advanced-level" },
      { label: "Exam Results", href: "/exam-results" },
      { label: "Achievements", href: "/achievements" },
    ],
  },
  {
    label: "Co-Curricular",
    href: "/#cocurricular",
    children: [
      { label: "Clubs & Societies", href: "/clubs-societies" },
      { label: "Sports", href: "/sports" },
      { label: "Cadeting", href: "/cadeting" },
    ],
  },
  {
    label: "News & Events",
    href: "/news",
    children: [
      { label: "Latest News", href: "/news#latest" },
      { label: "Upcoming Events", href: "/news#events" },
      { label: "Gallery Archive", href: "/gallery" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

function ThemeToggle({ scrolled }: { scrolled: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);

    const root = document.documentElement;
    root.classList.add("theming");
    root.classList.toggle("dark", next);

    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }

    window.setTimeout(() => root.classList.remove("theming"), 650);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
        scrolled
          ? "border-fg/15 text-fg hover:bg-fg hover:text-surface"
          : "border-white/30 text-white hover:bg-white hover:text-ink"
      }`}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-fg/10 bg-surface text-fg"
            : "bg-transparent text-white"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          {/* Brand */}
          <Link href="/#home" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-xl font-semibold text-ink transition-transform duration-700 group-hover:rotate-[360deg]">
              S
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[1.35rem] font-semibold tracking-[-0.01em]">
                St. Thomas'
              </span>
              <span
                className={`block font-sans text-[9px] uppercase tracking-[0.35em] ${
                  scrolled ? "text-fg/45" : "text-white/60"
                }`}
              >
                College Matale · Est. 1873
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex">
            {links.map((link) => (
              <li key={link.label} className="group relative flex h-20 items-center px-4 xl:px-4.5">
                <Link
                  href={link.href}
                  className={`nav-link flex items-center gap-1.5 text-[13.5px] font-medium tracking-[-0.01em] transition-colors ${
                    scrolled
                      ? "text-fg/65 hover:text-fg"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      size={12}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {link.children && (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 -translate-y-1 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="min-w-[230px] rounded-2xl border border-fg/10 bg-surface p-2 shadow-lift">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-medium text-fg/60 transition-colors hover:bg-fg/5 hover:text-fg"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA + theme + mobile toggle */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle scrolled={scrolled} />
            <Link
              href="/contact?type=Admissions"
              className="group hidden items-center gap-2 rounded-full bg-gold px-6 py-3 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-fg hover:text-surface lg:inline-flex"
            >
              Apply Now
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden ${
                scrolled
                  ? "border-fg/15 text-fg hover:bg-fg hover:text-surface"
                  : "border-white/30 text-white hover:bg-white hover:text-ink"
              }`}
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-white">
          <div className="relative flex h-20 shrink-0 items-center justify-between px-5 md:px-8">
            <Link
              href="/#home"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-xl font-semibold text-ink">
                S
              </span>
              <span className="font-display text-2xl font-semibold">St. Thomas'</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col justify-center px-6 py-8 md:px-14">
            <ul className="space-y-1">
              {links.map((link, i) => {
                const isExpanded = expanded === link.label;
                return (
                  <li
                    key={link.label}
                    className="animate-fade-up"
                    style={{ animationDelay: `${100 + i * 60}ms` }}
                  >
                    {link.children ? (
                      <div>
                        <div className="flex items-center rounded-2xl px-2 transition-colors hover:bg-white/5">
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block flex-1 py-3 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl"
                          >
                            {link.label}
                          </Link>
                          <button
                            onClick={() => setExpanded(isExpanded ? null : link.label)}
                            aria-label={`Toggle ${link.label} submenu`}
                            aria-expanded={isExpanded}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white/70"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-500 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Smooth expanding submenu */}
                        <div
                          className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isExpanded
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <ul className="ml-5 space-y-0.5 border-l border-white/10 pb-2 pl-5 pt-1">
                              {link.children.map((child, ci) => (
                                <li
                                  key={child.label}
                                  className={`transition-all duration-500 ${
                                    isExpanded
                                      ? "translate-x-0 opacity-100"
                                      : "-translate-x-2 opacity-0"
                                  }`}
                                  style={{ transitionDelay: isExpanded ? `${120 + ci * 60}ms` : "0ms" }}
                                >
                                  <Link
                                    href={child.href}
                                    onClick={() => setOpen(false)}
                                    className="block py-2 text-[15px] font-medium text-white/55 transition-colors hover:text-gold"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-2xl px-2 py-3 font-display text-3xl font-semibold tracking-[-0.02em] transition-colors hover:bg-white/5 md:text-4xl"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Apply Now */}
          <div className="relative shrink-0 px-6 pb-10 md:px-14">
            <Link
              href="/contact?type=Admissions"
              onClick={() => setOpen(false)}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-white"
            >
              Apply Now
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
