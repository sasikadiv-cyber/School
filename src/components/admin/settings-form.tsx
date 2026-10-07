"use client";

import { useState } from "react";
import { Check, Loader2, Save, Send } from "lucide-react";
import { MediaLibraryButton } from "@/components/admin/media-picker";

const fields = [
  ["brandName", "Brand name", "St. Thomas' College"],
  ["brandSubline", "Brand subline", "Matale · Est. 1873"],
  ["footerDescription", "Footer description", "Short college description"],
  ["phone", "Main phone", "+94 …"],
  ["email", "Public email", "office@example.com"],
  ["address", "Address", "College address"],
  ["officeHours", "Office hours", "Mon – Fri …"],
  ["admissionsYear", "Admissions year", "2027"],
] as const;

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState<"save" | "publish" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (publish: boolean) => {
    setBusy(publish ? "publish" : "save");
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, publish }),
    });
    const json = await res.json();
    setMessage(res.ok ? (publish ? "Settings published to the site." : "Settings draft saved.") : json.error);
    setBusy(null);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.65fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">Identity & contact</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em]">Navigation & footer</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/45">These values are shared across the public navbar and footer. Content is kept short so mobile layouts remain safe.</p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {fields.map(([key, label, placeholder]) => (
            <label key={key} className={key === "footerDescription" || key === "address" ? "sm:col-span-2" : ""}>
              <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</span>
              {key === "footerDescription" || key === "address" ? (
                <textarea rows={3} value={data[key] ?? ""} onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))} placeholder={placeholder} className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-[13px] leading-relaxed text-white outline-none focus:border-[#ffd444]" />
              ) : (
                <input value={data[key] ?? ""} onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))} placeholder={placeholder} className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 text-[13px] text-white outline-none focus:border-[#ffd444]" />
              )}
            </label>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">School logo</p>
              <p className="mt-1 text-[11px] text-white/30">Used in the navbar, footer and Admin Studio identity.</p>
            </div>
            <MediaLibraryButton
              preferFolder="site-assets"
              onSelect={(picked) => setData((d) => ({ ...d, schoolLogo: picked.url }))}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            {data.schoolLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.schoolLogo} alt="School logo preview" className="h-16 w-16 rounded-full border border-white/15 object-contain p-1" />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-full bg-[#ffd444] font-display text-xl font-semibold text-[#0b0b0a]">S</span>
            )}
            <input
              value={data.schoolLogo ?? ""}
              onChange={(e) => setData((d) => ({ ...d, schoolLogo: e.target.value }))}
              placeholder="Paste logo URL or choose from Library"
              className="h-11 min-w-0 flex-1 rounded-xl border border-white/12 bg-white/[0.05] px-4 text-[12px] text-white outline-none focus:border-[#ffd444]"
            />
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-7">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">Cadeting preloader</p>
          <p className="mt-1 text-[11px] text-white/30">Managed here instead of the visual editor, so its animation cannot be corrupted.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex h-11 items-center justify-between rounded-xl border border-white/12 bg-white/[0.05] px-4 text-[12px] text-white/70">
              Enable cinematic intro
              <input
                type="checkbox"
                checked={data.cadetIntroEnabled !== "false"}
                onChange={(e) => setData((d) => ({ ...d, cadetIntroEnabled: e.target.checked ? "true" : "false" }))}
                className="h-4 w-4 accent-[#ffd444]"
              />
            </label>
            <label>
              <span className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/35">Direct-visit hold (ms)</span>
              <input
                type="number"
                min="0"
                max="8000"
                step="100"
                value={data.cadetIntroHold ?? "2400"}
                onChange={(e) => setData((d) => ({ ...d, cadetIntroHold: e.target.value }))}
                className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 text-[12px] text-white outline-none focus:border-[#ffd444]"
              />
            </label>
          </div>
        </div>
        {message && <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-400/10 px-4 py-3 text-[12px] text-emerald-300"><Check size={14} />{message}</div>}
        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <button onClick={() => submit(false)} disabled={busy !== null} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-[12px] font-semibold text-white/70 hover:border-white/35 hover:text-white disabled:opacity-50">{busy === "save" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}Save draft</button>
          <button onClick={() => submit(true)} disabled={busy !== null} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#ffd444] px-6 text-[12px] font-semibold text-[#0b0b0a] disabled:opacity-50">{busy === "publish" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}Publish settings</button>
        </div>
      </section>

      <aside className="rounded-2xl border border-white/10 bg-[#0d0d0b] p-6 sm:p-7">
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#ffd444]">Live preview</p>
        <div className="mt-6 rounded-xl border border-white/12 p-5">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffd444] font-display text-lg font-semibold text-[#0b0b0a]">S</span><span className="min-w-0 leading-tight"><span className="block truncate font-display text-lg font-semibold">{data.brandName}</span><span className="block truncate text-[8px] uppercase tracking-[0.28em] text-white/40">{data.brandSubline}</span></span></div>
          <p className="mt-6 text-[12.5px] leading-relaxed text-white/50">{data.footerDescription}</p>
          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-[11px] text-white/45"><p>{data.address}</p><p>{data.phone}</p><p>{data.email}</p><p>{data.officeHours}</p></div>
        </div>
      </aside>
    </div>
  );
}
