import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { books } from "@/db/schema";
import { requireUser } from "@/lib/user";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }
  const list = await db.select().from(books).orderBy(desc(books.createdAt));
  return NextResponse.json({ books: list });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const bookId = typeof body?.bookId === "string" ? body.bookId.trim() : "";
  const coverUrl = typeof body?.coverUrl === "string" ? body.coverUrl.trim() : "";
  const tags = typeof body?.tags === "string" ? body.tags.trim() : "";
  const wordCount =
    typeof body?.wordCount === "number" && Number.isFinite(body.wordCount)
      ? Math.max(0, Math.floor(body.wordCount))
      : 0;

  if (!title) {
    return NextResponse.json({ error: "请输入标题" }, { status: 400 });
  }
  if (!bookId) {
    return NextResponse.json({ error: "请输入 bookId" }, { status: 400 });
  }

  // bookId 唯一性校验
  const exists = await db.select({ id: books.id }).from(books).where(eq(books.bookId, bookId)).limit(1);
  if (exists.length > 0) {
    return NextResponse.json({ error: `bookId「${bookId}」已存在` }, { status: 409 });
  }

  const [book] = await db
    .insert(books)
    .values({ title, bookId, coverUrl, tags, wordCount })
    .returning();
  return NextResponse.json({ book }, { status: 201 });
}
