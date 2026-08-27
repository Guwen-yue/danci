'use client';

import { getBook, getWord } from 'app/lib/mock-data';
import { audioUrl, playAudio } from 'app/lib/audio';
import BackHeader from 'app/components/back-header';
import { PlayIcon } from 'app/components/icons';

function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section
      className="mt-4 rounded-3xl bg-card p-5 shadow-card animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-accent" />
        <h2 className="text-[15px] font-bold">{title}</h2>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function WordDetailPage({
  params,
}: {
  params: { bookId: string; wordRank: string };
}) {
  const book = getBook(params.bookId);
  const word = getWord(params.bookId, Number(params.wordRank));

  if (!book || !word) {
    return (
      <div className="flex min-h-dvh flex-col">
        <BackHeader title="单词详情" />
        <p className="flex flex-1 items-center justify-center text-ink-soft">
          单词不存在
        </p>
      </div>
    );
  }

  const c = word.content;
  const ukType = c.ukspeech ? 1 : undefined;
  const usType = c.usspeech ? 2 : undefined;

  return (
    <div className="min-h-dvh pb-10">
      <BackHeader title={book.title} />

      <main className="px-5">
        {/* 头部：单词 + 发音 + 释义 */}
        <section className="rounded-3xl bg-card px-6 pb-6 pt-8 text-center shadow-card animate-fade-up">
          <h1 className="font-display text-[40px] font-bold leading-tight tracking-tight">
            {word.headWord}
          </h1>

          {(ukType || usType) && (
            <div className="mt-4 flex items-center justify-center gap-3">
              {ukType && c.ukphone && (
                <button
                  type="button"
                  onClick={() => playAudio(audioUrl(word.headWord, ukType))}
                  className="flex items-center gap-1.5 rounded-full bg-paper px-3.5 py-2 text-[13px] text-ink-soft transition active:scale-95"
                >
                  <PlayIcon className="h-3.5 w-3.5 text-accent" />
                  英 {c.ukphone}
                </button>
              )}
              {usType && c.usphone && (
                <button
                  type="button"
                  onClick={() => playAudio(audioUrl(word.headWord, usType))}
                  className="flex items-center gap-1.5 rounded-full bg-paper px-3.5 py-2 text-[13px] text-ink-soft transition active:scale-95"
                >
                  <PlayIcon className="h-3.5 w-3.5 text-accent" />
                  美 {c.usphone}
                </button>
              )}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {c.trans?.map((t, i) => (
              <div key={i}>
                <p className="text-lg font-medium">{t.tranCn}</p>
                {t.tranOther && (
                  <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-ink-soft">
                    {t.tranOther}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 例句 */}
        {c.sentence?.sentences && c.sentence.sentences.length > 0 && (
          <Section title="例句" delay={0.06}>
            <div className="divide-y divide-line/70">
              {c.sentence.sentences.map((s, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-display text-[15px] italic text-ink">
                    {s.sContent}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-soft">{s.sCn}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 同近词 */}
        {c.syno?.synos && c.syno.synos.length > 0 && (
          <Section title="同近词" delay={0.12}>
            <div className="space-y-4">
              {c.syno.synos.map((s, i) => (
                <div key={i}>
                  <p className="text-[14px] leading-relaxed">
                    {s.pos && (
                      <span className="mr-1.5 inline-block rounded-md bg-accent-soft px-1.5 py-0.5 align-middle text-xs font-semibold text-accent-deep">
                        {s.pos}
                      </span>
                    )}
                    {s.tran}
                  </p>
                  {s.hwds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.hwds.map((h) => (
                        <span
                          key={h.w}
                          className="rounded-full border border-line bg-paper px-2.5 py-1 text-[13px] font-display italic text-ink-soft"
                        >
                          {h.w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 同根词 */}
        {c.relWord?.rels && c.relWord.rels.length > 0 && (
          <Section title="同根词" delay={0.18}>
            <div className="space-y-4">
              {c.relWord.rels.map((g, i) => (
                <div key={i}>
                  <span className="inline-block rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-semibold text-accent-deep">
                    {g.pos}
                  </span>
                  <ul className="mt-2 space-y-1.5">
                    {g.words.map((w) => (
                      <li key={w.hwd} className="text-[14px] leading-relaxed">
                        <span className="mr-1.5 font-semibold">{w.hwd}</span>
                        <span className="text-ink-soft">{w.tran}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 记忆方法 */}
        {c.remMethod?.val && (
          <Section title="记忆方法" delay={0.24}>
            <p className="rounded-2xl bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink-soft">
              {c.remMethod.val}
            </p>
          </Section>
        )}
      </main>
    </div>
  );
}
