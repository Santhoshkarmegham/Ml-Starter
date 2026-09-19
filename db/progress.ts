import { env } from 'cloudflare:workers';

export async function ensureProgressTable() {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed_at TEXT NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
  )`).run();
}

export async function getCompletedLessons(userId: string): Promise<string[]> {
  await ensureProgressTable();
  const result = await env.DB.prepare('SELECT lesson_id FROM lesson_progress WHERE user_id = ? ORDER BY completed_at ASC').bind(userId).all<{ lesson_id: string }>();
  return result.results.map((row) => row.lesson_id);
}

export async function setLessonCompleted(userId: string, lessonId: string, completed: boolean) {
  await ensureProgressTable();
  if (completed) {
    await env.DB.prepare(`INSERT INTO lesson_progress (user_id, lesson_id, completed_at)
      VALUES (?, ?, ?) ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed_at = excluded.completed_at`)
      .bind(userId, lessonId, new Date().toISOString()).run();
  } else {
    await env.DB.prepare('DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?').bind(userId, lessonId).run();
  }
}
