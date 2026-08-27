const COVER_GRADIENTS = [
  { from: '#2E9E8F', to: '#1D6E61' }, // 青绿
  { from: '#E4572E', to: '#AE3A18' }, // 朱红
  { from: '#4A6FA5', to: '#2E4770' }, // 靛蓝
  { from: '#8A5A9E', to: '#5C3A70' }, // 紫
];

/** 从书名提取简短年级，如「三年级上」->「三上」 */
function shortLevel(title: string): string {
  const m = title.match(/([一二三四五六]\d?)年级([上下])/);
  if (m) return `${m[1]}${m[2]}`;
  return title.slice(0, 2);
}

export default function BookCover({
  title,
  index,
  className = 'h-16 w-16',
}: {
  title: string;
  index: number;
  className?: string;
}) {
  const { from, to } = COVER_GRADIENTS[index % COVER_GRADIENTS.length];
  const level = shortLevel(title);

  return (
    <div
      className={`relative flex shrink-0 flex-col justify-between overflow-hidden rounded-xl p-2 ${className}`}
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {/* 装饰圆 */}
      <span className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/10" />
      <span className="absolute -bottom-4 -left-2 h-10 w-10 rounded-full bg-white/5" />
      <span className="relative text-[10px] font-bold uppercase tracking-widest text-white/85">
        PEP
      </span>
      <span className="relative text-[13px] font-bold leading-tight text-white">
        {level}
      </span>
    </div>
  );
}
