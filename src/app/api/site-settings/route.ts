import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSiteSettings("published"), {
    headers: { "Cache-Control": "no-store" },
  });
}
