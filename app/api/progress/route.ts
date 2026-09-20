import { lessonIds } from '../../curriculum';
import { createClient } from '../../../lib/supabase/server';

async function authenticatedUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  return { supabase, userId: typeof userId === 'string' ? userId : null };
}

export async function GET() {
  const { supabase, userId } = await authenticatedUser();
  if (!userId) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const { data, error } = await supabase.from('lesson_progress').select('lesson_id').order('completed_at');
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ completed: data.map((row) => row.lesson_id) });
}

export async function POST(request: Request) {
  const { supabase, userId } = await authenticatedUser();
  if (!userId) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const body = await request.json().catch(() => null) as { lessonId?: string; completed?: boolean } | null;
  if (!body || !body.lessonId || !lessonIds.includes(body.lessonId) || typeof body.completed !== 'boolean') {
    return Response.json({ error: 'Invalid progress update' }, { status: 400 });
  }
  const query = body.completed
    ? supabase.from('lesson_progress').upsert({ user_id: userId, lesson_id: body.lessonId, completed_at: new Date().toISOString() })
    : supabase.from('lesson_progress').delete().eq('lesson_id', body.lessonId);
  const { error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
