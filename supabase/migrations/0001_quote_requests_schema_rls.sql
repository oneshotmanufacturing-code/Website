-- OneShot Manufacturing — fix quote_requests schema + RLS, add quote
-- attachments storage, add service_notifications.
--
-- Why: submitting a quote throws PGRST204 "customer_id column not found" —
-- quote_requests never had this column, so quote submissions have silently
-- failed since before this rewrite (old code fell back to a mailto draft on
-- any insert error, which is why nobody noticed). /portal/quotes also
-- filters on customer_id and has therefore never been able to return rows.
--
-- Idempotent: every statement is safe to re-run.

-- ── quote_requests: add whatever's missing ─────────────────────────────
alter table public.quote_requests
  add column if not exists customer_id uuid references auth.users(id) on delete set null,
  add column if not exists specs jsonb,
  add column if not exists admin_notes text,
  add column if not exists gstin text,
  add column if not exists quantity integer,
  add column if not exists design_file_url text,
  add column if not exists status text default 'new';

create index if not exists quote_requests_customer_id_idx
  on public.quote_requests (customer_id);

-- ── Helper: is the calling user an admin? ───────────────────────────────
-- Mirrors the app-layer role check (profiles.role = 'admin'), NOT the
-- email-substring "owner" hack in middleware.ts / admin/layout.tsx — that
-- shortcut is app-layer convenience only and has no place in a DB policy.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── quote_requests RLS ───────────────────────────────────────────────────
alter table public.quote_requests enable row level security;

drop policy if exists "quote_requests_insert_public" on public.quote_requests;
create policy "quote_requests_insert_public"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quote_requests_select_own_or_admin" on public.quote_requests;
create policy "quote_requests_select_own_or_admin"
  on public.quote_requests for select
  to authenticated
  using (customer_id = auth.uid() or public.is_admin());

drop policy if exists "quote_requests_update_admin_only" on public.quote_requests;
create policy "quote_requests_update_admin_only"
  on public.quote_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Storage: private bucket for quote attachments ───────────────────────
insert into storage.buckets (id, name, public)
values ('quote_attachments', 'quote_attachments', false)
on conflict (id) do nothing;

drop policy if exists "quote_attachments_insert_public" on storage.objects;
create policy "quote_attachments_insert_public"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'quote_attachments');

drop policy if exists "quote_attachments_select_admin_only" on storage.objects;
create policy "quote_attachments_select_admin_only"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'quote_attachments' and public.is_admin());

-- ── service_notifications: "notify me" signups (e.g. CNC coming soon) ──
create table if not exists public.service_notifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  service text not null,
  created_at timestamptz not null default now()
);

alter table public.service_notifications enable row level security;

drop policy if exists "service_notifications_insert_public" on public.service_notifications;
create policy "service_notifications_insert_public"
  on public.service_notifications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "service_notifications_select_admin_only" on public.service_notifications;
create policy "service_notifications_select_admin_only"
  on public.service_notifications for select
  to authenticated
  using (public.is_admin());
