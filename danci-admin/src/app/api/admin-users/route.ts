import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { toPublicUser } from "@/lib/session";
import { requireSuperUser } from "@/lib/user";
import type { AdminRole, AdminStatus } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidRole(role: unknown): role is AdminRole {
  return role === "super" || role === "admin";
}

function isValidStatus(status: unknown): status is AdminStatus {
  return status === "active" || status === "disabled";
}

/** 管理员列表（仅超级管理员） */
export async function GET() {
  const current = await requireSuperUser();
  if (!current) {
    return NextResponse.json({ error: "无权限，仅系统管理员可访问" }, { status: 403 });
  }
  const users = await db
    .select()
    .from(adminUsers)
    .orderBy(asc(adminUsers.createdAt));
  return NextResponse.json({ users: users.map(toPublicUser) });
}

/** 新建管理员（仅超级管理员） */
export async function POST(request: Request) {
  const current = await requireSuperUser();
  if (!current) {
    return NextResponse.json({ error: "无权限，仅系统管理员可访问" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role: AdminRole = isValidRole(body?.role) ? body.role : "admin";
  const status: AdminStatus = isValidStatus(body?.status) ? body.status : "active";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "请填写完整的姓名、邮箱和密码" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "密码长度至少为 6 位" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
  }

  const existing = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "该邮箱已存在" }, { status: 409 });
  }

  const [user] = await db
    .insert(adminUsers)
    .values({ name, email, password: await hashPassword(password), role, status })
    .returning();
  return NextResponse.json({ user: toPublicUser(user) });
}
