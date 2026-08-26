import type { AdminRole, PublicUser } from "@/lib/types";

export type { AdminRole, PublicUser };

export type AuthResult = { ok: true; user: PublicUser } | { ok: false; message: string };
export type SimpleResult = { ok: true } | { ok: false; message: string };

type ApiResponse<T> = { ok: true; data: T } | { ok: false; message: string };

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, message: data?.error ?? "请求失败，请稍后重试" };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, message: "网络异常，请稍后重试" };
  }
}

export type SessionStatus = { user: PublicUser | null; needsSetup: boolean };

/** 获取当前登录状态与是否首次初始化 */
export async function getSessionStatus(): Promise<SessionStatus> {
  const res = await request<SessionStatus>("/api/auth/session");
  return res.ok ? res.data : { user: null, needsSetup: false };
}

/** 登录 */
export async function signinRequest(email: string, password: string): Promise<AuthResult> {
  const res = await request<{ user: PublicUser }>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.ok ? { ok: true, user: res.data.user } : { ok: false, message: res.message };
}

/** 注册首个系统管理员 */
export async function signupRequest(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const res = await request<{ user: PublicUser }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.ok ? { ok: true, user: res.data.user } : { ok: false, message: res.message };
}

/** 退出登录 */
export async function signoutRequest(): Promise<void> {
  await request("/api/auth/signout", { method: "POST", body: JSON.stringify({}) });
}

export type AdminFormInput = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
};

/** 管理员列表 */
export async function listAdmins(): Promise<PublicUser[]> {
  const res = await request<{ users: PublicUser[] }>("/api/admin-users");
  return res.ok ? res.data.users : [];
}

/** 新建管理员 */
export async function createAdminRequest(input: AdminFormInput): Promise<SimpleResult> {
  const res = await request<{ user: PublicUser }>("/api/admin-users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.ok ? { ok: true } : { ok: false, message: res.message };
}

/** 编辑管理员 */
export async function updateAdminRequest(
  id: string,
  input: Partial<AdminFormInput>
): Promise<SimpleResult> {
  const res = await request<{ user: PublicUser }>(`/api/admin-users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return res.ok ? { ok: true } : { ok: false, message: res.message };
}

/** 删除管理员 */
export async function removeAdminRequest(id: string): Promise<SimpleResult> {
  const res = await request<{ ok: true }>(`/api/admin-users/${id}`, {
    method: "DELETE",
  });
  return res.ok ? { ok: true } : { ok: false, message: res.message };
}
