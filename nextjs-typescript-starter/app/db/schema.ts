import {
  pgTable,
  serial,
  varchar,
  integer,
  bigint,
  text,
  json,
  uuid,
  timestamp,
  unique,
  index,
} from 'drizzle-orm/pg-core';

/**
 * 用户表（H5 自有）
 * 表名带引号、大小写敏感，与现有 app/db.ts 动态建表保持一致
 */
export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 64 }),
  password: varchar('password', { length: 64 }),
});

/**
 * 单词书表（复用 danci-admin 的表，H5 只读）
 */
export const books = pgTable('book', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  wordCount: integer('word_count').notNull().default(0),
  coverUrl: text('cover_url'),
  bookId: text('book_id').notNull().unique(),
  /** 标签，逗号分隔存储，如：小学,人教版,三年级 */
  tags: text('tags'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

/**
 * 单词表（复用 danci-admin 的表，H5 只读）
 * 列名大小写敏感（带引号），与现有表严格一致
 */
export const words = pgTable('words', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  wordRank: integer('wordRank'),
  headWord: text('headWord'),
  content: json('content'),
  bookId: text('bookId'),
});

/**
 * 学习进度表（H5 新增）
 * 一用户一书一行（unique(user_id, book_id)），进度采用 upsert
 */
export const learningProgress = pgTable(
  'learning_progress',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bookId: text('book_id')
      .notNull()
      .references(() => books.bookId, { onDelete: 'cascade' }),
    /** 最近学到的词序号（0 表示未开始） */
    lastWordRank: integer('last_word_rank').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userBookUnique: unique('learning_progress_user_book_unique').on(t.userId, t.bookId),
    userIdx: index('learning_progress_user_idx').on(t.userId),
  })
);

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type Book = typeof books.$inferSelect;
export type Word = typeof words.$inferSelect;
export type LearningProgress = typeof learningProgress.$inferSelect;
export type LearningProgressInsert = typeof learningProgress.$inferInsert;
