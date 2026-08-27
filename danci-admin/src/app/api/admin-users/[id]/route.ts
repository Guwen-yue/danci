import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { toPublicUser } from "@/lib/session";
import { requireSuperUser } from "@/lib/user";
import type { AdminRole, AdminStatus } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Params = { params: Promise<{ id: string }> };

function isValidRole(role: unknown): role is AdminRole {
  return role === "super" || role === "admin";
}

function isValidStatus(status: unknown): status is AdminStatus {
  return status === "active" || status === "disabled";
}

/** 编辑管理员（仅超级管理员） */
export async function PATCH(request: Request, { params }: Params) {
  const current = await requireSuperUser();
  if (!current) {
    return NextResponse.json({ error: "无权限，仅系统管理员可访问" }, { status: 403 });
  }

  const { id } = await params;
  const [target] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  if (!target) {
    return NextResponse.json({ error: "管理员不存在" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : undefined;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : undefined;
  const password = typeof body?.password === "string" ? body.password : undefined;
  const role = isValidRole(body?.role) ? (body.role as AdminRole) : undefined;
  const status = isValidStatus(body?.status) ? (body.status as AdminStatus) : undefined;

  // 系统管理员不能修改自己的状态和角色（姓名/邮箱/密码可改）
  if (target.id === current.id) {
    if (role !== undefined && role !== target.role) {
      return NextResponse.json({ error: "不能修改当前登录账号的角色" }, { status: 400 });
    }
    if (status !== undefined && status !== target.status) {
      return NextResponse.json({ error: "不能修改当前登录账号的状态" }, { status: 400 });
    }
  }

  // 至少保留一名启用的系统管理员：
  // 将系统管理员降级为普通管理员、或停用启用的系统管理员时校验
  if (target.role === "super") {
    const willDemote = role === "admin";
    const willDisable = status === "disabled" && target.status === "active";
    if (willDemote || willDisable) {
      const activeSupers = await db
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .where(and(eq(adminUsers.role, "super"), eq(adminUsers.status, "active")));
      const others = activeSupers.filter((u) => u.id !== target.id);
      if (others.length === 0) {
        return NextResponse.json({ error: "至少需要保留一名启用的系统管理员" }, { status: 400 });
      }
    }
  }

  if (email && email !== target.email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
  }
  if (email && email !== target.email) {
    const existing = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "该邮箱已被使用" }, { status: 409 });
    }
  }
  if (password !== undefined && password.length < 6) {
    return NextResponse.json({ error: "密码长度至少为 6 位" }, { status: 400 });
  }

  const [user] = await db
    .update(adminUsers)
    .set({
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(password ? { password: await hashPassword(password) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, id))
    .returning();
  return NextResponse.json({ user: toPublicUser(user) });
}

/** 删除管理员（仅超级管理员） */
export async function DELETE(_request: Request, { params }: Params) {
  const current = await requireSuperUser();
  if (!current) {
    return NextResponse.json({ error: "无权限，仅系统管理员可访问" }, { status: 403 });
  }

  const { id } = await params;
  const [target] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  if (!target) {
    return NextResponse.json({ error: "管理员不存在" }, { status: 404 });
  }
  if (target.id === current.id) {
    return NextResponse.json({ error: "不能删除当前登录的账号" }, { status: 400 });
  }
  if (target.role === "super") {
    const activeSupers = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(and(eq(adminUsers.role, "super"), eq(adminUsers.status, "active")));
    const others = activeSupers.filter((u) => u.id !== target.id);
    if (others.length === 0) {
      return NextResponse.json({ error: "至少需要保留一名启用的系统管理员" }, { status: 400 });
    }
  }

  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  return NextResponse.json({ ok: true });
}
