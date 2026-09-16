-- ============================================================
-- Stubs for validating migrations on a plain Postgres container.
--
-- NOT part of the migration set and never applied to Supabase — the
-- real platform ships these schemas. This file exists so the migrations
-- can be syntax-checked and RLS-tested locally without a cloud project.
-- ============================================================

create schema if not exists auth;
create schema if not exists storage;
create schema if not exists extensions;

create extension if not exists pgcrypto with schema extensions;
set search_path = public, extensions;

-- Roles Supabase grants to API callers.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end
$$;

grant usage on schema public to anon, authenticated;

create table if not exists auth.users (
  id    uuid primary key default extensions.gen_random_uuid(),
  email text unique
);

-- Supabase exposes the caller's id through auth.uid(); the test harness
-- drives it with a session setting so it can impersonate anon vs admin.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create table if not exists storage.buckets (
  id                 text primary key,
  name               text not null,
  public             boolean not null default false,
  file_size_limit    bigint,
  allowed_mime_types text[]
);

create table if not exists storage.objects (
  id        uuid primary key default extensions.gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name      text
);

alter table storage.objects enable row level security;
grant usage on schema storage to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;
