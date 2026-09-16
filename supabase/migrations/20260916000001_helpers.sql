-- ============================================================
-- Fase 1 — Helper functions
-- Companion: IMPLEMENTATION.md Fase 1, PRD.md §23 §24
-- ============================================================

-- gen_random_uuid() lives in pgcrypto. Supabase enables it by default,
-- but declaring it makes the migration reproducible on a bare database.
create extension if not exists pgcrypto with schema extensions;

-- ------------------------------------------------------------
-- updated_at maintenance (PRD §24: "diperbarui otomatis via trigger")
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger function: stamps updated_at on every UPDATE.';

-- ------------------------------------------------------------
-- Admin check (PRD §23, §24 admin_users)
-- ------------------------------------------------------------
-- admin_users is created in the next migration, so this function is
-- defined there instead — a SECURITY DEFINER function cannot be
-- validated against a table that does not exist yet.
