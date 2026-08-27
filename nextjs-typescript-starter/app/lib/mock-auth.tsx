'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type MockUser = { id: number; email: string };

export type MockProgress = {
  bookId: string;
  lastWordRank: number;
  updatedAt: string;
};

type LoginResult = { ok: boolean; error?: string };

type MockAuthValue = {
  /** 是否已从 localStorage 恢复状态（避免首帧闪烁） */
  hydrated: boolean;
  user: MockUser | null;
  login: (email: string, password: string) => LoginResult;
  register: (email: string, password: string) => LoginResult;
  logout: () => void;
  /** bookId -> 进度 */
  progress: Record<string, MockProgress>;
  saveProgress: (bookId: string, lastWordRank: number) => void;
  resetProgress: (bookId: string) => void;
};

const MockAuthContext = createContext<MockAuthValue | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 忽略存储失败
  }
}

/** 首次登录/注册时预置两条进度，便于演示「最近学习」与「我的-进度列表」两种状态 */
function seedProgress(): Record<string, MockProgress> {
  const now = new Date().toISOString();
  return {
    PEPXiaoXue3_1: { bookId: 'PEPXiaoXue3_1', lastWordRank: 3, updatedAt: now },
    PEPXiaoXue3_2: { bookId: 'PEPXiaoXue3_2', lastWordRank: 0, updatedAt: now },
  };
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);
  const [progress, setProgress] = useState<Record<string, MockProgress>>({});

  // 挂载后从 localStorage 恢复，避免 SSR/首帧 hydration 不一致
  useEffect(() => {
    setUser(readStorage<MockUser | null>('mock_user', null));
    setProgress(readStorage<Record<string, MockProgress>>('mock_progress', {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage('mock_progress', progress);
  }, [progress, hydrated]);

  const applyLogin = useCallback((email: string) => {
    const nextUser: MockUser = { id: 1, email };
    setUser(nextUser);
    writeStorage('mock_user', nextUser);
    // 无任何进度时预置演示数据（由下方 effect 负责持久化）
    setProgress((prev) => (Object.keys(prev).length > 0 ? prev : seedProgress()));
  }, []);

  const login = useCallback(
    (email: string, password: string): LoginResult => {
      const mail = email.trim();
      if (!EMAIL_RE.test(mail) || password.length < 6) {
        return { ok: false, error: '邮箱或密码错误' };
      }
      applyLogin(mail);
      return { ok: true };
    },
    [applyLogin]
  );

  const register = useCallback(
    (email: string, password: string): LoginResult => {
      const mail = email.trim();
      if (!EMAIL_RE.test(mail)) return { ok: false, error: '请输入正确的邮箱' };
      if (password.length < 6) return { ok: false, error: '密码至少 6 位' };
      const existing = readStorage<string[]>('mock_users', []);
      if (existing.includes(mail)) return { ok: false, error: '该邮箱已注册' };
      writeStorage('mock_users', [...existing, mail]);
      applyLogin(mail);
      return { ok: true };
    },
    [applyLogin]
  );

  const logout = useCallback(() => {
    setUser(null);
    writeStorage('mock_user', null);
  }, []);

  const saveProgress = useCallback((bookId: string, lastWordRank: number) => {
    setProgress((prev) => ({
      ...prev,
      [bookId]: { bookId, lastWordRank, updatedAt: new Date().toISOString() },
    }));
  }, []);

  const resetProgress = useCallback((bookId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });
  }, []);

  const value = useMemo<MockAuthValue>(
    () => ({
      hydrated,
      user,
      login,
      register,
      logout,
      progress,
      saveProgress,
      resetProgress,
    }),
    [hydrated, user, login, register, logout, progress, saveProgress, resetProgress]
  );

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth() {
  const ctx = useContext(MockAuthContext);
  if (!ctx) throw new Error('useMockAuth 必须在 MockAuthProvider 内使用');
  return ctx;
}
