import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Next.js 开发模式下热更新会重复创建连接池，这里做全局单例缓存
const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof createDb>;
};

function createDb() {
  const client = postgres(connectionString, {
    max: 1,
    // 连接超时 15s，避免网络异常时挂起
    connect_timeout: 15,
    // 空闲连接 30s 后关闭
    idle_timeout: 30,
    // 单条 SQL 超过 10s 直接取消（连接级参数），防止慢查询占用唯一连接拖垮整个应用
    connection: { statement_timeout: 10000 },
  });
  return drizzle(client, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
