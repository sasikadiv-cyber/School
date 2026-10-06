import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { promisify } from "node:util";
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";
import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { adminAuditLogs, adminSessions, adminUsers } from "@/db/schema";

const scrypt = promisify(scryptCb);
const COOKIE = "stc_admin_session";
const SESSION_DAYS = 14;

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, digest] = stored.split(":");
  if (algorithm !== "scrypt" || !salt || !digest) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(digest, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export async function adminSetupAvailable() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(adminUsers);
  return count === 0;
}

export async function createFirstAdmin({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  if (!(await adminSetupAvailable())) throw new Error("Admin setup is already complete.");
  if (password.length < 10) throw new Error("Password must contain at least 10 characters.");
  const [user] = await db
    .insert(adminUsers)
    .values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: await hashPassword(password),
      role: "super_admin",
    })
    .returning();
  await db.insert(adminAuditLogs).values({
    userId: user.id,
    action: "first_admin_created",
    entity: "admin_user",
    entityId: String(user.id),
  });
  return user;
}

export async function createAdminSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const headerStore = await headers();
  await db.insert(adminSessions).values({
    userId,
    tokenHash: tokenHash(token),
    expiresAt,
    userAgent: headerStore.get("user-agent"),
  });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;

  const [result] = await db
    .select({
      sessionId: adminSessions.id,
      expiresAt: adminSessions.expiresAt,
      id: adminUsers.id,
      name: adminUsers.name,
      email: adminUsers.email,
      role: adminUsers.role,
      active: adminUsers.active,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(
      and(
        eq(adminSessions.tokenHash, tokenHash(token)),
        gt(adminSessions.expiresAt, new Date()),
        eq(adminUsers.active, true),
      ),
    )
    .limit(1);

  if (!result) return null;
  return result;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

export async function loginAdmin(email: string, password: string) {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.trim().toLowerCase()))
    .limit(1);
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return null;
  }
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(adminUsers.id, user.id));
  await createAdminSession(user.id);
  await db.insert(adminAuditLogs).values({
    userId: user.id,
    action: "login",
    entity: "admin_session",
  });
  return user;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (token) {
    await db
      .delete(adminSessions)
      .where(eq(adminSessions.tokenHash, tokenHash(token)));
  }
  cookieStore.delete(COOKIE);
}
