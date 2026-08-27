import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  bigint,
  integer,
  json,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * 管理员表
 * - role: super 系统管理员 / admin 普通管理员
 * - status: active 启用 / disabled 停用（停用后禁止登录）
 */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("admin"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * 管理员会话表
 * 用于保存登录状态，有效期 7 天
 */
export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  sessions: many(adminSessions),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  user: one(adminUsers, {
    fields: [adminSessions.userId],
    references: [adminUsers.id],
  }),
}));

/**
 * 单词表
 * 在 Supabase 后台手动创建，用于保存单词数据（如 temp/PEPXiaoXue3_1.json 转换后的内容）
 * 列名区分大小写（带引号），定义时需与原表完全一致
 */
export const words = pgTable("words", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  wordRank: integer("wordRank"),
  headWord: text("headWord"),
  content: json("content"),
  bookId: text("bookId"),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminUserInsert = typeof adminUsers.$inferInsert;
export type AdminSession = typeof adminSessions.$inferSelect;
export type Word = typeof words.$inferSelect;
export type WordInsert = typeof words.$inferInsert;
