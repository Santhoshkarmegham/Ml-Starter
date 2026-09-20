'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { isSupabaseConfigured } from '../../lib/supabase/config';

export type AuthState = { error?: string; success?: string };

function credentials(formData: FormData) {
  return {
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    password: String(formData.get('password') ?? ''),
  };
}

export async function signIn(_state: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: 'Connect Supabase first using .env.local.' };
  const { email, password } = credentials(formData);
  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'No matching account was found, or the password is incorrect.' };
  redirect('/');
}

export async function signUp(_state: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { error: 'Connect Supabase first using .env.local.' };
  const { email, password } = credentials(formData);
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };
  if (password.length < 8) return { error: 'Use at least 8 characters for your password.' };
  if (password !== confirmPassword) return { error: 'The passwords do not match.' };

  const origin = (await headers()).get('origin') ?? 'http://localhost:3000';
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: error.message };
  if (data.session) redirect('/');
  return { success: 'Account created. Check your email to confirm it before signing in.' };
}
