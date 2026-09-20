'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn, signUp, type AuthState } from './auth/actions';

export default function AuthForm({ mode, setup = false, confirmationError = false }: { mode: 'signin' | 'signup'; setup?: boolean; confirmationError?: boolean }) {
  const action = mode === 'signin' ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});
  return <main className="auth-page">
    <section className="auth-panel">
      <a className="brand" href="/">learn<span>flow</span>.</a>
      <div className="auth-copy"><span className="kicker">Personal learning tracker</span><h1>{mode === 'signin' ? 'Welcome back.' : 'Create your account.'}</h1><p>{mode === 'signin' ? 'Sign in with the account you already created. This form never creates a new account.' : 'Create one private account to save your lessons and progress.'}</p></div>
      {setup && <div className="auth-notice">Supabase is not connected yet. Add the two values from <code>.env.example</code> to <code>.env.local</code>.</div>}
      {confirmationError && <div className="auth-error">The confirmation link is invalid or expired. Please sign up again.</div>}
      <form action={formAction} className="auth-form">
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label>Password<input name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required /></label>
        {mode === 'signup' && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label>}
        {state.error && <p className="auth-error" role="alert">{state.error}</p>}
        {state.success && <p className="auth-success" role="status">{state.success}</p>}
        <button className="auth-submit" disabled={pending}>{pending ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}<span>→</span></button>
      </form>
      <p className="auth-switch">{mode === 'signin' ? <>No account yet? <Link href="/signup">Create one</Link></> : <>Already have an account? <Link href="/login">Sign in</Link></>}</p>
    </section>
    <aside className="auth-art"><span>Learn.</span><span>Practice.</span><span>Progress.</span><p>Your machine learning path, saved securely.</p></aside>
  </main>;
}
