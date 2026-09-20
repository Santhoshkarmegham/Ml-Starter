create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  due_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_created_idx on public.tasks (user_id, created_at desc);

alter table public.lesson_progress enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Users select their own progress" on public.lesson_progress;
drop policy if exists "Users insert their own progress" on public.lesson_progress;
drop policy if exists "Users update their own progress" on public.lesson_progress;
drop policy if exists "Users delete their own progress" on public.lesson_progress;
create policy "Users select their own progress" on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert their own progress" on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update their own progress" on public.lesson_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete their own progress" on public.lesson_progress for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users select their own tasks" on public.tasks;
drop policy if exists "Users insert their own tasks" on public.tasks;
drop policy if exists "Users update their own tasks" on public.tasks;
drop policy if exists "Users delete their own tasks" on public.tasks;
create policy "Users select their own tasks" on public.tasks for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert their own tasks" on public.tasks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update their own tasks" on public.tasks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete their own tasks" on public.tasks for delete to authenticated using ((select auth.uid()) = user_id);
