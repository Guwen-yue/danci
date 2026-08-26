export type WordBookStatus = "active" | "disabled"

export type WordBook = {
  id: string
  name: string
  description: string
  category: string
  wordCount: number
  status: WordBookStatus
  createdAt: string
  updatedAt: string
}

const BOOKS_KEY = "danci_admin_books"

const DEFAULT_BOOKS: WordBook[] = [
  {
    id: "b1",
    name: "四级核心词汇",
    description: "大学英语四级高频核心词汇，覆盖历年真题考点",
    category: "四级",
    wordCount: 2800,
    status: "active",
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-08-01T08:00:00.000Z",
  },
  {
    id: "b2",
    name: "六级核心词汇",
    description: "大学英语六级高频核心词汇，含易混淆词辨析",
    category: "六级",
    wordCount: 3200,
    status: "active",
    createdAt: "2026-01-12T08:00:00.000Z",
    updatedAt: "2026-07-28T08:00:00.000Z",
  },
  {
    id: "b3",
    name: "考研英语词汇",
    description: "考研英语大纲词汇，按词频科学分组记忆",
    category: "考研",
    wordCount: 5500,
    status: "active",
    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-07-20T08:00:00.000Z",
  },
  {
    id: "b4",
    name: "雅思核心词汇",
    description: "雅思听说读写高频词汇，配套真题例句",
    category: "雅思",
    wordCount: 3600,
    status: "disabled",
    createdAt: "2026-03-05T08:00:00.000Z",
    updatedAt: "2026-06-30T08:00:00.000Z",
  },
  {
    id: "b5",
    name: "托福高频词汇",
    description: "托福考试高频词汇，按学科场景分类",
    category: "托福",
    wordCount: 4000,
    status: "disabled",
    createdAt: "2026-04-15T08:00:00.000Z",
    updatedAt: "2026-06-18T08:00:00.000Z",
  },
  {
    id: "b6",
    name: "中考英语词汇",
    description: "中考英语必备词汇，按教材版本收录",
    category: "中考",
    wordCount: 1600,
    status: "active",
    createdAt: "2026-05-20T08:00:00.000Z",
    updatedAt: "2026-08-10T08:00:00.000Z",
  },
]

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getBooks(): WordBook[] {
  if (typeof window === "undefined") return []
  return safeParse<WordBook[]>(window.localStorage.getItem(BOOKS_KEY), DEFAULT_BOOKS)
}

export function saveBooks(books: WordBook[]) {
  window.localStorage.setItem(BOOKS_KEY, JSON.stringify(books))
}
