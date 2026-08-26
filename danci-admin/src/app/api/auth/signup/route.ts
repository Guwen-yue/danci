import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { createSession, toPublicUser } from "@/lib/session";
import { getNeedsSetup } from "@/lib/user";

/** 注册首个系统管理员：仅当 admin_users 表为空时允许 */
export async function POST(request: Request) {
  const needsSetup = await getNeedsSetup();
  if (!needsSetup) {
    return NextResponse.json(
      { error: "系统管理员已存在，不允许重复注册" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "请填写完整的注册信息" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "密码长度至少为 6 位" }, { status: 400 });
  }

  const existing = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
  }

  const [user] = await db
    .insert(adminUsers)
    .values({ name, email, password: await hashPassword(password), role: "super" })
    .returning();

  await createSession(user.id);
  return NextResponse.json({ user: toPublicUser(user) });
}
