import type { Book } from 'app/lib/types';
import BookCover from 'app/components/book-cover';
import { BookIcon, ChevronRightIcon } from 'app/components/icons';

export default function BookCard({
  book,
  index,
  onClick,
}: {
  book: Book;
  index: number;
  onClick: () => void;
}) {
  const tags = book.tags ? book.tags.split(',').filter(Boolean) : [];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-2xl bg-card p-3 text-left shadow-card transition active:scale-[0.98]"
    >
      <BookCover title={book.title} index={index} className="h-16 w-16" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold">{book.title}</h3>
        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-ink-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="mt-2 flex items-center gap-1 text-xs text-ink-faint">
          <BookIcon className="h-3.5 w-3.5" />
          {book.wordCount} 词
        </p>
      </div>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-faint" />
    </button>
  );
}
