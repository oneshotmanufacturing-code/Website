-- Follow-up to 0001: that migration's ALTER TABLE listed every column the
-- app writes to quote_requests EXCEPT `message` (form.notes) — an oversight,
-- not a new finding. The insert throws PGRST204 on this column exactly the
-- same way it did on customer_id, and since the insert happens before any
-- attachment upload, this alone was also blocking file uploads (saveQuote()
-- never reaches the storage.upload() calls).
--
-- Idempotent: safe to re-run.

alter table public.quote_requests
  add column if not exists message text;
