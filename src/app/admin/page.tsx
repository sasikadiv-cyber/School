import Link from "next/link";
import { sql } from "drizzle-orm";
import {
  ArrowRight,
  CalendarDays,
  FilePenLine,
  FolderKanban,
  GraduationCap,
  Images,
  Inbox,
  Layers,
  Newspaper,
  UserPlus,
} from "lucide-react";
import { db } from "@/db";
import {
  admissionApplications,
  appointments,
  events,
  galleryItems,
  inquiries,
  posts,
  staff,
} from "@/db/schema";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { cmsDashboardStats } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const { pages, revisions } = await cmsDashboardStats();
  const [
    [admissions],
    [visits],
    [messages],
    [postCount],
    [eventCount],
    [galCount],
    [staffCount],
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(admissionApplications),
    db.select({ count: sql<number>`count(*)::int` }).from(appointments),
    db.select({ count: sql<number>`count(*)::int` }).from(inquiries),
    db.select({ count: sql<number>`count(*)::int` }).from(posts),
    db.select({ count: sql<number>`count(*)::int` }).from(events),
    db.select({ count: sql<number>`count(*)::int` }).from(galleryItems),
    db.select({ count: sql<number>`count(*)::int` }).from(staff),
  ]);

  const stats = [
    { label: "Stories Published", value: postCount.count, icon: Newspaper, href: "/admin/news" },
    { label: "Calendar Events", value: eventCount.count, icon: CalendarDays, href: "/admin/events" },
    { label: "Gallery Frames", value: galCount.count, icon: Images, href: "/admin/gallery" },
    { label: "Staff Members", value: staffCount.count, icon: GraduationCap, href: "/admin/staff" },
  ];

  const subStats = [
    { label: "Admissions (2027)", value: admissions.count, icon: UserPlus },
    { label: "Visit Requests", value: visits.count, icon: CalendarDays },
    { label: "Contact Inquiries", value: messages.count, icon: Inbox },
    { label: "Publish Revisions", value: revisions, icon: FilePenLine },
  ];

  return (
    <AdminShell
      user={admin}
      title="Dashboard"
      subtitle={`Welcome back, ${admin.name}`}
      actions={
        <Link
          href="/"
          target="_blank"
          className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-medium text-white/60 transition-colors hover:border-white/35 hover:text-white"
        >
          View site
        </Link>
      }
    >
      {/* Primary Content Modules Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:-translate-y-0.5 hover:border-[#ffd444]/60 hover:shadow-lift sm:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ffd444] text-[#0b0b0a] sm:h-10 sm:w-10">
                <Icon size={16} />
              </span>
              <ArrowRight
                size={14}
                className="text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-[#ffd444]"
              />
            </div>
            <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] text-[#ffd444] sm:text-4xl">
              {value}
            </p>
            <p className="mt-1 text-[11px] font-semibold sm:text-[13px]">{label}</p>
          </Link>
        ))}
      </div>

      {/* Operations Overview Bar */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-[#0d0d0b] p-3 sm:grid-cols-4 sm:p-4">
        {subStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 px-2 py-1">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-[#ffd444]">
              <Icon size={14} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold leading-tight">{value}</p>
              <p className="truncate text-[10px] text-white/40">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pages & Management Hub */}
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                Visual Editor
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em]">
                Website pages
              </h2>
            </div>
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[10px] font-medium text-white/55 hover:border-white/35 hover:text-white"
            >
              <Layers size={12} /> All pages
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/admin/editor/${page.slug}`}
                className="group flex min-w-0 items-center gap-4 rounded-xl border border-white/10 p-4 transition-all hover:-translate-y-0.5 hover:border-[#ffd444]/60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ffd444] text-[#0b0b0a]">
                  <FilePenLine size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[16px] font-semibold">
                    {page.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-white/35">
                    Updated {page.updatedAt.toLocaleDateString()}
                  </span>
                </span>
                <span
                  className={`hidden rounded-full px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] sm:inline ${
                    page.status === "draft"
                      ? "bg-amber-400/15 text-amber-300"
                      : "bg-emerald-400/15 text-emerald-300"
                  }`}
                >
                  {page.status}
                </span>
                <ArrowRight
                  size={15}
                  className="shrink-0 text-white/25 transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Launch Cards */}
        <div className="space-y-4">
          <Link
            href="/admin/news"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0d0b] p-5 transition-colors hover:border-[#ffd444]/50"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffd444] text-[#0b0b0a]">
                <Newspaper size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">News & Stories</h3>
                <p className="text-[12px] text-white/45">Publish articles, standfirsts & categories</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#ffd444]" />
          </Link>

          <Link
            href="/admin/events"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0d0b] p-5 transition-colors hover:border-[#ffd444]/50"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffd444] text-[#0b0b0a]">
                <CalendarDays size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">Events Calendar</h3>
                <p className="text-[12px] text-white/45">Timetable, venues & fixtures</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#ffd444]" />
          </Link>

          <Link
            href="/admin/gallery"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0d0b] p-5 transition-colors hover:border-[#ffd444]/50"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffd444] text-[#0b0b0a]">
                <Images size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">Campus Gallery</h3>
                <p className="text-[12px] text-white/45">Add frames, reorder & lightbox captions</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#ffd444]" />
          </Link>

          <Link
            href="/admin/unit-gallery"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0d0b] p-5 transition-colors hover:border-[#ffd444]/50"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffd444] text-[#0b0b0a]">
                <Images size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">Unit Galleries</h3>
                <p className="text-[12px] text-white/45">Photo archive per cadet unit page</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#ffd444]" />
          </Link>

          <Link
            href="/admin/staff"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0d0b] p-5 transition-colors hover:border-[#ffd444]/50"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffd444] text-[#0b0b0a]">
                <GraduationCap size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">Faculty & Staff</h3>
                <p className="text-[12px] text-white/45">Teachers, qualifications & departments</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#ffd444]" />
          </Link>

          <Link
            href="/admin/media"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0d0b] p-5 transition-colors hover:border-[#ffd444]/50"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffd444] text-[#0b0b0a]">
                <FolderKanban size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">Media Library</h3>
                <p className="text-[12px] text-white/45">Browse preloaded photos & copy URLs</p>
              </div>
            </div>
            <ArrowRight size={15} className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#ffd444]" />
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
