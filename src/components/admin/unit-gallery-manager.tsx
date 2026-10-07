"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  Loader2,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { MediaLibraryButton } from "@/components/admin/media-picker";

type UnitOption = { slug: string; name: string };

type UnitPhoto = {
  id: number;
  unitSlug: string;
  title: string;
  caption: string;
  image: string;
  aspect: "landscape" | "portrait" | "square";
  sortOrder: number;
};

const ASPECTS = ["landscape", "portrait", "square"] as const;

/** Per-cadet-unit gallery archives — mirrors the archive style of the public unit pages. */
export function UnitGalleryManager() {
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [unit, setUnit] = useState("");
  const [items, setItems] = useState<UnitPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UnitPhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const load = useCallback(async (unitSlug: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/unit-gallery?unit=${encodeURIComponent(unitSlug)}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (res.ok) {
      setItems(json.items ?? []);
      setUnits(json.units ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/admin/unit-gallery?unit=army-cadet", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        setUnits(json.units ?? []);
        setItems(json.items ?? []);
        setUnit(json.units?.[0]?.slug ?? "army-cadet");
      })
      .finally(() => setLoading(false));
  }, []);

  const switchUnit = (slug: string) => {
    setUnit(slug);
    setEditing(null);
    void load(slug);
  };

  const add = async (image: string, title: string) => {
    if (!unit) return;
    setBusy(true);
    const res = await fetch("/api/admin/unit-gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitSlug: unit, image, title }),
    });
    const json = await res.json();
    if (res.ok) {
      setItems((prev) => [...prev, json.item]);
      notify("Photo added to unit gallery");
      setEditing(json.item);
    } else notify(json.error || "Unable to add photo");
    setBusy(false);
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    const res = await fetch("/api/admin/unit-gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const json = await res.json();
    if (res.ok) {
      setItems((prev) => prev.map((item) => (item.id === json.item.id ? json.item : item)));
      setEditing(null);
      notify("Unit photo saved");
    } else notify(json.error || "Unable to save");
    setBusy(false);
  };

  const remove = async (id: number) => {
    if (!window.confirm("Remove this photo from the unit gallery?")) return;
    setBusy(true);
    const res = await fetch("/api/admin/unit-gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setEditing(null);
      notify("Photo removed");
    }
    setBusy(false);
  };

  const chosen = units.find((u) => u.slug === unit);

  return (
    <div>
      {/* Unit switcher */}
      <div className="flex flex-wrap gap-1.5">
        {units.map((option) => (
          <button
            key={option.slug}
            onClick={() => switchUnit(option.slug)}
            className={`rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
              unit === option.slug
                ? "border-transparent bg-[#ffd444] text-[#0b0b0a]"
                : "border-white/12 text-white/45 hover:text-white"
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <p className="text-[12px] text-white/50">
          <span className="font-semibold text-white">{chosen?.name ?? "Unit"}</span>
          {" · "}
          {items.length} photo{items.length === 1 ? "" : "s"} — shown on
          <a
            href={`/cadeting/${unit}`}
            target="_blank"
            rel="noreferrer"
            className="ml-1.5 inline-flex items-center gap-1 text-[#ffd444] hover:underline"
          >
            /cadeting/{unit} <ExternalLink size={10} />
          </a>
        </p>
        <MediaLibraryButton
          preferFolder="cadeting"
          title="Add to Unit Gallery"
          onSelect={(picked) => void add(picked.url, picked.title)}
        />
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[220] -translate-x-1/2 rounded-full bg-[#ffd444] px-5 py-2.5 text-[11px] font-semibold text-[#0b0b0a] shadow-2xl lg:bottom-10">
          {toast}
        </div>
      )}

      {loading ? (
        <div className="grid min-h-64 place-items-center">
          <Loader2 className="animate-spin text-[#ffd444]" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setEditing(photo)}
              className={`group relative overflow-hidden rounded-xl border border-white/10 bg-black text-left hover:border-[#ffd444]/60 ${
                photo.aspect === "portrait" ? "row-span-2" : ""
              }`}
            >
              <div className={`${photo.aspect === "portrait" ? "aspect-[3/4]" : photo.aspect === "square" ? "aspect-square" : "aspect-[4/3]"} w-full overflow-hidden`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image}
                  alt={photo.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8">
                <p className="truncate text-[11px] font-semibold text-white">{photo.title}</p>
              </div>
            </button>
          ))}
          <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-white/15 text-white/30">
            <Plus size={18} />
          </div>
        </div>
      )}

      {/* Edit overlay */}
      {editing && (
        <div className="fixed inset-0 z-[160] flex items-end bg-black/75 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
          <div className="g-panel flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-2xl bg-[#0d0d0b] text-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
            <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={editing.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-4 top-4 flex items-start gap-2">
                <span className="rounded-full bg-black/70 px-3 py-2">
                  <MediaLibraryButton
                    preferFolder="cadeting"
                    onSelect={(picked) => setEditing({ ...editing, image: picked.url })}
                  />
                </span>
                <button
                  onClick={() => setEditing(null)}
                  className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/60"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div>
                <span className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-white/40">Title</span>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 text-[13px] text-white outline-none focus:border-[#ffd444]"
                />
              </div>
              <div>
                <span className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-white/40">Caption</span>
                <textarea
                  rows={2}
                  value={editing.caption}
                  onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                  className="w-full resize-none rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-[13px] text-white outline-none focus:border-[#ffd444]"
                />
              </div>
              <div>
                <span className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-white/40">Shape</span>
                <div className="flex gap-1.5">
                  {ASPECTS.map((aspect) => (
                    <button
                      key={aspect}
                      onClick={() => setEditing({ ...editing, aspect })}
                      className={`rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] ${
                        editing.aspect === aspect
                          ? "border-transparent bg-[#ffd444] text-[#0b0b0a]"
                          : "border-white/12 text-white/45"
                      }`}
                    >
                      {aspect}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">
              <button
                onClick={() => void remove(editing.id)}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/25 px-4 py-2.5 text-[11px] text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={12} /> Remove
              </button>
              <button
                onClick={save}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-[#ffd444] px-6 py-2.5 text-[11px] font-semibold text-[#0b0b0a] disabled:opacity-50"
              >
                {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save photo
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-white/30">
        <ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-400" />
        Unit galleries are structured content — they cannot be corrupted by the
        universal visual editor. Upload new photos through the Library button above.
      </p>
    </div>
  );
}
