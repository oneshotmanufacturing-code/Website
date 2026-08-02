-- Seed profiles.role for the app-layer "owner" allowlist (src/lib/auth/owner.ts),
-- so is_admin() (which only checks profiles.role) agrees with what
-- middleware.ts / admin/layout.tsx already let through. Without this, owner
-- emails pass every app-layer gate but every quote_requests/storage RLS
-- check silently returns zero rows — the admin panel looks empty, not broken.
update public.profiles set role = 'admin'
where email in ('oneshotmanufacturing@gmail.com', 'swarajdangare2016@gmail.com');

-- Link converted quotes back to the order they produced.
alter table public.orders
  add column if not exists quote_id uuid references public.quote_requests(id) on delete set null;
