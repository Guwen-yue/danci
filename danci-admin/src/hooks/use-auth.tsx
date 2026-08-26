"use client"

import * as React from "react"
import { registerUser, signInUser, type AuthResult, type PublicUser } from "@/lib/auth"
import { updateCurrentEmail, useCurrentUser } from "@/lib/auth-store"

type SignInInput = { email: string; password: string }
type SignUpInput = { name: string; email: string; password: string }

type AuthContextValue = {
  user: PublicUser | null
  signin: (input: SignInInput) => AuthResult
  signup: (input: SignUpInput) => AuthResult
  signout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser()

  const signin = React.useCallback((input: SignInInput) => {
    const result = signInUser(input.email, input.password)
    if (result.ok) updateCurrentEmail(result.user.email)
    return result
  }, [])

  const signup = React.useCallback((input: SignUpInput) => {
    const result = registerUser(input)
    if (result.ok) updateCurrentEmail(result.user.email)
    return result
  }, [])

  const signout = React.useCallback(() => {
    updateCurrentEmail(null)
  }, [])

  const value = React.useMemo(
    () => ({ user, signin, signup, signout }),
    [user, signin, signup, signout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 内部使用")
  return ctx
}
