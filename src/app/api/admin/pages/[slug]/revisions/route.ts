import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import { listRevisions, restoreRevision } from "@/lib/cms";
import { getCmsPageDefinition } from "@/lib/cms-defaults";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const revisions = await listRevisions(slug);
  return NextResponse.json({
    revisions: revisions.map((r) => ({
      id: r.id,
      action: r.action,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const { revisionId } = await req.json();
  if (!Number.isInteger(revisionId)) {
    return NextResponse.json({ error: "Invalid revision." }, { status: 400 });
  }
  const definition = getCmsPageDefinition(slug);
  try {
    await restoreRevision(slug, revisionId, admin.id);
    if (definition) revalidatePath(definition.path);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Restore failed." },
      { status: 400 },
    );
  }
}
