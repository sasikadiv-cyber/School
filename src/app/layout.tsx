import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Inter, Inter_Tight } from "next/font/google";
import {
  PublishedVisualPatches,
  UniversalVisualEditor,
} from "@/components/cms/universal-visual-editor";
import {
  VISUAL_PATCH_BOOTSTRAP,
  getPublishedVisualPatchMap,
} from "@/lib/visual-patch-boot";
import "./globals.css";

const display = Inter_Tight({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "St. Thomas' College Matale — Animo Et Fide",
  description:
    "St. Thomas' College, Matale. A boys' school shaping scholars, athletes, artists and leaders of uncommon character since 1873.",
};

// Default theme is DARK. Only an explicit visitor choice of "light" flips it.
const themeInit = `try {
  var t = localStorage.getItem("theme");
  if (t !== "light") {
    document.documentElement.classList.add("dark");
  }
} catch (e) {
  document.documentElement.classList.add("dark");
}`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const patchMap = await getPublishedVisualPatchMap();
  const patchJson = JSON.stringify(patchMap).replace(/</g, "\\u003c");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {/* Published visual-editor patches, applied before first paint.
            Prevents the old content flashing after an image/text change. */}
        <script
          id="stc-visual-patches"
          dangerouslySetInnerHTML={{
            __html: `window.__STC_VP__=${patchJson};${VISUAL_PATCH_BOOTSTRAP}`,
          }}
        />
      </head>
      <body
        className={`${display.variable} ${sans.variable} bg-surface font-sans text-fg antialiased`}
      >
        {children}
        <Suspense fallback={null}>
          <PublishedVisualPatches />
          <UniversalVisualEditor />
        </Suspense>
      </body>
    </html>
  );
}
