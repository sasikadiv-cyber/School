import type { ReactNode } from "react";

/**
 * Circular heraldic crest used in place of generic icons for
 * societies, cadet units, bands and college honours.
 */
export function Crest({
  initials,
  label,
  size = "md",
  tone = "gold",
  className = "",
}: {
  initials: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  tone?: "gold" | "light" | "dark";
  className?: string;
}) {
  const dims =
    size === "lg"
      ? "h-20 w-20 text-[19px] ring-2 [&>span:first-child]:inset-[5px] md:h-24 md:w-24 md:text-[22px]"
      : size === "sm"
        ? "h-11 w-11 text-[10px]"
        : "h-14 w-14 text-[13px]";

  const palette =
    tone === "light"
      ? "bg-white text-ink ring-ink/10"
      : tone === "dark"
        ? "bg-ink text-gold ring-white/20"
        : "bg-gold text-ink ring-ink/10";

  return (
    <span
      aria-label={label ?? initials}
      data-visual-bg=""
      className={`relative grid shrink-0 place-items-center rounded-full bg-cover bg-center ring-1 ${palette} ${dims} ${className}`}
    >
      <span className="absolute inset-[3px] rounded-full border border-current opacity-25" />
      <span className="font-display font-semibold leading-none tracking-[-0.02em]">
        {initials}
      </span>
    </span>
  );
}

/** Wraps a crest with a soft plinth, for use over photography. */
export function CrestBadge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`grid place-items-center rounded-full bg-ink/85 p-1.5 ${className}`}
    >
      {children}
    </span>
  );
}
