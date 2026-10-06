import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/cms";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: await getSiteSettings("draft") });
}

export async function PATCH(req: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { data, publish = false } = await req.json();
    await updateSiteSettings({ data, publish: Boolean(publish), userId: admin.id });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to save settings." }, { status: 400 });
  }
}
