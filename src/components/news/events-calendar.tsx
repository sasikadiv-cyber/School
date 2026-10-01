"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

export type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  category: string;
  startsAt: string;
  timeLabel: string;
  location: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CATEGORY_TONE: Record<string, string> = {
  Sports: "bg-emerald-500",
  Culture: "bg-gold",
  Ceremony: "bg-red-500",
  Admissions: "bg-sky-500",
  Academic: "bg-violet-500",
};

function ymd(iso: string) {
  const d = new Date(iso);
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth(),
    d: d.getUTCDate(),
  };
}

export function EventsCalendar({ events }: { events: CalendarEvent[] }) {
  const firstEvent = events[0] ? ymd(events[0].startsAt) : null;
  const [year, setYear] = useState(firstEvent?.y ?? new Date().getUTCFullYear());
  const [month, setMonth] = useState(firstEvent?.m ?? new Date().getUTCMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const years = useMemo(() => {
    const set = new Set(events.map((e) => ymd(e.startsAt).y));
    set.add(year);
    return [...set].sort();
  }, [events, year]);

  /** events grouped by day-of-month for the visible month */
  const byDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((e) => {
      const { y, m, d } = ymd(e.startsAt);
      if (y === year && m === month) {
        map.set(d, [...(map.get(d) ?? []), e]);
      }
    });
    return map;
  }, [events, year, month]);

  /** Monday-first grid */
  const cells = useMemo(() => {
    const firstDow = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const out: (number | null)[] = Array(firstDow).fill(null);
    for (let d = 1; d <= days; d++) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [year, month]);

  const step = (delta: number) => {
    const next = month + delta;
    if (next < 0) {
      setMonth(11);
      setYear(year - 1);
    } else if (next > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(next);
    }
    setSelected(null);
  };

  const monthEvents = [...byDay.entries()].sort((a, b) => a[0] - b[0]);
  const selectedEvents = selected
    ? events.filter((e) => {
        const { y, m, d } = ymd(e.startsAt);
        return `${y}-${m}-${d}` === selected;
      })
    : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-fg/10">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-fg/10 bg-surface-2 px-5 py-5 md:px-7">
        <div className="flex items-center gap-3">
          <button
            onClick={() => step(-1)}
            aria-label="Previous month"
            className="grid h-10 w-10 place-items-center rounded-full border border-fg/15 transition-colors hover:bg-fg hover:text-surface"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            onClick={() => step(1)}
            aria-label="Next month"
            className="grid h-10 w-10 place-items-center rounded-full border border-fg/15 transition-colors hover:bg-fg hover:text-surface"
          >
            <ChevronRight size={17} />
          </button>
          <p className="ml-1 font-display text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
            {MONTHS[month]} {year}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              setSelected(null);
            }}
            aria-label="Select month"
            className="rounded-full border border-fg/15 bg-surface px-4 py-2.5 text-[13px] font-medium text-fg focus:border-gold focus:outline-none"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setSelected(null);
            }}
            aria-label="Select year"
            className="rounded-full border border-fg/15 bg-surface px-4 py-2.5 text-[13px] font-medium text-fg focus:border-gold focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.45fr_1fr]">
        {/* Month grid */}
        <div className="border-b border-fg/10 p-4 md:p-6 lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-7 gap-1.5">
            {DOW.map((d) => (
              <div
                key={d}
                className="pb-2 text-center font-sans text-[9.5px] uppercase tracking-[0.2em] text-fg/40"
              >
                {d}
              </div>
            ))}

            {cells.map((day, i) => {
              if (day === null)
                return <div key={`x${i}`} className="aspect-square" />;

              const dayEvents = byDay.get(day) ?? [];
              const has = dayEvents.length > 0;
              const key = `${year}-${month}-${day}`;
              const isSelected = selected === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelected(has ? (isSelected ? null : key) : null)}
                  disabled={!has}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition-all duration-200 md:rounded-2xl ${
                    isSelected
                      ? "border-transparent bg-fg text-surface"
                      : has
                        ? "border-gold/50 bg-gold/10 font-semibold text-fg hover:border-gold hover:bg-gold/20"
                        : "border-transparent text-fg/35"
                  }`}
                >
                  {day}
                  {has && (
                    <span className="absolute bottom-1.5 flex gap-0.5 md:bottom-2">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            CATEGORY_TONE[e.category] ?? "bg-gold"
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-fg/10 pt-5">
            {Object.entries(CATEGORY_TONE).map(([cat, tone]) => (
              <span
                key={cat}
                className="flex items-center gap-2 font-sans text-[9.5px] uppercase tracking-[0.2em] text-fg/50"
              >
                <span className={`h-2 w-2 rounded-full ${tone}`} />
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Side list */}
        <div className="max-h-[560px] overflow-y-auto p-4 md:p-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-fg/45">
            {selectedEvents
              ? "Selected day"
              : `${MONTHS[month]} schedule`}
          </p>

          <div className="mt-5 space-y-3">
            {(selectedEvents
              ? selectedEvents
              : monthEvents.flatMap(([, evs]) => evs)
            ).map((e) => {
              const { d } = ymd(e.startsAt);
              return (
                <div
                  key={e.id}
                  className="rounded-2xl bg-card p-5 text-white transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold font-display text-lg font-semibold text-ink">
                      {d}
                    </span>
                    <div className="min-w-0">
                      <h4 className="truncate font-display text-base font-semibold tracking-[-0.01em]">
                        {e.title}
                      </h4>
                      <span
                        className={`mt-1 inline-flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-[0.2em] text-white/50`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            CATEGORY_TONE[e.category] ?? "bg-gold"
                          }`}
                        />
                        {e.category}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3.5 text-[13px] leading-relaxed text-white/60">
                    {e.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-3.5 font-sans text-[9.5px] uppercase tracking-[0.18em] text-white/50">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gold" />
                      {e.timeLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-gold" />
                      {e.location}
                    </span>
                  </div>
                </div>
              );
            })}

            {monthEvents.length === 0 && !selectedEvents && (
              <div className="rounded-2xl border border-dashed border-fg/20 px-5 py-12 text-center">
                <p className="text-[14px] text-fg/50">
                  No college events scheduled in {MONTHS[month]}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
