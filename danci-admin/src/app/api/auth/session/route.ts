import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getNeedsSetup } from "@/lib/user";

/** 获取当前会话状态：登录用户 + 是否需要首次初始化 */
export async function GET() {
  const user = await getSessionUser();
  const needsSetup = await getNeedsSetup();
  return NextResponse.json({ user, needsSetup });
}
