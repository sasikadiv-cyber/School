import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import { discardDraft, publishCmsPage } from "@/lib/cms";
import { getCmsPageDefinition } from "@/lib/cms-defaults";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const { action = "publish" } = await req.json().catch(() => ({}));
  const definition = getCmsPageDefinition(slug);
  try {
    if (action === "discard") {
      await discardDraft(slug, admin.id);
      if (definition) revalidatePath(definition.path);
      return NextResponse.json({ success: true, message: "Draft changes discarded." });
    }
    await publishCmsPage(slug, admin.id);
    if (definition) revalidatePath(definition.path);
    return NextResponse.json({ success: true, message: "Page published." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to publish." },
      { status: 400 },
    );
  }
}
