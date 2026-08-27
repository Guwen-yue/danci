import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminSessions } from "@/db/schema";
import type { AdminUser } from "@/db/schema";
import type { AdminRole, AdminStatus, PublicUser } from "@/lib/types";

const SESSION_COOKIE = "admin_session";
/** 会话有效期 7 天 */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function toPublicUser(user: AdminUser): PublicUser {
  const iso = (v: Date | string) => (typeof v === "string" ? v : v.toISOString());
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AdminRole,
    status: user.status as AdminStatus,
    createdAt: iso(user.createdAt),
    updatedAt: iso(user.updatedAt),
  };
}

async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** 创建会话并写入 httpOnly cookie，返回 token */
export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  await db.insert(adminSessions).values({ userId, token, expiresAt });
  await setSessionCookie(token);
  return token;
}

/** 销毁当前会话并清除 cookie */
export async function destroySession() {
  const token = await getSessionToken();
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }
  await clearSessionCookie();
}

/** 根据 cookie 获取当前登录用户，会话过期或账号被停用时返回 null */
export async function getSessionUser(): Promise<PublicUser | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const session = await db.query.adminSessions.findFirst({
    where: eq(adminSessions.token, token),
    with: { user: true },
  });
  if (!session?.user) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await db.delete(adminSessions).where(eq(adminSessions.id, session.id));
    return null;
  }
  if (session.user.status === "disabled") {
    // 账号被停用：立即销毁会话，不允许继续登录
    await db.delete(adminSessions).where(eq(adminSessions.id, session.id));
    return null;
  }
  return toPublicUser(session.user);
}
