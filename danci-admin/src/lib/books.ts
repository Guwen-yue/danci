import { request, type SimpleResult } from "@/lib/auth";

/** 单词书（对应 book 表，通过 bookId 与 words 表关联） */
export type WordBook = {
  id: string;
  title: string;
  wordCount: number;
  coverUrl: string | null;
  bookId: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookFormInput = {
  title: string;
  wordCount: number;
  coverUrl: string;
  bookId: string;
  tags: string;
};

/** 单词书列表 */
export async function listBooks(): Promise<WordBook[]> {
  const res = await request<{ books: WordBook[] }>("/api/books");
  return res.ok ? res.data.books : [];
}

/** 新建单词书 */
export async function createBookRequest(input: BookFormInput): Promise<SimpleResult> {
  const res = await request<{ book: WordBook }>("/api/books", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.ok ? { ok: true } : { ok: false, message: res.message };
}

/** 编辑单词书 */
export async function updateBookRequest(
  id: string,
  input: Partial<BookFormInput>
): Promise<SimpleResult> {
  const res = await request<{ book: WordBook }>(`/api/books/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return res.ok ? { ok: true } : { ok: false, message: res.message };
}

/** 删除单词书（同时删除 words 表中同 bookId 的所有单词） */
export async function removeBookRequest(
  id: string
): Promise<{ ok: true; deletedWords: number } | { ok: false; message: string }> {
  const res = await request<{ ok: true; deletedWords: number }>(`/api/books/${id}`, {
    method: "DELETE",
  });
  return res.ok
    ? { ok: true, deletedWords: res.data.deletedWords }
    : { ok: false, message: res.message };
}
