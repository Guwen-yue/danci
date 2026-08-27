'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from 'app/lib/mock-auth';
import { CloseIcon } from 'app/components/icons';

type Mode = 'login' | 'register';

export default function LoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { login, register } = useMockAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = mode === 'login' ? login(email, password) : register(email, password);
    if (!result.ok) {
      setError(result.error ?? '操作失败，请重试');
      return;
    }
    // 登录成功：若有待学习书本参数则直接进入，否则留在「我的」
    const params = new URLSearchParams(window.location.search);
    const book = params.get('book');
    onClose();
    if (book) {
      router.push(`/learn/${book}`);
    } else {
      router.replace('/me');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-6 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-float animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{mode === 'login' ? '登录' : '注册'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition active:scale-90"
            aria-label="关闭"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-xs text-ink-faint">
          {mode === 'login' ? '登录后记录你的学习进度' : '注册后即可开始单词学习'}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[13px] font-medium text-ink-soft">邮箱</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              autoComplete="email"
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="block">
            <span className="text-[13px] font-medium text-ink-soft">密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少 6 位）"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] outline-none transition placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-[13px] text-accent-deep">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-accent py-3.5 text-[15px] font-semibold text-white shadow-accent transition active:scale-[0.98]"
          >
            {mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] text-ink-soft">
          {mode === 'login' ? '没有账号？' : '已有账号？'}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="ml-1 font-semibold text-accent"
          >
            {mode === 'login' ? '去注册' : '去登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
