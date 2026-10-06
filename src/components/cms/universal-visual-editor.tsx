"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  History,
  Image as ImageIcon,
  Link2,
  Loader2,
  MousePointerClick,
  Pencil,
  RefreshCw,
  Save,
  Send,
  Smartphone,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { VISUAL_EDITOR_PAGES } from "@/lib/visual-pages";

type PatchData = {
  text?: string;
  href?: string;
  src?: string;
  alt?: string;
  hidden?: boolean;
  textMode?: "direct" | "full";
};

type Patch = {
  id?: number;
  selector: string;
  label?: string;
  elementType?: string;
  draftData?: PatchData;
  publishedData?: PatchData;
  data?: PatchData;
};

type SelectedElement = {
  selector: string;
  label: string;
  elementType: string;
  data: PatchData;
  element: HTMLElement;
};

const SELECTABLE =
  "h1,h2,h3,h4,h5,h6,p,a,button,img,figcaption,li,span";

function directText(element: HTMLElement) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function setText(element: HTMLElement, value: string, mode: "direct" | "full") {
  if (mode === "full") {
    if (element.textContent !== value) element.textContent = value;
    return;
  }
  const nodes = Array.from(element.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE,
  );
  if (nodes.length === 0) {
    element.insertBefore(document.createTextNode(value), element.firstChild);
    return;
  }
  const current = nodes
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (current === value) return;
  nodes[0].textContent = value;
  for (let index = 1; index < nodes.length; index++) nodes[index].textContent = "";
}

function applyPatch(patch: { selector: string; data: PatchData }) {
  let element: HTMLElement | null = null;
  try {
    element = document.querySelector<HTMLElement>(patch.selector);
  } catch {
    return;
  }
  if (!element) return;
  const data = patch.data ?? {};
  element.dataset.visualPatched = "1";
  if (typeof data.hidden === "boolean") {
    element.style.display = data.hidden ? "none" : "";
  }
  if (typeof data.text === "string" && element.tagName !== "IMG") {
    setText(element, data.text, data.textMode ?? "full");
  }
  if (element instanceof HTMLAnchorElement && typeof data.href === "string") {
    element.setAttribute("href", data.href);
  }
  if (element instanceof HTMLImageElement) {
    if (typeof data.src === "string") element.src = data.src;
    if (typeof data.alt === "string") element.alt = data.alt;
  }
}

function cssSelector(element: HTMLElement) {
  if (element.id) return `#${CSS.escape(element.id)}`;
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    let part = current.tagName.toLowerCase();
    const parentElement: HTMLElement | null = current.parentElement;
    if (!parentElement) break;
    const siblings = Array.from(parentElement.children).filter(
      (child: Element) => child.tagName === current!.tagName,
    );
    if (siblings.length > 1) {
      part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
    }
    parts.unshift(part);
    if (current.tagName === "MAIN") break;
    current = parentElement;
  }
  return parts.join(" > ");
}

function elementData(element: HTMLElement): SelectedElement {
  const isImage = element instanceof HTMLImageElement;
  const direct = !isImage ? directText(element) : "";
  const mode: "direct" | "full" = direct ? "direct" : "full";
  const fallbackText = !isImage
    ? (element.textContent ?? "").replace(/\s+/g, " ").trim()
    : "";
  const label =
    (isImage ? element.alt : direct || fallbackText).slice(0, 80) ||
    `${element.tagName.toLowerCase()} element`;
  return {
    selector: cssSelector(element),
    label,
    elementType: element.tagName.toLowerCase(),
    element,
    data: {
      ...(isImage
        ? { src: element.getAttribute("src") ?? "", alt: element.alt }
        : { text: direct || fallbackText, textMode: mode }),
      ...(element instanceof HTMLAnchorElement
        ? { href: element.getAttribute("href") ?? "" }
        : {}),
      hidden: element.style.display === "none",
    },
  };
}

/** Applies published element patches to every public page. */
export function PublishedVisualPatches() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    let cancelled = false;
    let patches: Array<{ selector: string; data: PatchData }> = [];
    let applying = false;

    const run = () => {
      if (applying || cancelled) return;
      applying = true;
      for (const patch of patches) applyPatch(patch);
      applying = false;
    };

    fetch(`/api/visual-content?path=${encodeURIComponent(pathname)}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((json) => {
        patches = json.patches ?? [];
        run();
      })
      .catch(() => undefined);

    const observer = new MutationObserver(() => window.requestAnimationFrame(run));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

/** Authenticated universal visual editor over the original public page. */
export function UniversalVisualEditor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const requested = searchParams.get("visualEditor") === "1";
  const [authenticated, setAuthenticated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [draft, setDraft] = useState<PatchData>({});
  const [patches, setPatches] = useState<Patch[]>([]);
  const [revisions, setRevisions] = useState<Array<{ id: number; createdAt: string }>>([]);
  const [drawer, setDrawer] = useState<"pages" | "edits" | "versions" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const hoverRef = useRef<HTMLElement | null>(null);

  const supported = useMemo(
    () => VISUAL_EDITOR_PAGES.some((page) => page.path === pathname),
    [pathname],
  );

  const load = useCallback(async () => {
    const response = await fetch(
      `/api/admin/visual-content?path=${encodeURIComponent(pathname)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return;
    const json = await response.json();
    setPatches(json.patches ?? []);
    setRevisions(json.revisions ?? []);
    for (const patch of json.patches ?? []) {
      applyPatch({ selector: patch.selector, data: patch.draftData ?? {} });
    }
  }, [pathname]);

  useEffect(() => {
    if (!requested || pathname.startsWith("/admin")) return;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(() => {
        setAuthenticated(true);
        load();
      })
      .catch(() => router.replace("/admin/login"));
  }, [requested, pathname, router, load]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!authenticated || !editMode) return;

    const find = (target: EventTarget | null) => {
      const node = target instanceof Element ? target : null;
      if (!node || node.closest("[data-visual-ui]")) return null;
      const candidate = node.closest<HTMLElement>(SELECTABLE);
      if (!candidate || candidate.closest("[data-visual-ui]")) return null;
      if (candidate.tagName === "SPAN" && !(candidate.textContent ?? "").trim()) {
        return candidate.parentElement?.closest<HTMLElement>(SELECTABLE) ?? null;
      }
      return candidate;
    };

    const over = (event: MouseEvent) => {
      const element = find(event.target);
      if (hoverRef.current && hoverRef.current !== element) {
        hoverRef.current.style.removeProperty("outline");
        hoverRef.current.style.removeProperty("outline-offset");
      }
      if (element) {
        element.style.outline = "2px solid #ffd444";
        element.style.outlineOffset = "3px";
        hoverRef.current = element;
      }
    };

    const out = (event: MouseEvent) => {
      const element = find(event.target);
      if (element && element !== selected?.element) {
        element.style.removeProperty("outline");
        element.style.removeProperty("outline-offset");
      }
    };

    const click = (event: MouseEvent) => {
      const element = find(event.target);
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      const current = elementData(element);
      const existing = patches.find((patch) => patch.selector === current.selector);
      const data = existing?.draftData
        ? { ...current.data, ...existing.draftData }
        : current.data;
      element.style.outline = "3px solid #ffd444";
      element.style.outlineOffset = "3px";
      setSelected(current);
      setDraft(data);
    };

    document.addEventListener("mouseover", over, true);
    document.addEventListener("mouseout", out, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("mouseover", over, true);
      document.removeEventListener("mouseout", out, true);
      document.removeEventListener("click", click, true);
      if (hoverRef.current) {
        hoverRef.current.style.removeProperty("outline");
        hoverRef.current.style.removeProperty("outline-offset");
      }
    };
  }, [authenticated, editMode, patches, selected]);

  const closeInspector = () => {
    if (selected?.element) {
      selected.element.style.removeProperty("outline");
      selected.element.style.removeProperty("outline-offset");
    }
    setSelected(null);
  };

  const save = async () => {
    if (!selected) return;
    setBusy("save");
    const response = await fetch("/api/admin/visual-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagePath: pathname,
        selector: selected.selector,
        label: selected.label,
        elementType: selected.elementType,
        data: draft,
      }),
    });
    const json = await response.json();
    if (response.ok) {
      applyPatch({ selector: selected.selector, data: draft });
      await load();
      closeInspector();
      setToast("Element draft saved");
    } else setToast(json.error ?? "Unable to save edit");
    setBusy(null);
  };

  const publish = async () => {
    setBusy("publish");
    const response = await fetch("/api/admin/visual-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: pathname, action: "publish" }),
    });
    if (response.ok) {
      await load();
      setToast("Page edits published");
    }
    setBusy(null);
  };

  const discard = async () => {
    if (!window.confirm("Discard every element draft on this page?")) return;
    await fetch("/api/admin/visual-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: pathname, action: "discard" }),
    });
    window.location.reload();
  };

  const removePatch = async (patch: Patch) => {
    if (!patch.id || !window.confirm("Remove this visual edit?")) return;
    await fetch("/api/admin/visual-content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: patch.id, pagePath: pathname }),
    });
    setToast("Visual edit removed");
    window.setTimeout(() => window.location.reload(), 500);
  };

  const restore = async (revisionId: number) => {
    await fetch("/api/admin/visual-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagePath: pathname,
        action: "restore",
        revisionId,
      }),
    });
    setToast("Version restored as draft");
    await load();
    setDrawer(null);
  };

  if (!requested || !authenticated || pathname.startsWith("/admin")) return null;

  return (
    <div data-visual-ui>
      {/* Floating full-site toolbar */}
      <div className="fixed inset-x-2 bottom-3 z-[300] mx-auto flex w-fit max-w-[calc(100vw-1rem)] items-center gap-1.5 rounded-2xl border border-white/10 bg-[#0b0b0a]/95 p-1.5 text-white shadow-2xl backdrop-blur-xl sm:bottom-5 sm:p-2">
        <button
          onClick={() => setDrawer("pages")}
          className="flex h-10 min-w-0 items-center gap-2 rounded-xl px-3 text-[10px] font-semibold text-white/60 hover:bg-white/10 hover:text-white"
        >
          <FileText size={14} className="shrink-0 text-[#ffd444]" />
          <span className="hidden max-w-32 truncate sm:block">
            {VISUAL_EDITOR_PAGES.find((page) => page.path === pathname)?.title ??
              pathname}
          </span>
          <ChevronRight size={12} />
        </button>

        <span className="h-6 w-px bg-white/10" />

        <button
          onClick={() => setEditMode((value) => !value)}
          className={`inline-flex h-10 items-center gap-2 rounded-xl px-3 text-[10px] font-semibold transition-colors sm:px-4 sm:text-[11px] ${
            editMode
              ? "bg-[#ffd444] text-[#0b0b0a]"
              : "border border-white/12 text-white/60 hover:text-white"
          }`}
        >
          {editMode ? <MousePointerClick size={14} /> : <Pencil size={14} />}
          {editMode ? "Edit On" : "Edit Mode"}
        </button>

        <button
          onClick={() => setDrawer("edits")}
          className="grid h-10 w-10 place-items-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white"
          aria-label="Saved edits"
        >
          <History size={14} />
        </button>

        <button
          onClick={publish}
          disabled={busy === "publish"}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#ffd444] px-3 text-[10px] font-semibold text-[#0b0b0a] disabled:opacity-50 sm:px-4 sm:text-[11px]"
        >
          {busy === "publish" ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Send size={13} />
          )}
          <span className="hidden sm:inline">Publish</span>
        </button>
      </div>

      {editMode && !selected && (
        <div className="pointer-events-none fixed left-1/2 top-24 z-[290] -translate-x-1/2 rounded-full bg-[#ffd444] px-4 py-2 text-[10px] font-semibold text-[#0b0b0a] shadow-xl">
          Tap any heading, text, button, link or image
        </div>
      )}

      {/* Element inspector */}
      {selected && (
        <div className="fixed inset-0 z-[310] flex justify-end bg-black/45 backdrop-blur-[1px]">
          <aside className="g-panel h-full w-full max-w-[420px] overflow-y-auto border-l border-white/10 bg-[#0d0d0b] p-5 text-white shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Selected {selected.elementType}
                </p>
                <h2 className="mt-1 line-clamp-2 font-display text-xl font-semibold">
                  {selected.label}
                </h2>
              </div>
              <button
                onClick={closeInspector}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15"
              >
                <X size={15} />
              </button>
            </div>

            <div className="my-6 h-px bg-white/10" />

            {selected.elementType === "img" ? (
              <>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/40">
                    <ImageIcon size={11} className="text-[#ffd444]" /> Image URL
                  </span>
                  <input
                    value={draft.src ?? ""}
                    onChange={(event) =>
                      setDraft((data) => ({ ...data, src: event.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-3.5 text-[12px] text-white outline-none focus:border-[#ffd444]"
                  />
                </label>
                <label className="mt-5 block">
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/40">
                    Alternative text
                  </span>
                  <input
                    value={draft.alt ?? ""}
                    onChange={(event) =>
                      setDraft((data) => ({ ...data, alt: event.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-3.5 text-[12px] text-white outline-none focus:border-[#ffd444]"
                  />
                </label>
                {draft.src && (
                  <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draft.src}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/40">
                  <Type size={11} className="text-[#ffd444]" /> Text content
                </span>
                <textarea
                  rows={6}
                  value={draft.text ?? ""}
                  onChange={(event) =>
                    setDraft((data) => ({ ...data, text: event.target.value }))
                  }
                  className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.05] px-3.5 py-3 text-[13px] leading-relaxed text-white outline-none focus:border-[#ffd444]"
                />
              </label>
            )}

            {selected.elementType === "a" && (
              <label className="mt-5 block">
                <span className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/40">
                  <Link2 size={11} className="text-[#ffd444]" /> Link destination
                </span>
                <input
                  value={draft.href ?? ""}
                  onChange={(event) =>
                    setDraft((data) => ({ ...data, href: event.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-3.5 text-[12px] text-white outline-none focus:border-[#ffd444]"
                />
              </label>
            )}

            <button
              onClick={() =>
                setDraft((data) => ({ ...data, hidden: !data.hidden }))
              }
              className={`mt-5 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[11px] transition-colors ${
                draft.hidden
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                  : "border-white/12 text-white/50 hover:text-white"
              }`}
            >
              {draft.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
              {draft.hidden ? "Hidden after save" : "Hide this element"}
            </button>

            <p className="mt-5 break-all rounded-xl bg-white/[0.035] p-3 font-mono text-[8px] leading-relaxed text-white/25">
              {selected.selector}
            </p>

            <button
              onClick={save}
              disabled={busy === "save"}
              className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ffd444] text-[12px] font-semibold text-[#0b0b0a] disabled:opacity-50"
            >
              {busy === "save" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save element draft
            </button>
          </aside>
        </div>
      )}

      {/* Pages and edits drawers */}
      {drawer && (
        <div
          onClick={() => setDrawer(null)}
          className="fixed inset-0 z-[310] flex justify-end bg-black/60 backdrop-blur-[2px]"
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="g-panel h-full w-full max-w-[430px] overflow-y-auto border-l border-white/10 bg-[#0d0d0b] text-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d0d0b]/95 px-5 py-4 backdrop-blur">
              <h2 className="font-display text-xl font-semibold">
                {drawer === "pages"
                  ? "Website Pages"
                  : drawer === "versions"
                    ? "Version History"
                    : "Saved Visual Edits"}
              </h2>
              <button
                onClick={() => setDrawer(null)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15"
              >
                <X size={15} />
              </button>
            </div>

            {drawer === "pages" && (
              <div className="p-4">
                {Array.from(new Set(VISUAL_EDITOR_PAGES.map((page) => page.group))).map(
                  (group) => (
                    <div key={group} className="mb-6">
                      <p className="mb-2 px-2 text-[9px] uppercase tracking-[0.2em] text-[#ffd444]">
                        {group}
                      </p>
                      <div className="space-y-1.5">
                        {VISUAL_EDITOR_PAGES.filter((page) => page.group === group).map(
                          (page) => (
                            <a
                              key={page.path}
                              href={`${page.path}?visualEditor=1`}
                              className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                                page.path === pathname
                                  ? "border-[#ffd444] bg-[#ffd444]/10"
                                  : "border-white/8 hover:border-white/20"
                              }`}
                            >
                              <FileText size={14} className="shrink-0 text-[#ffd444]" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[12px] font-semibold">
                                  {page.title}
                                </span>
                                <span className="block truncate text-[9px] text-white/30">
                                  {page.path}
                                </span>
                              </span>
                              <ChevronRight size={13} className="text-white/25" />
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {drawer === "edits" && (
              <div className="p-5">
                {patches.length === 0 ? (
                  <div className="py-14 text-center text-white/35">
                    <MousePointerClick className="mx-auto" />
                    <p className="mt-3 text-[13px]">No saved element edits yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {patches.map((patch) => (
                      <div
                        key={patch.id ?? patch.selector}
                        className="flex items-center gap-3 rounded-xl border border-white/10 p-3"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.07] text-[#ffd444]">
                          {patch.elementType === "img" ? (
                            <ImageIcon size={13} />
                          ) : (
                            <Type size={13} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-semibold">
                            {patch.label}
                          </span>
                          <span className="block truncate font-mono text-[8px] text-white/25">
                            {patch.selector}
                          </span>
                        </span>
                        <button
                          onClick={() => removePatch(patch)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={discard}
                    className="rounded-full border border-white/15 px-4 py-3 text-[10px] text-white/55 hover:text-white"
                  >
                    Discard drafts
                  </button>
                  <button
                    onClick={() => setDrawer("versions")}
                    className="rounded-full border border-white/15 px-4 py-3 text-[10px] text-white/55 hover:text-white"
                  >
                    Version history
                  </button>
                </div>
              </div>
            )}

            {drawer === "versions" && (
              <div className="space-y-2 p-5">
                {revisions.length === 0 ? (
                  <p className="py-14 text-center text-[13px] text-white/35">
                    No published versions yet.
                  </p>
                ) : (
                  revisions.map((revision) => (
                    <div
                      key={revision.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 p-4"
                    >
                      <Clock3 size={14} className="shrink-0 text-[#ffd444]" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold">
                          Published snapshot
                        </span>
                        <span className="text-[9px] text-white/30">
                          {new Date(revision.createdAt).toLocaleString()}
                        </span>
                      </span>
                      <button
                        onClick={() => restore(revision.id)}
                        className="rounded-full border border-white/15 px-3 py-2 text-[9px] hover:bg-[#ffd444] hover:text-[#0b0b0a]"
                      >
                        Restore
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      {toast && (
        <div className="g-fade fixed left-1/2 top-5 z-[400] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#ffd444] px-5 py-3 text-[12px] font-semibold text-[#0b0b0a] shadow-2xl">
          <Check size={14} /> {toast}
        </div>
      )}
    </div>
  );
}
