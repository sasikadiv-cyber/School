"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_VERSION_LABEL } from "@/lib/app-version";
import {
  CalendarDays,
  ChevronDown,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  Images,
  LayoutDashboard,
  Layers,
  LogOut,
  Newspaper,
  Settings,
} from "lucide-react";

const PAGES = [
  { label: "Home Page", path: "/" },
  { label: "History Page", path: "/history" },
  { label: "Admissions", path: "/admissions" },
  { label: "Advanced Level", path: "/advanced-level" },
];

export function AdminShell({
  children,
  user,
  title,
  subtitle,
  actions,
  flush = false,
}: {
  children: ReactNode;
  user: { name: string; role: string };
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Remove page padding — used by the full-bleed visual editor. */
  flush?: boolean;
}) {
  const pathname = usePathname();
  const inPages = pathname.startsWith("/admin/pages") || pathname.startsWith("/admin/editor");
  const [openPages, setOpenPages] = useState(inPages);

  const linkCls = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition-colors ${
      active
        ? "bg-[#ffd444] text-[#0b0b0a]"
        : "text-white/55 hover:bg-white/[0.06] hover:text-white"
    }`;

  return (
    <div className="min-h-svh bg-[#0a0a09] text-white">
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0d0d0b] p-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-1 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffd444] font-display text-lg font-semibold text-[#0b0b0a]">
            S
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold">Admin Studio</span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              St. Thomas&apos; College
            </span>
          </span>
        </Link>

        <nav className="mt-10 space-y-1.5">
          <Link href="/admin" className={linkCls(pathname === "/admin")}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          {/* Pages group */}
          <div>
            <button
              onClick={() => setOpenPages((v) => !v)}
              className={`${linkCls(inPages && !openPages)} w-full justify-between`}
            >
              <span className="flex items-center gap-3">
                <Layers size={16} /> Pages
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-300 ${openPages ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-all duration-400 ease-out ${
                openPages ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">
                  <Link
                    href="/admin/pages"
                    className={`block rounded-lg px-3 py-2 text-[12px] transition-colors ${
                      pathname === "/admin/pages"
                        ? "bg-white/10 text-[#ffd444]"
                        : "text-white/45 hover:text-white"
                    }`}
                  >
                    All pages
                  </Link>
                  {PAGES.map((page) => (
                    <Link
                      key={page.path}
                      href={`${page.path}${page.path.includes("?") ? "&" : "?"}visualEditor=1`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-white/45 transition-colors hover:bg-white/5 hover:text-[#ffd444]"
                    >
                      <FileText size={12} /> {page.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link href="/admin/news" className={linkCls(pathname.startsWith("/admin/news"))}>
            <Newspaper size={16} /> News &amp; Stories
          </Link>
          <Link href="/admin/events" className={linkCls(pathname.startsWith("/admin/events"))}>
            <CalendarDays size={16} /> Events &amp; Schedule
          </Link>
          <Link href="/admin/gallery" className={linkCls(pathname.startsWith("/admin/gallery") && !pathname.startsWith("/admin/unit-gallery"))}>
            <Images size={16} /> Campus Gallery
          </Link>
          <Link href="/admin/unit-gallery" className={linkCls(pathname.startsWith("/admin/unit-gallery"))}>
            <Images size={16} /> Unit Galleries
          </Link>
          <Link href="/admin/staff" className={linkCls(pathname.startsWith("/admin/staff"))}>
            <GraduationCap size={16} /> Faculty &amp; Staff
          </Link>
          <Link href="/admin/media" className={linkCls(pathname.startsWith("/admin/media"))}>
            <FolderKanban size={16} /> Media Library
          </Link>
          <Link href="/admin/settings" className={linkCls(pathname.startsWith("/admin/settings"))}>
            <Settings size={16} /> Settings
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-[13px] font-medium">{user.name}</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/30">
            {user.role.replaceAll("_", " ")} · {APP_VERSION_LABEL}
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="grid h-10 flex-1 place-items-center rounded-xl border border-white/12 text-white/50 transition-colors hover:border-white/30 hover:text-white"
              aria-label="View site"
            >
              <ExternalLink size={15} />
            </Link>
            <form action="/api/admin/auth/logout" method="post" className="flex-1">
              <button
                className="grid h-10 w-full place-items-center rounded-xl border border-white/12 text-white/50 transition-colors hover:border-white/30 hover:text-white"
                aria-label="Sign out"
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a09]/95 backdrop-blur-lg">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-0.5 truncate text-[11px] text-white/40 sm:text-[12px]">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          </div>
        </header>
        <main className={flush ? "" : "px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10"}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-2 bottom-2 z-50 flex items-center justify-around gap-0.5 overflow-x-auto rounded-2xl border border-white/10 bg-[#121210]/95 p-1 shadow-2xl backdrop-blur-lg lg:hidden"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {[
          { label: "Home", href: "/admin", icon: LayoutDashboard, active: pathname === "/admin" },
          { label: "Pages", href: "/admin/pages", icon: Layers, active: inPages },
          { label: "News", href: "/admin/news", icon: Newspaper, active: pathname.startsWith("/admin/news") },
          { label: "Events", href: "/admin/events", icon: CalendarDays, active: pathname.startsWith("/admin/events") },
          { label: "Gallery", href: "/admin/gallery", icon: Images, active: pathname.startsWith("/admin/gallery") && !pathname.startsWith("/admin/unit-gallery") },
          { label: "Units", href: "/admin/unit-gallery", icon: Images, active: pathname.startsWith("/admin/unit-gallery") },
          { label: "Staff", href: "/admin/staff", icon: GraduationCap, active: pathname.startsWith("/admin/staff") },
          { label: "Media", href: "/admin/media", icon: FolderKanban, active: pathname.startsWith("/admin/media") },
          { label: "Settings", href: "/admin/settings", icon: Settings, active: pathname.startsWith("/admin/settings") },
        ].map(({ label, href, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[8px] font-medium ${
              active ? "bg-[#ffd444] text-[#0b0b0a]" : "text-white/50"
            }`}
          >
            <Icon size={16} />
            <span className="truncate">{label}</span>
          </Link>
        ))}
        <form action="/api/admin/auth/logout" method="post">
          <button className="flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-[8px] font-medium text-white/50">
            <LogOut size={16} />
            Logout
          </button>
        </form>
      </nav>
    </div>
  );
}
