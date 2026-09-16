-- ============================================================
-- Fase 1 — Storage buckets & policies
-- Companion: PRD.md §22, §32, IMPLEMENTATION.md Fase 1 step 7
--
-- Limits live in the bucket definition, not only in the frontend:
-- a frontend check is a convenience for the user, not a control —
-- anyone can post straight at the storage API with the anon key.
-- ============================================================

-- 5 MB for images. Large enough for a screenshot or certificate scan,
-- small enough that an upload cannot be used to fill the quota.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile',      'profile',      true, 5242880,
     array['image/jpeg','image/png','image/webp']),
  ('projects',     'projects',     true, 5242880,
     array['image/jpeg','image/png','image/webp']),
  ('certificates', 'certificates', true, 5242880,
     array['image/jpeg','image/png','image/webp','application/pdf']),
  ('education',    'education',    true, 5242880,
     array['image/jpeg','image/png','image/webp']),
  ('achievements', 'achievements', true, 5242880,
     array['image/jpeg','image/png','image/webp']),
  -- documents holds the CV (PRD §38 "Download CV"), so PDF is the point.
  ('documents',    'documents',    true, 10485760,
     array['application/pdf'])
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Object policies
-- ------------------------------------------------------------
-- Buckets are public = true, so reads are served by the CDN without a
-- policy. Writes still go through RLS on storage.objects, which is
-- where the admin restriction has to be expressed.
--
-- The bucket list is repeated in each policy rather than allowing every
-- bucket: a bucket added later should not silently inherit write access.

create policy storage_admin_insert on storage.objects
  for insert to authenticated
  with check (
    public.is_admin()
    and bucket_id in ('profile','projects','certificates','education','achievements','documents')
  );

create policy storage_admin_update on storage.objects
  for update to authenticated
  using (
    public.is_admin()
    and bucket_id in ('profile','projects','certificates','education','achievements','documents')
  )
  with check (
    public.is_admin()
    and bucket_id in ('profile','projects','certificates','education','achievements','documents')
  );

-- DELETE matters as much as INSERT: replacing an image deletes the old
-- file in the same action, so storage does not accumulate orphans
-- (IMPLEMENTATION.md Fase 7 step 6).
create policy storage_admin_delete on storage.objects
  for delete to authenticated
  using (
    public.is_admin()
    and bucket_id in ('profile','projects','certificates','education','achievements','documents')
  );
