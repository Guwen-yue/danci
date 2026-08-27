import Link from 'next/link';
import type { ProgressItem } from 'app/lib/types';
import BookCover from 'app/components/book-cover';
import ProgressBar from 'app/components/progress-bar';
import { ChevronRightIcon } from 'app/components/icons';

export default function RecentLearningCard({
  item,
  index,
}: {
  item: ProgressItem;
  index: number;
}) {
  const pct = item.wordCount > 0
    ? Math.min(100, Math.round((item.lastWordRank / item.wordCount) * 100))
    : 0;

  return (
    <Link
      href={`/learn/${item.bookId}`}
      className="block rounded-2xl bg-card p-4 shadow-card transition active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <BookCover title={item.title} index={index} className="h-20 w-20" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
            最近学习
          </p>
          <h3 className="mt-1 truncate text-base font-semibold">{item.title}</h3>
          <p className="mt-2 text-xs text-ink-soft">
            已学 {item.lastWordRank} / {item.wordCount} 词 · {pct}%
          </p>
          <ProgressBar value={item.lastWordRank} max={item.wordCount} className="mt-2" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-0.5 text-[13px] font-medium text-accent">
        继续学习
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </Link>
  );
}
