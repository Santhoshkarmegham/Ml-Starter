import { redirect } from 'next/navigation';
import { createClient } from './server';
import { isSupabaseConfigured } from './config';

export async function requireUser() {
  if (!isSupabaseConfigured()) redirect('/login?setup=1');
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect('/login');
  return {
    id: String(data.claims.sub),
    email: typeof data.claims.email === 'string' ? data.claims.email : 'Learner',
  };
}
