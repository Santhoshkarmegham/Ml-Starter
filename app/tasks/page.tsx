import CourseHeader from '../course-header';
import TaskWorkspace from './workspace';
import { requireUser } from '../../lib/supabase/current-user';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const user = await requireUser();
  return <><CourseHeader email={user.email} active="tasks"/><TaskWorkspace/></>;
}
