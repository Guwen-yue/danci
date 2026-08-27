'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'app/components/icons';

export default function BackHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center bg-paper/90 px-1 backdrop-blur">
      <button
        type="button"
        onClick={() => router.back()}
        className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition active:scale-90"
        aria-label="返回"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <h1 className="flex-1 truncate pr-10 text-center text-[15px] font-semibold">
        {title}
      </h1>
    </header>
  );
}
