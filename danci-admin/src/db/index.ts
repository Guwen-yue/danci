import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Next.js 开发模式下热更新会重复创建连接池，这里做全局单例缓存
const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof createDb>;
};

function createDb() {
  const client = postgres(connectionString, { max: 1 });
  return drizzle(client, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
