-- Live visitor tracking for the admin dashboard.
--
-- One row per browser session (written by src/components/VisitTracker.tsx),
-- not per page view, so "visitors" counts visitors.
--
-- Idempotent: every statement is safe to re-run.

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  session_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at);

alter table public.page_views enable row level security;

drop policy if exists "page_views_insert_public" on public.page_views;
create policy "page_views_insert_public"
  on public.page_views for insert
  to anon, authenticated
  with check (true);

drop policy if exists "page_views_select_admin_only" on public.page_views;
create policy "page_views_select_admin_only"
  on public.page_views for select
  to authenticated
  using (public.is_admin());

alter publication supabase_realtime add table public.page_views;
