"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SidebarContent } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdminUsersPage = pathname.startsWith("/admin-users");

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/signin");
    } else if (isAdminUsersPage && user.role !== "super") {
      // 普通管理员无权访问管理员管理
      router.replace("/books");
    }
  }, [user, loading, isAdminUsersPage, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAdminUsersPage && user.role !== "super") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar md:flex">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <Menu />
            <span className="sr-only">打开菜单</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 sm:max-w-[16rem]">
            <SheetTitle className="sr-only">导航菜单</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-semibold">单词管理后台</span>
      </header>

      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-6xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
