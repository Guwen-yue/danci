'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from 'app/lib/mock-auth';
import { MOCK_BOOKS, getBook } from 'app/lib/mock-data';
import BottomTabs from 'app/components/bottom-tabs';
import LoginDialog from 'app/components/login-dialog';
import ProgressBar from 'app/components/progress-bar';
import SectionTitle from 'app/components/section-title';
import { UserIcon } from 'app/components/icons';

export default function MePage() {
  const router = useRouter();
  const { user, progress, logout } = useMockAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  // ?login=1 时自动弹出登录弹窗
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('login')) setDialogOpen(true);
  }, []);

  function closeDialog() {
    setDialogOpen(false);
    // 清除 ?login 参数，避免重复弹出
    router.replace('/me');
  }

  const progressList = Object.values(progress)
    .map((p) => {
      const book = getBook(p.bookId);
      return book ? { ...p, title: book.title, wordCount: book.wordCount } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const totalLearned = progressList.reduce((sum, p) => sum + p.lastWordRank, 0);
  const totalWords = progressList.reduce((sum, p) => sum + p.wordCount, 0);

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-32 pt-10">
      {/* 用户信息区 */}
      <div className="flex items-center gap-4 animate-fade-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-accent shadow-card">
          <UserIcon className="h-8 w-8" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-ink-faint">
            {user ? '已登录' : '未登录'}
          </p>
          <p className="mt-0.5 truncate text-lg font-bold">
            {user ? user.email : '登录后记录你的学习进度'}
          </p>
        </div>
      </div>

      {!user ? (
        <div className="mt-8 animate-fade-up" style={{ animationDelay: '0.08s' }}>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="w-full rounded-full bg-accent py-3.5 text-[15px] font-semibold text-white shadow-accent transition active:scale-[0.98]"
          >
            去登录
          </button>
        </div>
      ) : (
        <>
          {/* 学习进度区 */}
          <section className="mt-8 animate-fade-up" style={{ animationDelay: '0.08s' }}>
            <SectionTitle>学习进度</SectionTitle>

            {progressList.length === 0 ? (
              <p className="mt-4 rounded-2xl bg-card px-5 py-8 text-center text-sm text-ink-faint shadow-card">
                暂无学习记录，去首页选一本书开始吧
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {progressList.map((p) => {
                  const pct =
                    p.wordCount > 0
                      ? Math.min(100, Math.round((p.lastWordRank / p.wordCount) * 100))
                      : 0;
                  return (
                    <div key={p.bookId} className="rounded-2xl bg-card p-4 shadow-card">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-[15px] font-semibold">{p.title}</h3>
                        <span className="shrink-0 text-xs tabular-nums text-ink-faint">
                          {p.lastWordRank}/{p.wordCount} · {pct}%
                        </span>
                      </div>
                      <ProgressBar
                        value={p.lastWordRank}
                        max={p.wordCount}
                        className="mt-3"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 总体统计 */}
          <section className="mt-5 animate-fade-up" style={{ animationDelay: '0.14s' }}>
            <div className="flex items-center justify-between rounded-2xl bg-card px-5 py-4 shadow-card">
              <span className="text-[13px] text-ink-soft">累计已学单词</span>
              <span className="text-[15px] font-bold tabular-nums">
                {totalLearned} / {totalWords}
              </span>
            </div>
          </section>

          {/* 退出登录 */}
          <section className="mt-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl border border-line bg-card py-3.5 text-[15px] font-medium text-ink-soft transition active:scale-[0.98]"
            >
              退出登录
            </button>
          </section>
        </>
      )}

      <BottomTabs active="me" />
      <LoginDialog open={dialogOpen} onClose={closeDialog} />
    </div>
  );
}
