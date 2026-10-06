import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { adminAuditLogs, posts } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

const CATEGORIES = [
  "Achievements",
  "Sports",
  "Culture",
  "Academics",
  "Ceremony",
  "Notice",
];

const REVALIDATE = ["/", "/news", "/achievements"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function safeImage(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return null;
  if (!text.startsWith("/") && !text.startsWith("https://")) return null;
  return text;
}

async function revalidateNews() {
  for (const path of REVALIDATE) revalidatePath(path);
}

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(posts).orderBy(desc(posts.publishedAt));
  return NextResponse.json({ posts: rows, categories: CATEGORIES });
}

export async function POST(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "A headline is required." }, { status: 400 });

    const image = safeImage(body.image);
    if (!image) {
      return NextResponse.json(
        { error: "Cover image must be a local /path or an HTTPS URL." },
        { status: 400 },
      );
    }

    const base = slugify(body.slug || title) || `story-${Date.now()}`;
    const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, base)).limit(1);
    const slug = existing.length ? `${base}-${Date.now().toString().slice(-4)}` : base;

    const [created] = await db
      .insert(posts)
      .values({
        slug,
        title,
        excerpt: String(body.excerpt ?? "").trim() || "Draft excerpt — update this line.",
        body: String(body.body ?? "").trim() || "Write the story here…",
        category:
          typeof body.category === "string" && body.category.trim()
            ? body.category.trim().slice(0, 40)
            : "Notice",
        image,
        location: String(body.location ?? "").trim() || "College Campus",
        author: String(body.author ?? "").trim() || "Media Unit",
        readMinutes: Math.min(30, Math.max(1, Number(body.readMinutes) || 3)),
        featured: Boolean(body.featured),
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      })
      .returning();

    await db.insert(adminAuditLogs).values({
      userId: admin.id,
      action: "create_post",
      entity: "post",
      entityId: String(created.id),
    });
    await revalidateNews();
    return NextResponse.json({ post: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create the story." },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid story." }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
    if (typeof body.excerpt === "string") patch.excerpt = body.excerpt.trim();
    if (typeof body.body === "string") patch.body = body.body;
    if (typeof body.location === "string") patch.location = body.location.trim();
    if (typeof body.author === "string") patch.author = body.author.trim();
    if (typeof body.category === "string" && body.category.trim()) {
      patch.category = body.category.trim().slice(0, 40);
    }
    if (body.image !== undefined) {
      const image = safeImage(body.image);
      if (!image) {
        return NextResponse.json(
          { error: "Cover image must be a local /path or an HTTPS URL." },
          { status: 400 },
        );
      }
      patch.image = image;
    }
    if (body.readMinutes !== undefined) {
      patch.readMinutes = Math.min(30, Math.max(1, Number(body.readMinutes) || 3));
    }
    if (body.featured !== undefined) patch.featured = Boolean(body.featured);
    if (body.publishedAt) patch.publishedAt = new Date(body.publishedAt);

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const [updated] = await db.update(posts).set(patch).where(eq(posts.id, id)).returning();
    if (!updated) return NextResponse.json({ error: "Story not found." }, { status: 404 });

    revalidatePath(`/news/${updated.slug}`);
    await revalidateNews();
    await db.insert(adminAuditLogs).values({
      userId: admin.id,
      action: "update_post",
      entity: "post",
      entityId: String(id),
    });
    return NextResponse.json({ post: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save the story." },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    const numeric = Number(id);
    if (!Number.isInteger(numeric)) {
      return NextResponse.json({ error: "Invalid story." }, { status: 400 });
    }
    const [removed] = await db.delete(posts).where(eq(posts.id, numeric)).returning();
    if (removed) revalidatePath(`/news/${removed.slug}`);
    await revalidateNews();
    await db.insert(adminAuditLogs).values({
      userId: admin.id,
      action: "delete_post",
      entity: "post",
      entityId: String(numeric),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete the story." },
      { status: 400 },
    );
  }
}
