import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  adminAuditLogs,
  visualPatchRevisions,
  visualPatches,
} from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

function validPath(path: unknown): path is string {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("/admin") &&
    !path.startsWith("/api") &&
    path.length <= 240
  );
}

function cleanData(value: unknown) {
  const input = (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;
  const data: {
    text?: string;
    href?: string;
    src?: string;
    alt?: string;
    hidden?: boolean;
    textMode?: "direct" | "full";
  } = {};
  if (typeof input.text === "string") data.text = input.text.slice(0, 20000);
  if (typeof input.alt === "string") data.alt = input.alt.slice(0, 1000);
  if (typeof input.hidden === "boolean") data.hidden = input.hidden;
  if (input.textMode === "direct" || input.textMode === "full") {
    data.textMode = input.textMode;
  }
  for (const key of ["href", "src"] as const) {
    if (typeof input[key] === "string" && input[key]) {
      const url = input[key].trim();
      if (!url.startsWith("/") && !url.startsWith("https://") && !url.startsWith("#")) {
        throw new Error(`${key} must be a local path, anchor or HTTPS URL.`);
      }
      data[key] = url.slice(0, 2000);
    }
  }
  return data;
}

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const path = new URL(req.url).searchParams.get("path") || "/";
  if (!validPath(path)) return NextResponse.json({ error: "Invalid path" }, { status: 400 });

  const patches = await db
    .select()
    .from(visualPatches)
    .where(eq(visualPatches.pagePath, path))
    .orderBy(asc(visualPatches.id));
  const revisions = await db
    .select({ id: visualPatchRevisions.id, createdAt: visualPatchRevisions.createdAt })
    .from(visualPatchRevisions)
    .where(eq(visualPatchRevisions.pagePath, path))
    .orderBy(asc(visualPatchRevisions.id));

  const hasDraftChanges = patches.some(
    (patch) => JSON.stringify(patch.draftData) !== JSON.stringify(patch.publishedData),
  );
  return NextResponse.json({ patches, revisions, hasDraftChanges });
}

export async function PATCH(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!validPath(body.pagePath)) throw new Error("Invalid page path.");
    const selector = String(body.selector ?? "").trim();
    if (!selector || selector.length > 2000) throw new Error("Invalid element selector.");
    const data = cleanData(body.data);
    const existing = await db
      .select()
      .from(visualPatches)
      .where(
        and(
          eq(visualPatches.pagePath, body.pagePath),
          eq(visualPatches.selector, selector),
        ),
      )
      .limit(1);

    const patch = existing[0]
      ? (
          await db
            .update(visualPatches)
            .set({
              draftData: data,
              label: String(body.label ?? existing[0].label).slice(0, 300),
              elementType: String(body.elementType ?? existing[0].elementType).slice(0, 30),
              updatedBy: admin.id,
              updatedAt: new Date(),
            })
            .where(eq(visualPatches.id, existing[0].id))
            .returning()
        )[0]
      : (
          await db
            .insert(visualPatches)
            .values({
              pagePath: body.pagePath,
              selector,
              label: String(body.label ?? "Page element").slice(0, 300),
              elementType: String(body.elementType ?? "text").slice(0, 30),
              draftData: data,
              publishedData: {},
              updatedBy: admin.id,
            })
            .returning()
        )[0];

    await db.insert(adminAuditLogs).values({
      userId: admin.id,
      action: "save_visual_patch",
      entity: "visual_patch",
      entityId: String(patch.id),
      details: { pagePath: body.pagePath, selector },
    });
    revalidatePath(body.pagePath);
    return NextResponse.json({ patch });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save edit." },
      { status: 400 },
    );
  }
}

export async function POST(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { pagePath, action = "publish", revisionId } = await req.json();
    if (!validPath(pagePath)) throw new Error("Invalid page path.");

    if (action === "restore") {
      const [revision] = await db
        .select()
        .from(visualPatchRevisions)
        .where(
          and(
            eq(visualPatchRevisions.id, Number(revisionId)),
            eq(visualPatchRevisions.pagePath, pagePath),
          ),
        )
        .limit(1);
      if (!revision) throw new Error("Version not found.");
      const snapshot = revision.snapshot as Array<{
        selector: string;
        label: string;
        elementType: string;
        data: Record<string, unknown>;
      }>;
      for (const item of snapshot) {
        const [existing] = await db
          .select()
          .from(visualPatches)
          .where(
            and(
              eq(visualPatches.pagePath, pagePath),
              eq(visualPatches.selector, item.selector),
            ),
          )
          .limit(1);
        if (existing) {
          await db
            .update(visualPatches)
            .set({ draftData: cleanData(item.data), updatedBy: admin.id })
            .where(eq(visualPatches.id, existing.id));
        }
      }
      revalidatePath(pagePath);
      return NextResponse.json({ success: true });
    }

    const rows = await db
      .select()
      .from(visualPatches)
      .where(eq(visualPatches.pagePath, pagePath));

    if (action === "discard") {
      await Promise.all(
        rows.map((row) =>
          db
            .update(visualPatches)
            .set({ draftData: row.publishedData, updatedBy: admin.id })
            .where(eq(visualPatches.id, row.id)),
        ),
      );
      revalidatePath(pagePath);
      return NextResponse.json({ success: true });
    }

    await db.insert(visualPatchRevisions).values({
      pagePath,
      snapshot: rows.map((row) => ({
        selector: row.selector,
        label: row.label,
        elementType: row.elementType,
        data: row.publishedData,
      })),
      createdBy: admin.id,
    });
    await Promise.all(
      rows.map((row) =>
        db
          .update(visualPatches)
          .set({
            publishedData: row.draftData,
            updatedBy: admin.id,
            updatedAt: new Date(),
          })
          .where(eq(visualPatches.id, row.id)),
      ),
    );
    await db.insert(adminAuditLogs).values({
      userId: admin.id,
      action: "publish_visual_page",
      entity: "visual_page",
      entityId: pagePath,
    });
    revalidatePath(pagePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to publish edits." },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, pagePath } = await req.json();
  await db.delete(visualPatches).where(eq(visualPatches.id, Number(id)));
  if (validPath(pagePath)) revalidatePath(pagePath);
  return NextResponse.json({ success: true });
}
