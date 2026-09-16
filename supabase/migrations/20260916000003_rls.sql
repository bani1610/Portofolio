-- ============================================================
-- Fase 1 — Row Level Security
-- Companion: PRD.md §32, IMPLEMENTATION.md Fase 1
--
-- Pattern per table:
--   Public (anon + authenticated) : SELECT where published = true
--   Admin  (is_admin())           : SELECT / INSERT / UPDATE / DELETE
--
-- Two tables deviate, each noted where it happens:
--   contact_messages : public INSERT only, never SELECT
--   technologies     : public SELECT of every row (see note below)
--
-- Enabling RLS without writing a policy denies everything by default,
-- so every table below gets its policies in the same statement block.
-- ============================================================

alter table public.admin_users          enable row level security;
alter table public.profiles             enable row level security;
alter table public.technologies         enable row level security;
alter table public.projects             enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_images       enable row level security;
alter table public.experiences          enable row level security;
alter table public.certificates         enable row level security;
alter table public.education            enable row level security;
alter table public.achievements         enable row level security;
alter table public.social_links         enable row level security;
alter table public.contact_messages     enable row level security;
alter table public.site_settings        enable row level security;

-- ------------------------------------------------------------
-- admin_users — never readable by the public
-- ------------------------------------------------------------
-- No public policy at all: anon gets zero rows. Admins may read the
-- table (the dashboard shows who has access) but membership is granted
-- manually in Supabase, so there is no INSERT/UPDATE/DELETE policy —
-- not even for admins. An admin must not be able to promote accounts
-- through the app.
create policy admin_users_admin_select on public.admin_users
  for select to authenticated using (public.is_admin());

-- ------------------------------------------------------------
-- profiles (PRD §9) — public, single row, no published flag
-- ------------------------------------------------------------
create policy profiles_public_select on public.profiles
  for select to anon, authenticated using (true);
create policy profiles_admin_all on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- technologies (PRD §10)
-- ------------------------------------------------------------
-- Public SELECT covers every row, not just visible = true.
-- `visible` decides whether a technology appears in the Skills section,
-- which is a rendering decision made in the query layer — it is not a
-- privacy boundary. A technology with visible = false still has to be
-- readable, otherwise the tech chips on a published project would come
-- back empty (IMPLEMENTATION §3.1).
create policy technologies_public_select on public.technologies
  for select to anon, authenticated using (true);
create policy technologies_admin_all on public.technologies
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- projects (PRD §26 — draft content must not leak, PRD §40)
-- ------------------------------------------------------------
create policy projects_public_select on public.projects
  for select to anon, authenticated using (published);
create policy projects_admin_all on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- project_technologies / project_images
-- ------------------------------------------------------------
-- These inherit visibility from their parent project: a row is public
-- only when the project it belongs to is published. Without the EXISTS
-- clause, the gallery of an unpublished project would be readable by
-- anyone who guessed its id.
create policy project_technologies_public_select on public.project_technologies
  for select to anon, authenticated using (
    exists (select 1 from public.projects p where p.id = project_id and p.published)
  );
create policy project_technologies_admin_all on public.project_technologies
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy project_images_public_select on public.project_images
  for select to anon, authenticated using (
    exists (select 1 from public.projects p where p.id = project_id and p.published)
  );
create policy project_images_admin_all on public.project_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- experiences · certificates · education · achievements
-- Same shape: public reads published rows only.
-- ------------------------------------------------------------
create policy experiences_public_select on public.experiences
  for select to anon, authenticated using (published);
create policy experiences_admin_all on public.experiences
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy certificates_public_select on public.certificates
  for select to anon, authenticated using (published);
create policy certificates_admin_all on public.certificates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy education_public_select on public.education
  for select to anon, authenticated using (published);
create policy education_admin_all on public.education
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy achievements_public_select on public.achievements
  for select to anon, authenticated using (published);
create policy achievements_admin_all on public.achievements
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- social_links — gated by `visible` instead of `published`
-- ------------------------------------------------------------
create policy social_links_public_select on public.social_links
  for select to anon, authenticated using (visible);
create policy social_links_admin_all on public.social_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- site_settings — public read (drives SEO metadata, PRD §30)
-- ------------------------------------------------------------
create policy site_settings_public_select on public.site_settings
  for select to anon, authenticated using (true);
create policy site_settings_admin_all on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- contact_messages (PRD §17, §24) — the one inverted table
-- ------------------------------------------------------------
-- Public may INSERT but never SELECT: a visitor must be able to send a
-- message, and must not be able to read anybody else's.
--
-- The WITH CHECK pins `read` to false so a visitor cannot post a message
-- that is already marked as read and quietly skip the admin inbox.
create policy contact_messages_public_insert on public.contact_messages
  for insert to anon, authenticated with check (not read);

create policy contact_messages_admin_select on public.contact_messages
  for select to authenticated using (public.is_admin());
create policy contact_messages_admin_update on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy contact_messages_admin_delete on public.contact_messages
  for delete to authenticated using (public.is_admin());
