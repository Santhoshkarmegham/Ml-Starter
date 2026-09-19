import { getChatGPTUser } from '../../chatgpt-auth';
import { lessonIds } from '../../curriculum';
import { getCompletedLessons, setLessonCompleted } from '../../../db/progress';

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  return Response.json({ completed: await getCompletedLessons(user.userId) });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const body = await request.json().catch(() => null) as { lessonId?: string; completed?: boolean } | null;
  if (!body || !body.lessonId || !lessonIds.includes(body.lessonId) || typeof body.completed !== 'boolean') {
    return Response.json({ error: 'Invalid progress update' }, { status: 400 });
  }
  await setLessonCompleted(user.userId, body.lessonId, body.completed);
  return Response.json({ ok: true });
}
