import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Inter, Inter_Tight } from "next/font/google";
import {
  PublishedVisualPatches,
  UniversalVisualEditor,
} from "@/components/cms/universal-visual-editor";
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

const themeInit = `try {
  var t = localStorage.getItem("theme");
  if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
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
