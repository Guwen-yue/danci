"use client"

import * as React from "react"
import { getCurrentUser, setCurrentEmail, type PublicUser } from "@/lib/auth"

const listeners = new Set<() => void>()

let cachedUser: PublicUser | null = null
let cachedKey = ""

function readUser(): PublicUser | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem("danci_admin_users")
  const email = window.localStorage.getItem("danci_admin_current")
  const key = `${raw}|${email}`
  if (key !== cachedKey) {
    cachedKey = key
    cachedUser = getCurrentUser()
  }
  return cachedUser
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useCurrentUser(): PublicUser | null {
  return React.useSyncExternalStore(subscribe, readUser, () => null)
}

export function updateCurrentEmail(email: string | null) {
  setCurrentEmail(email)
  listeners.forEach((listener) => listener())
}
