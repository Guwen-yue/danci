import type { Word } from 'app/lib/types';

/** 单词学习卡片（简洁版：单词 + 音标 + 中文释义 + 第一条例句） */
export default function WordCard({ word }: { word: Word }) {
  const c = word.content;
  const trans0 = c.trans?.[0];
  const sentence = c.sentence?.sentences?.[0];

  return (
    <div className="flex flex-col items-center rounded-3xl bg-card px-6 pb-8 pt-10 text-center shadow-card">
      <h2 className="font-display text-5xl font-bold tracking-tight text-ink">
        {word.headWord}
      </h2>

      {c.usphone && (
        <p className="mt-3 font-display text-sm italic text-ink-faint">
          {c.usphone}
        </p>
      )}

      {trans0 && (
        <p className="mt-5 text-lg font-medium text-ink">{trans0.tranCn}</p>
      )}

      {sentence && (
        <div className="mt-8 w-full rounded-2xl bg-paper px-5 py-4">
          <p className="font-display text-[15px] italic text-ink">{sentence.sContent}</p>
          <p className="mt-1.5 text-[13px] text-ink-soft">{sentence.sCn}</p>
        </div>
      )}
    </div>
  );
}
