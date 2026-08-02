-- Storage policies for the quote_attachments bucket.
--
-- Why this is separate from 0001: the Supabase SQL editor runs a script as a
-- single transaction. `create policy ... on storage.objects` can fail with
-- 42501 "must be owner of table objects", and that abort rolled back 0001's
-- `insert into storage.buckets` along with it — leaving the columns applied
-- but no bucket, which is why uploads failed with NoSuchBucket.
--
-- PREREQUISITE: create the bucket FIRST via Dashboard → Storage → New bucket,
-- named `quote_attachments`, PRIVATE (public toggle off). Then run this file
-- as its own execution.
--
-- If this still throws 42501, create these two rules in the Dashboard instead:
-- Storage → quote_attachments → Policies.
--
-- Idempotent: safe to re-run.

drop policy if exists "quote_attachments_insert_public" on storage.objects;
create policy "quote_attachments_insert_public"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'quote_attachments');

-- Admin-only read. The bucket stays private: admin download links are minted
-- server-side with createSignedUrl(path, 300) in admin/quotes/[id]/page.tsx,
-- so no anon read grant is needed.
drop policy if exists "quote_attachments_select_admin_only" on storage.objects;
create policy "quote_attachments_select_admin_only"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'quote_attachments' and public.is_admin());
