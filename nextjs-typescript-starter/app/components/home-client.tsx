'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMockAuth } from 'app/lib/mock-auth';
import BottomTabs from 'app/components/bottom-tabs';
import BookCard from 'app/components/book-card';
import RecentLearningCard from 'app/components/recent-learning-card';
import SectionTitle from 'app/components/section-title';
import { UserIcon } from 'app/components/icons';
import type { Book, ProgressItem } from 'app/lib/types';

/** 首页客户端交互部分：books 由服务端组件从数据库查询后传入 */
export default function HomeClient({ books }: { books: Book[] }) {
  const router = useRouter();
  const { user, progress } = useMockAuth();

  // 取最近更新的有进度记录（lastWordRank > 0）作为「最近学习」
  const recentProgress = user
    ? Object.values(progress)
        .filter((p) => p.lastWordRank > 0)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
    : undefined;

  const recentItem: ProgressItem | undefined = recentProgress
    ? (() => {
        const book = books.find((b) => b.bookId === recentProgress.bookId);
        if (!book) return undefined;
        return { ...recentProgress, title: book.title, wordCount: book.wordCount };
      })()
    : undefined;

  function handleBookClick(bookId: string) {
    if (user) {
      router.push(`/learn/${bookId}`);
    } else {
      // 未登录：切到「我的」并弹出登录弹窗，登录成功后自动进入该书
      router.push(`/me?login=1&book=${bookId}`);
    }
  }

  return (
    <div className="px-5 pb-32 pt-7">
      <header className="flex items-center justify-between animate-fade-up">
        <div>
          <p className="text-xs font-medium text-ink-faint">小学英语同步学习</p>
          <h1 className="mt-1 text-[26px] font-bold tracking-tight">单词学习</h1>
        </div>
        {user && (
          <Link
            href="/me"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-accent shadow-card transition active:scale-90"
            aria-label="我的"
          >
            <UserIcon className="h-6 w-6" />
          </Link>
        )}
      </header>

      {recentItem && (
        <section
          className="mt-7 animate-fade-up"
          style={{ animationDelay: '0.08s' }}
        >
          <SectionTitle>最近学习</SectionTitle>
          <div className="mt-3">
            <RecentLearningCard
              item={recentItem}
              index={books.findIndex((b) => b.bookId === recentItem.bookId)}
            />
          </div>
        </section>
      )}

      <section
        className="mt-8 animate-fade-up"
        style={{ animationDelay: recentItem ? '0.16s' : '0.08s' }}
      >
        <SectionTitle>全部单词书</SectionTitle>
        {books.length > 0 ? (
          <div className="mt-3 space-y-3">
            {books.map((book, i) => (
              <div key={book.bookId} style={{ animationDelay: `${0.1 + i * 0.05}s` }} className="animate-fade-up">
                <BookCard
                  book={book}
                  index={i}
                  onClick={() => handleBookClick(book.bookId)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-faint">暂无单词书</p>
        )}
      </section>

      <BottomTabs active="home" />
    </div>
  );
}
