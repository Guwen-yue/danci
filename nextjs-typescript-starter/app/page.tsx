import { listBooks } from 'app/db';
import HomeClient from 'app/components/home-client';

// 每次请求实时读取单词书数据（book/words 表由 danci-admin 维护，非静态数据）
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const books = await listBooks();
  return <HomeClient books={books} />;
}
