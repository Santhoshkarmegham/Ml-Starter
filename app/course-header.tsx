import Link from 'next/link';

export default function CourseHeader({ email, active }: { email: string; active: 'home' | 'learn' | 'tasks' }) {
  return <header className="topbar course-topbar">
    <Link className="brand" href="/">learn<span>flow</span>.</Link>
    <nav aria-label="Course navigation">
      <Link className={active === 'home' ? 'active' : ''} href="/">Path</Link>
      <Link className={active === 'learn' ? 'active' : ''} href="/learn">Learning</Link>
      <Link className={active === 'tasks' ? 'active' : ''} href="/tasks">Tasks</Link>
    </nav>
    <div className="signed-account"><div><strong>{email.split('@')[0]}</strong><small>{email}</small></div><form action="/auth/signout" method="post"><button type="submit">Sign out</button></form></div>
  </header>;
}
