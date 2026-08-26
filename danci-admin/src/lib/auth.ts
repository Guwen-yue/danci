export type AdminRole = "super" | "admin"

export type AdminUser = {
  id: string
  name: string
  email: string
  password: string
  role: AdminRole
  createdAt: string
}

export type PublicUser = {
  id: string
  name: string
  email: string
  role: AdminRole
  createdAt: string
}

const USERS_KEY = "danci_admin_users"
const CURRENT_KEY = "danci_admin_current"

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function toPublic(user: AdminUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

export function getUsers(): AdminUser[] {
  if (typeof window === "undefined") return []
  return safeParse<AdminUser[]>(window.localStorage.getItem(USERS_KEY), [])
}

export function saveUsers(users: AdminUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function setCurrentEmail(email: string | null) {
  if (email) {
    window.localStorage.setItem(CURRENT_KEY, email)
  } else {
    window.localStorage.removeItem(CURRENT_KEY)
  }
}

export function getPublicUsers(): PublicUser[] {
  return getUsers().map(toPublic)
}

export function getCurrentUser(): PublicUser | null {
  if (typeof window === "undefined") return null
  const email = window.localStorage.getItem(CURRENT_KEY)
  if (!email) return null
  const user = getUsers().find((u) => u.email === email)
  return user ? toPublic(user) : null
}

export type AuthResult = { ok: true; user: PublicUser } | { ok: false; message: string }

export function registerUser(input: {
  name: string
  email: string
  password: string
}): AuthResult {
  const users = getUsers()
  const email = input.email.trim().toLowerCase()
  if (users.some((u) => u.email === email)) {
    return { ok: false, message: "该邮箱已注册，请直接登录" }
  }
  const user: AdminUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    password: input.password,
    role: users.length === 0 ? "super" : "admin",
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, user])
  return { ok: true, user: toPublic(user) }
}

export function signInUser(email: string, password: string): AuthResult {
  const user = getUsers().find((u) => u.email === email.trim().toLowerCase())
  if (!user) return { ok: false, message: "该邮箱尚未注册，请先注册" }
  if (user.password !== password) return { ok: false, message: "密码错误，请重试" }
  return { ok: true, user: toPublic(user) }
}

export function deleteUser(id: string): { ok: true } | { ok: false; message: string } {
  const current = getCurrentUser()
  if (current?.id === id) {
    return { ok: false, message: "不能删除当前登录的管理员" }
  }
  const remaining = getUsers().filter((u) => u.id !== id)
  if (remaining.filter((u) => u.role === "super").length === 0) {
    return { ok: false, message: "至少需要保留一名超级管理员" }
  }
  saveUsers(remaining)
  return { ok: true }
}
