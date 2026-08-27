'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMockAuth } from 'app/lib/mock-auth';
import type { Word } from 'app/lib/types';
import WordCard from 'app/components/word-card';
import { CheckIcon, RefreshIcon } from 'app/components/icons';

export default function WordLearning({
  words,
  startRank,
}: {
  words: Word[];
  startRank: number;
}) {
  const router = useRouter();
  const { saveProgress, resetProgress } = useMockAuth();
  const [index, setIndex] = useState(() => startRank - 1);
  const [done, setDone] = useState(() => startRank > words.length);

  // 空书兜底
  if (words.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-ink-soft">这本书还没有单词</p>
        <Link href="/" className="text-sm font-semibold text-accent">
          返回首页
        </Link>
      </div>
    );
  }

  function handleNext() {
    const current = words[index];
    saveProgress(current.bookId, current.wordRank);
    if (index + 1 < words.length) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }

  function handleRestart() {
    const current = words[0];
    resetProgress(current.bookId);
    setIndex(0);
    setDone(false);
  }

  // 已完成态
  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center animate-fade-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal/10 text-teal">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">本书已学完</h2>
        <p className="mt-2 text-sm text-ink-soft">
          恭喜你，已学习全部 {words.length} 个单词
        </p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-[15px] font-semibold text-white shadow-accent transition active:scale-[0.98]"
          >
            <RefreshIcon className="h-5 w-5" />
            从头重新学习
          </button>
          <Link
            href="/"
            className="w-full rounded-full border border-line bg-card py-3.5 text-center text-[15px] font-semibold text-ink-soft transition active:scale-[0.98]"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const current = words[index];

  return (
    <>
      <div className="flex flex-1 flex-col px-5">
        <div className="flex flex-1 items-center">
          <div
            key={current.wordRank}
            className="w-full cursor-pointer animate-card-in"
            onClick={() => router.push(`/word/${current.bookId}/${current.wordRank}`)}
          >
            <WordCard word={current} />
            <p className="mt-5 rounded-full bg-accent-soft py-2 text-center text-[13px] font-medium text-accent-deep">
              点击卡片查看详细释义
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-2">
        <p className="text-center text-[13px] font-medium tabular-nums text-ink-faint">
          {index + 1} / {words.length}
        </p>
        <button
          type="button"
          onClick={handleNext}
          className="mt-3 w-full rounded-full bg-accent py-4 text-[15px] font-semibold text-white shadow-accent transition active:scale-[0.98]"
        >
          {index + 1 === words.length ? '完成本书' : '下一个'}
        </button>
      </div>
    </>
  );
}
