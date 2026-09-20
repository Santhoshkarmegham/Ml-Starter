import { redirect } from 'next/navigation';
import LearningApp from './learning-app';
import { createClient } from '../lib/supabase/server';
import { isSupabaseConfigured } from '../lib/supabase/config';

export const dynamic = 'force-dynamic';

export default async function Home() {
  if (!isSupabaseConfigured()) redirect('/login?setup=1');
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect('/login');
  const email = typeof data.claims.email === 'string' ? data.claims.email : 'Learner';
  return <LearningApp email={email} />;
}
