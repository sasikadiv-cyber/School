import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  adminAuditLogs,
  contentCollections,
  events,
  galleryItems,
  posts,
  staff,
} from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

const DEFAULTS: Record<string, string[]> = {
  news: [
    "Achievements",
    "Sports",
    "Culture",
    "Academics",
    "Ceremony",
    "Notice",
    "Announcements",
  ],
  gallery: ["Campus", "Academics", "Sports", "Arts & Culture", "Ceremonies"],
  event: ["Sports", "Culture", "Ceremony", "Admissions", "Academic"],
  staff: [
    "Leadership",
    "Science & ICT",
    "Mathematics",
    "Commerce",
    "Humanities & Languages",
    "Sports & Cadeting",
    "Primary & Middle School",
  ],
};

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [postCats, galleryCats, eventCats, staffDepts, custom] =
    await Promise.all([
      db.selectDistinct({ value: posts.category }).from(posts),
      db.selectDistinct({ value: galleryItems.category }).from(galleryItems),
      db.selectDistinct({ value: events.category }).from(events),
      db.selectDistinct({ value: staff.department }).from(staff),
      db.select().from(contentCollections).orderBy(asc(contentCollections.name)),
    ]);

  const list = (type: string, databaseValues: { value: string }[]) =>
    Array.from(
      new Set([
        ...DEFAULTS[type],
        ...databaseValues.map((item) => item.value),
        ...custom.filter((item) => item.type === type).map((item) => item.name),
      ]),
    ).filter(Boolean);

  return NextResponse.json({
    newsCategories: list("news", postCats),
    galleryCategories: list("gallery", galleryCats),
    eventCategories: list("event", eventCats),
    staffDepartments: list("staff", staffDepts),
    customCollections: custom,
  });
}

export async function POST(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const type = String(body.type ?? "").trim();
    const name = String(body.name ?? "").trim().replace(/\s+/g, " ");
    if (!Object.keys(DEFAULTS).includes(type)) {
      return NextResponse.json({ error: "Invalid collection type." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Collection name must contain 2–100 characters." },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(contentCollections)
      .where(and(eq(contentCollections.type, type), eq(contentCollections.name, name)))
      .limit(1);

    const collection =
      existing[0] ??
      (
        await db
          .insert(contentCollections)
          .values({ type, name, createdBy: admin.id })
          .returning()
      )[0];

    await db.insert(adminAuditLogs).values({
      userId: admin.id,
      action: "create_collection",
      entity: "content_collection",
      entityId: String(collection.id),
      details: { type, name },
    });

    return NextResponse.json({ success: true, collection, name });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add collection." },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const numeric = Number(id);
  if (!Number.isInteger(numeric)) {
    return NextResponse.json({ error: "Invalid collection." }, { status: 400 });
  }
  await db.delete(contentCollections).where(eq(contentCollections.id, numeric));
  await db.insert(adminAuditLogs).values({
    userId: admin.id,
    action: "delete_collection",
    entity: "content_collection",
    entityId: String(numeric),
  });
  return NextResponse.json({ success: true });
}
