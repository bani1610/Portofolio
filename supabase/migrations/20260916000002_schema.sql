-- ============================================================
-- Fase 1 — Tables
-- Companion: PRD.md §24, IMPLEMENTATION.md Fase 1 + Bagian 3
--
-- Conventions (PRD §24):
--   id          uuid primary key
--   created_at  timestamptz default now()
--   updated_at  timestamptz, maintained by trigger
--   published   boolean not null default false  -- draft by default
-- ============================================================

-- ------------------------------------------------------------
-- admin_users (PRD §23, §24)
-- ------------------------------------------------------------
create table public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Membership table deciding who may access the admin dashboard (PRD 23).';

-- is_admin() is defined here, after admin_users exists.
--
-- SECURITY DEFINER is required: an RLS policy on admin_users itself would
-- otherwise recurse (deciding "is this user an admin" needs to read the
-- very table whose policy is being evaluated).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

comment on function public.is_admin() is
  'True when the current session belongs to a registered admin. Called by every RLS write policy (PRD 23).';

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------
-- profiles (PRD §24) — single row
-- ------------------------------------------------------------
create table public.profiles (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  headline      text,
  bio           text,
  profile_image text,
  location      text,
  email         text,
  phone         text,
  resume_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- technologies (PRD §10 + §24 — serves Skills AND project tags)
-- ------------------------------------------------------------
create table public.technologies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  category      text not null check (category in ('frontend','backend','database','tools')),
  icon          text,
  display_order integer not null default 0,
  visible       boolean not null default true,
  created_at    timestamptz not null default now()
);

comment on table public.technologies is
  'One table for both the Skills section (visible = true) and project tech tags (PRD 10, IMPLEMENTATION 3.1).';
comment on column public.technologies.visible is
  'False = usable as a project tag but hidden from the Skills section.';

-- ------------------------------------------------------------
-- projects (PRD §11, §24 + IMPLEMENTATION §3.2)
-- ------------------------------------------------------------
create table public.projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  short_description text,
  description       text,
  category          text not null default 'web'
                    check (category in ('web','ai','data','other')),
  role              text,
  team              text,
  features          text[] not null default '{}',
  challenges        text,
  solutions         text,
  results           text,
  start_date        date,
  end_date          date,
  github_url        text,
  demo_url          text,
  cover_image       text,
  featured          boolean not null default false,
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on column public.projects.features is
  'Array, not one text blob: each item renders as its own checked list row (DESIGN.md 15).';
comment on column public.projects.category is
  'Exactly one per project; drives the /projects filter. Distinct from technologies, of which a project has many.';

create index projects_published_idx on public.projects (published);
create index projects_featured_idx  on public.projects (featured) where published;

-- ------------------------------------------------------------
-- project_technologies (PRD §24, §25)
-- ------------------------------------------------------------
create table public.project_technologies (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id)     on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete cascade,
  unique (project_id, technology_id)
);

create index project_technologies_project_idx    on public.project_technologies (project_id);
create index project_technologies_technology_idx on public.project_technologies (technology_id);

-- ------------------------------------------------------------
-- project_images (PRD §24) — gallery / screenshots
-- ------------------------------------------------------------
create table public.project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  image_url     text not null,
  caption       text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create index project_images_project_idx on public.project_images (project_id, display_order);

-- ------------------------------------------------------------
-- experiences (PRD §13, §24)
-- ------------------------------------------------------------
create table public.experiences (
  id              uuid primary key default gen_random_uuid(),
  company         text not null,
  position        text not null,
  location        text,
  employment_type text,
  start_date      date not null,
  end_date        date,
  description     text,
  company_logo    text,
  current         boolean not null default false,
  featured        boolean not null default false,
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- "Present" (PRD 13) is expressed by current = true, which forbids an end_date.
  constraint experiences_current_has_no_end_date
    check (not (current and end_date is not null))
);

create index experiences_published_idx on public.experiences (published, start_date desc);

-- ------------------------------------------------------------
-- certificates (PRD §14, §24)
-- ------------------------------------------------------------
create table public.certificates (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  issuer            text not null,
  issue_date        date,
  credential_id     text,
  credential_url    text,
  certificate_image text,
  certificate_file  text,
  description       text,
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index certificates_published_idx on public.certificates (published, issue_date desc);

-- ------------------------------------------------------------
-- education (PRD §15, §24)
-- ------------------------------------------------------------
create table public.education (
  id          uuid primary key default gen_random_uuid(),
  institution text not null,
  degree      text,
  field       text,
  start_date  date,
  end_date    date,
  description text,
  logo        text,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- achievements (PRD §16, §24)
-- ------------------------------------------------------------
create table public.achievements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  organization  text,
  date          date,
  description   text,
  image         text,
  url           text,
  display_order integer not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- social_links (PRD §24)
-- ------------------------------------------------------------
create table public.social_links (
  id            uuid primary key default gen_random_uuid(),
  platform      text not null,
  url           text not null,
  icon          text,
  display_order integer not null default 0,
  visible       boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- contact_messages (PRD §17, §24 — IMPLEMENTATION §3.3)
-- ------------------------------------------------------------
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_unread_idx
  on public.contact_messages (created_at desc) where not read;

-- ------------------------------------------------------------
-- site_settings (PRD §24 — IMPLEMENTATION §3.4) — single row
-- ------------------------------------------------------------
create table public.site_settings (
  id               uuid primary key default gen_random_uuid(),
  site_title       text,
  site_description text,
  og_image         text,
  resume_url       text,
  updated_at       timestamptz not null default now()
);

-- ------------------------------------------------------------
-- updated_at triggers (PRD §24)
-- ------------------------------------------------------------
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.certificates
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.education
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.achievements
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.social_links
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
