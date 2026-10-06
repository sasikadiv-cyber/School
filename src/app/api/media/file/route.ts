import { NextResponse } from "next/server";
import { getStorage, getStorageDriver } from "@/lib/storage";
import { assertSafeObjectKey } from "@/lib/storage/local";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  webp: "image/webp",
  avif: "image/avif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

export async function GET(req: Request) {
  if (getStorageDriver() !== "local") {
    return NextResponse.json(
      { error: "Local media route is disabled for the configured provider." },
      { status: 404 },
    );
  }

  try {
    const value = new URL(req.url).searchParams.get("key") || "";
    const key = assertSafeObjectKey(value);
    const buffer = await getStorage().getObject(key);
    const extension = key.split(".").pop()?.toLowerCase() || "";
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": MIME[extension] || "application/octet-stream",
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }
}
