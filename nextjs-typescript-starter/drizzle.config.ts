import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  // 仅迁移 H5 自有的表；book / words 由 danci-admin 维护，已在库中存在
  tablesFilter: ['User', 'learning_progress'],
  // 迁移记录表独立命名，避免与 danci-admin（共享同一数据库）的 __drizzle_migrations 冲突
  migrations: {
    table: '__drizzle_h5_migrations',
  },
});
