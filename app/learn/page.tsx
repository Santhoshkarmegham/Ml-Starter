import CourseHeader from '../course-header';
import LearnWorkspace from './workspace';
import { requireUser } from '../../lib/supabase/current-user';

export const dynamic = 'force-dynamic';

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ lesson?: string }> }) {
  const user = await requireUser();
  const { lesson } = await searchParams;
  return <><CourseHeader email={user.email} active="learn"/><LearnWorkspace initialLessonId={lesson}/></>;
}
