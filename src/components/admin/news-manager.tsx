"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  MapPin,
  PenLine,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  image: string;
  location: string;
  author: string;
  readMinutes: number;
  featured: boolean;
  publishedAt: string;
};

const input =
  "w-full rounded-xl border border-white/12 bg-white/[0.05] px-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#ffd444]";

export function NewsManager({ categories: initialCategories }: { categories: string[] }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [newCatModal, setNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const loadData = () => {
    Promise.all([
      fetch("/api/admin/posts", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/collections", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([postData, collData]) => {
        setPosts(postData.posts ?? []);
        if (collData.newsCategories) setCategories(collData.newsCategories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "news", name: newCatName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => Array.from(new Set([...prev, data.name])));
        if (editing) setEditing({ ...editing, category: data.name });
        setNewCatName("");
        setNewCatModal(false);
        setToast(`Collection "${data.name}" added!`);
      } else {
        setToast(data.error || "Failed to add collection");
      }
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const visible = useMemo(
    () => (filter === "All" ? posts : posts.filter((p) => p.category === filter)),
    [posts, filter],
  );

  const create = async () => {
    setBusy(true);
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New story headline",
        excerpt: "Write a short standfirst for this story…",
        body: "Tell the story here…",
        category: "Notice",
        image: "/images/news-science.jpg",
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setPosts((p) => [json.post, ...p]);
      setEditing(json.post);
      setToast("Story created — now edit it");
    } else setToast(json.error);
    setBusy(false);
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    const res = await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const json = await res.json();
    if (res.ok) {
      setPosts((p) => p.map((item) => (item.id === json.post.id ? json.post : item)));
      setToast("Story saved & published");
      setEditing(null);
    } else setToast(json.error);
    setBusy(false);
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this story permanently?")) return;
    setBusy(true);
    const res = await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setPosts((p) => p.filter((item) => item.id !== id));
      setEditing(null);
      setToast("Story deleted");
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="grid min-h-64 place-items-center">
        <Loader2 className="animate-spin text-[#ffd444]" />
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors ${
                filter === cat
                  ? "border-transparent bg-[#ffd444] text-[#0b0b0a]"
                  : "border-white/12 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={create}
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#ffd444] px-5 text-[12px] font-semibold text-[#0b0b0a] disabled:opacity-60"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={15} />}
          New story
        </button>
      </div>

      {/* Story cards — mirrors the public news card design */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((post) => (
          <article
            key={post.id}
            className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-[#ffd444]/50"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                <span className="rounded-full bg-black/70 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#ffd444] backdrop-blur">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffd444] text-[#0b0b0a]">
                    <Star size={12} className="fill-current" />
                  </span>
                )}
              </div>
              <div className="absolute inset-x-4 bottom-3.5">
                <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-white">
                  {post.title}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-[12.5px] leading-relaxed text-white/45">
                {post.excerpt}
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] uppercase tracking-[0.14em] text-white/30">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={11} />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} />
                  {post.readMinutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} />
                  {post.location}
                </span>
              </div>
              <div className="mt-4 flex gap-px border-t border-white/10 pt-3">
                <button
                  onClick={() => setEditing(post)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[11px] font-semibold text-[#ffd444] hover:bg-white/5"
                >
                  <PenLine size={12} /> Edit story
                </button>
                <Link
                  href={`/news/${post.slug}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 rounded-lg border-l border-white/10 px-4 py-2.5 text-[11px] text-white/45 hover:bg-white/5 hover:text-white"
                >
                  <ExternalLink size={12} />
                </Link>
                <button
                  onClick={() => remove(post.id)}
                  className="grid w-11 place-items-center rounded-lg border-l border-white/10 text-white/35 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Delete story"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/15 py-16 text-center">
            <p className="text-sm text-white/40">No stories in this category yet.</p>
          </div>
        )}
      </div>

      {/* Editorial overlay — writing view, not a form */}
      {editing && (
        <div className="fixed inset-0 z-[160] flex items-end bg-black/75 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
          <div className="g-panel flex max-h-[94svh] w-full flex-col overflow-hidden rounded-t-2xl bg-[#0d0d0b] text-white shadow-2xl sm:max-w-3xl sm:rounded-2xl">
            {/* Cover */}
            <div className="relative aspect-[21/9] shrink-0 overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={editing.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0b] via-black/40 to-transparent" />
              <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-black/70 px-3 py-2 backdrop-blur">
                  <ImageIcon size={12} className="shrink-0 text-[#ffd444]" />
                  <input
                    value={editing.image}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    className="min-w-0 flex-1 bg-transparent text-[10px] text-white/80 outline-none placeholder:text-white/30"
                    placeholder="/images/… or https://…"
                  />
                </label>
                <button
                  onClick={() => setEditing(null)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-black/60 backdrop-blur"
                  aria-label="Close editor"
                >
                  <X size={15} />
                </button>
              </div>
              {/* Headline — edited in place over the cover */}
              <textarea
                rows={2}
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="absolute inset-x-4 bottom-4 resize-none bg-transparent font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-white outline-none placeholder:text-white/40 sm:text-3xl"
                placeholder="Story headline"
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEditing({ ...editing, category: cat })}
                    className={`rounded-full border px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] transition-colors ${
                      editing.category === cat
                        ? "border-transparent bg-[#ffd444] text-[#0b0b0a]"
                        : "border-white/12 text-white/45 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setNewCatModal(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#ffd444]/40 bg-[#ffd444]/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#ffd444] hover:bg-[#ffd444]/20"
                >
                  <Plus size={10} /> Add Collection
                </button>
                <button
                  onClick={() => setEditing({ ...editing, featured: !editing.featured })}
                  className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] transition-colors ${
                    editing.featured
                      ? "border-[#ffd444] bg-[#ffd444]/15 text-[#ffd444]"
                      : "border-white/12 text-white/45 hover:text-white"
                  }`}
                >
                  <Star size={11} className={editing.featured ? "fill-current" : ""} />
                  Featured
                </button>
              </div>

              <textarea
                rows={3}
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                className={`${input} mt-5 resize-none border-l-2 border-l-[#ffd444] bg-transparent py-2 font-display text-lg leading-relaxed`}
                placeholder="Standfirst — one or two lines that sell the story…"
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-white/35">Location</span>
                  <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={`${input} h-10 text-[12px]`} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-white/35">Author</span>
                  <input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className={`${input} h-10 text-[12px]`} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-white/35">Read time (min)</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={editing.readMinutes}
                    onChange={(e) => setEditing({ ...editing, readMinutes: Number(e.target.value) })}
                    className={`${input} h-10 text-[12px]`}
                  />
                </label>
              </div>

              <div className="mt-6">
                <span className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/35">Story body</span>
                <textarea
                  rows={12}
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  className={`${input} resize-y py-4 text-[14px] leading-[1.85]`}
                  placeholder="Write the story. Separate paragraphs with a blank line."
                />
                <p className="mt-2 text-[10px] text-white/25">
                  {editing.body.split(/\s+/).filter(Boolean).length} words · blank lines separate paragraphs
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#0d0d0b] px-5 py-4">
              <button
                onClick={() => remove(editing.id)}
                className="inline-flex items-center gap-2 text-[11px] text-red-400 hover:bg-red-500/10 rounded-full px-3 py-2"
              >
                <Trash2 size={13} /> Delete
              </button>
              <div className="flex gap-2">
                <button onClick={() => setEditing(null)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold text-white/60 hover:text-white">
                  <ArrowLeft size={13} /> Cancel
                </button>
                <button onClick={save} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-[#ffd444] px-6 py-3 text-[11px] font-semibold text-[#0b0b0a] disabled:opacity-60">
                  {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save & publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Collection Modal */}
      {newCatModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#121210] p-6 text-white shadow-2xl">
            <h3 className="font-display text-lg font-semibold">New Story Collection</h3>
            <p className="mt-1 text-[12px] text-white/50">
              Create a custom category for stories and articles.
            </p>
            <input
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Science Fair, Old Boys News…"
              className="mt-4 h-11 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 text-[13px] text-white outline-none focus:border-[#ffd444]"
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
                if (e.key === "Escape") setNewCatModal(false);
              }}
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setNewCatModal(false)}
                className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-medium text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                disabled={!newCatName.trim() || busy}
                className="rounded-full bg-[#ffd444] px-5 py-2 text-[11px] font-semibold text-[#0b0b0a] disabled:opacity-50"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="g-fade fixed bottom-24 left-1/2 z-[250] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#ffd444] px-5 py-3 text-[12px] font-semibold text-[#0b0b0a] shadow-2xl lg:bottom-7">
          <Check size={14} /> {toast}
        </div>
      )}
    </>
  );
}
