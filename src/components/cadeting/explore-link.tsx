"use client";

import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CineOverlay } from "@/components/cadeting/cine-overlay";

/** How long the departing cinematic card stays on screen (ms). */
const LEAVE_DURATION = 2300;

/** sessionStorage key that marks a cinematic handoff to the unit page. */
export const CINE_FLAG = "stc:cine-from-explore";

/**
 * Navigates to a cadet unit page with a cinematic blackout transition —
 * the screen cuts to black with letterbox bars and the unit crest,
 * then hands off to the unit page's own cinematic intro.
 */
export function CadetExploreLink({
  href,
  unitName,
  crest,
  tagline = "St. Thomas' College · Matale",
  children,
  className = "",
}: {
  href: string;
  unitName: string;
  crest: string;
  tagline?: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (leaving) return;
    setLeaving(true);
    router.prefetch(href);
    // Mark the handoff: the destination page must NOT replay the intro —
    // this exit card IS the single cinematic play.
    try {
      window.sessionStorage.setItem(CINE_FLAG, href);
    } catch {
      /* storage unavailable — page falls back to its own intro */
    }
    window.setTimeout(() => router.push(href), LEAVE_DURATION);
  };

  return (
    <>
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>

      {leaving && (
        <CineOverlay crest={crest} name={unitName} tagline={tagline} />
      )}
    </>
  );
}
