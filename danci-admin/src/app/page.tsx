"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const router = useRouter();
  const { user, needsSetup, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/books");
    } else {
      router.replace(needsSetup ? "/signup" : "/signin");
    }
  }, [user, needsSetup, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        正在跳转...
      </div>
    </div>
  )
}
