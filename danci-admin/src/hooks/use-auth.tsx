"use client";

import * as React from "react";
import {
  getSessionStatus,
  signinRequest,
  signoutRequest,
  signupRequest,
  type AuthResult,
} from "@/lib/auth";
import type { PublicUser } from "@/lib/types";

type AuthContextValue = {
  user: PublicUser | null;
  /** 管理员表中是否还没有数据（首次初始化） */
  needsSetup: boolean;
  /** 初始会话状态是否仍在加载 */
  loading: boolean;
  signin: (email: string, password: string) => Promise<AuthResult>;
  signup: (input: { name: string; email: string; password: string }) => Promise<AuthResult>;
  signout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<PublicUser | null>(null);
  const [needsSetup, setNeedsSetup] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    getSessionStatus().then((status) => {
      if (cancelled) return;
      setUser(status.user);
      setNeedsSetup(status.needsSetup);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signin = React.useCallback(async (email: string, password: string) => {
    const result = await signinRequest(email, password);
    if (result.ok) {
      setUser(result.user);
      setNeedsSetup(false);
    }
    return result;
  }, []);

  const signup = React.useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const result = await signupRequest(input);
      if (result.ok) {
        setUser(result.user);
        setNeedsSetup(false);
      }
      return result;
    },
    []
  );

  const signout = React.useCallback(async () => {
    await signoutRequest();
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, needsSetup, loading, signin, signup, signout }),
    [user, needsSetup, loading, signin, signup, signout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 内部使用");
  return ctx;
}
