"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookMarked, BookOpen, LogOut, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: "/books", label: "单词书管理", icon: BookOpen },
  { href: "/admin-users", label: "管理员管理", icon: Users },
]

export function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signout } = useAuth()

  function handleSignout() {
    signout()
    toast.success("已退出登录")
    router.replace("/signin")
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BookMarked className="size-4" />
        </div>
        <span className="text-sm font-semibold">单词管理后台</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-2">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback>{user?.name?.charAt(0) ?? "管"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleSignout}
            aria-label="退出登录"
            title="退出登录"
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </div>
  )
}
