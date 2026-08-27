import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { books, words } from "@/db/schema";
import { requireUser } from "@/lib/user";

type Params = { params: Promise<{ id: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function findBook(id: string) {
  if (!UUID_RE.test(id)) return null;
  const rows = await db.select().from(books).where(eq(books.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  const { id } = await params;
  const target = await findBook(id);
  if (!target) {
    return NextResponse.json({ error: "单词书不存在" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : undefined;
  const coverUrl = typeof body?.coverUrl === "string" ? body.coverUrl.trim() : undefined;
  const tags = typeof body?.tags === "string" ? body.tags.trim() : undefined;
  const bookId = typeof body?.bookId === "string" ? body.bookId.trim() : undefined;
  const wordCount =
    typeof body?.wordCount === "number" && Number.isFinite(body.wordCount)
      ? Math.max(0, Math.floor(body.wordCount))
      : undefined;

  if (title !== undefined && !title) {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }
  if (bookId !== undefined && !bookId) {
    return NextResponse.json({ error: "bookId 不能为空" }, { status: 400 });
  }

  // bookId 唯一性校验（排除自身）
  if (bookId !== undefined && bookId !== target.bookId) {
    const exists = await db
      .select({ id: books.id })
      .from(books)
      .where(eq(books.bookId, bookId))
      .limit(1);
    if (exists.length > 0) {
      return NextResponse.json({ error: `bookId「${bookId}」已存在` }, { status: 409 });
    }
  }

  const [book] = await db
    .update(books)
    .set({
      ...(title !== undefined ? { title } : {}),
      ...(coverUrl !== undefined ? { coverUrl } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(bookId !== undefined ? { bookId } : {}),
      ...(wordCount !== undefined ? { wordCount } : {}),
      updatedAt: new Date(),
    })
    .where(eq(books.id, id))
    .returning();
  return NextResponse.json({ book });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  const { id } = await params;
  const target = await findBook(id);
  if (!target) {
    return NextResponse.json({ error: "单词书不存在" }, { status: 404 });
  }
  // 事务删除：先删 words 表中同 bookId 的所有单词，再删单词书
  const deletedWords = await db.transaction(async (tx) => {
    const rows = await tx
      .delete(words)
      .where(eq(words.bookId, target.bookId))
      .returning({ id: words.id });
    await tx.delete(books).where(eq(books.id, id));
    return rows.length;
  });
  return NextResponse.json({ ok: true, deletedWords });
}
