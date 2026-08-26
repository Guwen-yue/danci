import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { getSessionUser } from "@/lib/session";
import type { PublicUser } from "@/lib/types";

/** 管理员表中是否还没有任何数据（首次初始化） */
export async function getNeedsSetup(): Promise<boolean> {
  const rows = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  return rows.length === 0;
}

/** 校验是否已登录，未登录返回 null */
export async function requireUser(): Promise<PublicUser | null> {
  return getSessionUser();
}

/** 校验是否为超级管理员，否则返回 null */
export async function requireSuperUser(): Promise<PublicUser | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "super") return null;
  return user;
}
