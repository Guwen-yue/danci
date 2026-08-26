"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  React.useEffect(() => {
    router.replace(user ? "/books" : "/signin")
  }, [user, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">正在跳转...</p>
    </div>
  )
}
