"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  MapPin,
  X,
} from "lucide-react";
import type { GalleryItem } from "@/db/schema";
import { Reveal } from "@/components/reveal";

const CATEGORIES = [
  "All",
  "Campus",
  "Academics",
  "Sports",
  "Arts & Culture",
] as const;

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const selectedItem =
    selectedIndex !== null ? filtered[selectedIndex] ?? null : null;

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filtered.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <>
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(null);
              }}
              className={`rounded-full border px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                isActive
                  ? "border-transparent bg-fg text-surface"
                  : "border-fg/15 text-fg/60 hover:border-fg hover:text-fg"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <Reveal key={item.id} delay={(i % 3) * 100} className="h-full">
            <div
              onClick={() => setSelectedIndex(i)}
              className="group relative block aspect-[16/11] cursor-pointer overflow-hidden rounded-3xl bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-ink/50 transition-opacity duration-300 group-hover:bg-ink/65" />

              {/* Category pill */}
              <div className="absolute left-5 top-5 flex items-center gap-2">
                <span className="rounded-full bg-ink/80 px-3.5 py-1.5 font-sans text-[8.5px] uppercase tracking-[0.25em] text-gold backdrop-blur-sm">
                  {item.category}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1.5 font-sans text-[8.5px] uppercase tracking-[0.2em] text-white">
                  {item.year}
                </span>
              </div>

              {/* Expand icon */}
              <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-gold text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Expand size={15} />
              </div>

              {/* Caption overlay */}
              <div className="absolute inset-x-5 bottom-5 text-white">
                <p className="flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-[0.25em] text-mist">
                  <MapPin size={11} className="text-gold" />
                  {item.location}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight tracking-[-0.01em]">
                  {item.title}
                </h3>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/96 p-3 md:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-3xl bg-card text-white shadow-2xl"
          >
            {/* Top bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gold px-3 py-1 font-sans text-[9px] uppercase tracking-[0.25em] text-ink">
                  {selectedItem.category}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {selectedItem.year} · {selectedItem.location}
                </span>
              </div>
              <button
                onClick={() => setSelectedIndex(null)}
                aria-label="Close image"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main image */}
            <div className="relative min-h-[200px] w-full flex-1 bg-ink">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Bottom info */}
            <div className="flex shrink-0 flex-col gap-4 border-t border-white/10 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.01em]">
                  {selectedItem.title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/65">
                  {selectedItem.caption}
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span className="font-sans text-xs text-white/40">
                  {selectedIndex !== null ? selectedIndex + 1 : 1} /{" "}
                  {filtered.length}
                </span>
                <button
                  onClick={handleNext}
                  aria-label="Next image"
                  className="flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
