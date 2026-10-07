"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { CineCard } from "@/components/cadeting/cine-overlay";
import { CINE_FLAG } from "@/components/cadeting/explore-link";

/** Default hold for direct visits — overridable from Admin Settings. */
const DEFAULT_HOLD = 2400;
/** Hold when arriving from the Explore transition (ms). */
const HANDOFF_HOLD = 450;
/** Fade-out duration (must match .cine-overlay-out). */
const FADE = 900;

/**
 * Cinematic page transition for cadet unit pages.
 *
 * The card is rendered in the server HTML (no portal, no mount gate), so
 * it paints on the very first frame — page content can never flash
 * through before it appears. It then fades away to reveal the page.
 *
 *  · Explore click → exit card plays → this card continues it seamlessly
 *  · Direct visit  → card holds briefly, then fades open
 *
 * The reveal choreography lives only on the Explore exit card, so the
 * animation plays exactly once across the page boundary.
 */
export function CinematicIntro({
  crest,
  name,
  tagline,
  path,
  enabled = true,
  holdMs = DEFAULT_HOLD,
  children,
}: {
  crest: string;
  name: string;
  tagline: string;
  /** Expectation for the Explore handoff, e.g. `/cadeting/army-cadet` */
  path: string;
  /** Controlled globally from Admin Settings, never through visual patches. */
  enabled?: boolean;
  holdMs?: number;
  children: ReactNode;
}) {
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setGone(true);
      document.body.style.overflow = "";
      return;
    }
    let fromExplore = false;
    try {
      fromExplore = window.sessionStorage.getItem(CINE_FLAG) === path;
      window.sessionStorage.removeItem(CINE_FLAG);
    } catch {
      /* no storage — treat as a direct visit */
    }

    // Always start the page at the top behind the card.
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const hold = fromExplore
      ? HANDOFF_HOLD
      : Math.max(0, Math.min(8000, Number(holdMs) || DEFAULT_HOLD));
    const t1 = window.setTimeout(() => {
      setClosing(true);
      document.body.style.overflow = "";
    }, hold);
    const t2 = window.setTimeout(() => setGone(true), hold + FADE);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, [path, enabled, holdMs]);

  return (
    <>
      {children}

      {!gone && (
        <CineCard
          crest={crest}
          name={name}
          tagline={tagline}
          closing={closing}
          instant
        />
      )}
    </>
  );
}
