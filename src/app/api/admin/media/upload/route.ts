import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { processAndStoreImage } from "@/lib/media-processing";
import { getStorageDriver } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Remote object storage should use a direct signed upload to avoid app-hosting bandwidth.
  if (getStorageDriver() !== "local") {
    return NextResponse.json(
      {
        error:
          "Direct upload is enabled for this storage provider. Request a signed upload URL first.",
      },
      { status: 409 },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }

    const result = await processAndStoreImage({
      buffer: Buffer.from(await file.arrayBuffer()),
      filename: file.name,
      title: String(form.get("title") || ""),
      altText: String(form.get("altText") || ""),
      caption: String(form.get("caption") || ""),
      folder: String(form.get("folder") || "site-assets"),
      category: String(form.get("category") || "Uncategorised"),
      userId: admin.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image upload failed." },
      { status: 400 },
    );
  }
}
