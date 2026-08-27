// 与 words.content 完整对应的类型（参考 design.md 5.2 节）

export type Sentence = { sContent: string; sCn: string };

export type TransItem = {
  tranCn: string;
  descOther?: string;
  descCn?: string;
  tranOther?: string;
};

export type SynoItem = {
  pos: string;
  tran: string;
  hwds: { w: string }[];
};

export type RelGroup = {
  pos: string;
  words: { hwd: string; tran: string }[];
};

export type WordContent = {
  sentence?: { sentences: Sentence[]; desc?: string };
  usphone?: string;
  ukphone?: string;
  /** 相对发音参数，如 "ruler&type=1"（英式） */
  ukspeech?: string;
  /** 相对发音参数，如 "ruler&type=2"（美式） */
  usspeech?: string;
  syno?: { synos: SynoItem[]; desc?: string };
  relWord?: { rels: RelGroup[]; desc?: string };
  remMethod?: { val: string; desc?: string };
  trans?: TransItem[];
};

export type Word = {
  id: number;
  wordRank: number;
  headWord: string;
  content: WordContent;
  bookId: string;
};

export type Book = {
  id: string;
  title: string;
  wordCount: number;
  coverUrl: string | null;
  bookId: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
};

/** 学习进度（已关联书名等信息后的展示形态） */
export type ProgressItem = {
  bookId: string;
  title: string;
  wordCount: number;
  lastWordRank: number;
  updatedAt: string;
};
