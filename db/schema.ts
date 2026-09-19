import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const lessonProgress = sqliteTable('lesson_progress', {
  userId: text('user_id').notNull(),
  lessonId: text('lesson_id').notNull(),
  completedAt: text('completed_at').notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.lessonId] })]);
