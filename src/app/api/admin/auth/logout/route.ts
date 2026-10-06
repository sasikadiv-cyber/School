import { NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  await logoutAdmin();
  return NextResponse.redirect(new URL("/admin/login", req.url), 303);
}
