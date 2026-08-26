import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

/** 退出登录：销毁会话并清除 cookie */
export async function POST() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
