'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from 'app/lib/mock-auth';
import { getBook, getWords } from 'app/lib/mock-data';
import BackHeader from 'app/components/back-header';
import WordLearning from 'app/components/word-learning';

export default function LearnPage({ params }: { params: { bookId: string } }) {
  const router = useRouter();
  const { user, progress } = useMockAuth();

  const book = getBook(params.bookId);
  const words = getWords(params.bookId);

  // 未登录：跳转到「我的」登录弹窗，登录成功后回到本书
  useEffect(() => {
    if (!user) {
      router.replace(`/me?login=1&book=${params.bookId}`);
    }
  }, [user, params.bookId, router]);

  if (!user) return null;

  // 断点续学：从 lastWordRank + 1 开始；无记录则从第 1 个开始
  const lastRank = progress[params.bookId]?.lastWordRank ?? 0;
  const startRank = lastRank + 1;

  return (
    <div className="flex min-h-dvh flex-col">
      <BackHeader title={book?.title ?? '单词学习'} />
      <div className="flex flex-1 flex-col">
        {book ? (
          <WordLearning words={words} startRank={startRank} />
        ) : (
          <p className="flex flex-1 items-center justify-center text-ink-soft">
            单词书不存在
          </p>
        )}
      </div>
    </div>
  );
}
