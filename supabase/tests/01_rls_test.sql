-- ============================================================
-- Fase 1 exit criteria (IMPLEMENTATION.md):
--   "RLS terbukti bekerja — query dengan anon key hanya mengembalikan
--    baris published; percobaan INSERT sebagai anon ditolak.
--    Uji ini secara eksplisit, jangan diasumsikan."
--
-- Every assertion below fails loudly instead of printing a row, so a
-- regression stops the run rather than hiding in the output.
-- ============================================================

-- Supabase grants these to API roles by default; a plain container does not.
grant select, insert, update, delete on all tables in schema public to anon, authenticated;

-- ---------- fixtures ----------
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'intruder@example.com');

insert into public.admin_users (user_id)
  values ('11111111-1111-1111-1111-111111111111');

insert into public.projects (title, slug, published) values
  ('Published Project', 'published-project', true),
  ('Draft Project',     'draft-project',     false);

insert into public.project_images (project_id, image_url)
  select id, 'https://example.com/shot.png' from public.projects where slug = 'draft-project';

insert into public.contact_messages (name, email, message)
  values ('Visitor', 'visitor@example.com', 'halo');

-- ---------- helper ----------
create or replace function pg_temp.check(label text, condition boolean)
returns void
language plpgsql
as $$
begin
  if condition then
    raise notice 'PASS  %', label;
  else
    raise exception 'FAIL  %', label;
  end if;
end;
$$;

-- ============================================================
-- As anon
-- ============================================================
set role anon;
-- is_local = false: psql autocommits every statement, so a
-- transaction-local setting would vanish before the next query.
select set_config('request.jwt.claim.sub', '', false);

select pg_temp.check(
  'anon sees only published projects',
  (select count(*) from public.projects
    where slug in ('published-project','draft-project')) = 1
);

select pg_temp.check(
  'anon cannot read a draft project by its slug',
  (select count(*) from public.projects where slug = 'draft-project') = 0
);

select pg_temp.check(
  'anon cannot read images belonging to a draft project',
  (select count(*) from public.project_images pi
    join public.projects p on p.id = pi.project_id
    where p.slug = 'draft-project') = 0
);

select pg_temp.check(
  'anon cannot read contact messages',
  (select count(*) from public.contact_messages) = 0
);

select pg_temp.check(
  'anon cannot read admin_users',
  (select count(*) from public.admin_users) = 0
);

-- Write attempts as anon. Each must raise, so the expected outcome is
-- the exception being caught — reaching the else branch is the failure.
do $$
begin
  insert into public.projects (title, slug) values ('Injected', 'injected');
  raise exception 'FAIL  anon INSERT into projects was allowed';
exception
  when insufficient_privilege then raise notice 'PASS  anon cannot INSERT a project';
end
$$;

do $$
begin
  update public.projects set title = 'Hijacked' where slug = 'published-project';
  if not found then
    raise notice 'PASS  anon UPDATE on projects matched no rows';
  else
    raise exception 'FAIL  anon UPDATE on projects was applied';
  end if;
exception
  when insufficient_privilege then raise notice 'PASS  anon cannot UPDATE a project';
end
$$;

do $$
begin
  delete from public.projects where slug = 'published-project';
  if not found then
    raise notice 'PASS  anon DELETE on projects matched no rows';
  else
    raise exception 'FAIL  anon DELETE on projects removed a row';
  end if;
exception
  when insufficient_privilege then raise notice 'PASS  anon cannot DELETE a project';
end
$$;

-- The contact form is the one thing anon must be able to write (PRD §17).
insert into public.contact_messages (name, email, message)
  values ('Anon Visitor', 'anon@example.com', 'pesan dari form');
select pg_temp.check('anon can INSERT a contact message', true);

do $$
begin
  insert into public.contact_messages (name, email, message, read)
    values ('Sneaky', 'sneaky@example.com', 'sudah dibaca', true);
  raise exception 'FAIL  anon posted a contact message pre-marked as read';
exception
  -- A WITH CHECK failure surfaces as insufficient_privilege (42501),
  -- not check_violation: the rejection comes from RLS, not a constraint.
  when insufficient_privilege then
    raise notice 'PASS  anon cannot pre-mark a message as read';
end
$$;

-- ============================================================
-- As a logged-in NON-admin (PRD §23: login alone is not access)
-- ============================================================
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);

select pg_temp.check(
  'non-admin still sees only published projects',
  (select count(*) from public.projects
    where slug in ('published-project','draft-project')) = 1
);

select pg_temp.check(
  'non-admin cannot read contact messages',
  (select count(*) from public.contact_messages) = 0
);

do $$
begin
  insert into public.projects (title, slug) values ('By Non Admin', 'by-non-admin');
  raise exception 'FAIL  non-admin INSERT into projects was allowed';
exception
  when insufficient_privilege then raise notice 'PASS  non-admin cannot INSERT a project';
end
$$;

-- ============================================================
-- As admin
-- ============================================================
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);

select pg_temp.check(
  'admin sees drafts as well as published projects',
  (select count(*) from public.projects
    where slug in ('published-project','draft-project')) = 2
);

select pg_temp.check(
  'admin can read contact messages',
  (select count(*) from public.contact_messages) >= 2
);

insert into public.projects (title, slug) values ('By Admin', 'by-admin');
select pg_temp.check(
  'admin can INSERT a project',
  (select count(*) from public.projects where slug = 'by-admin') = 1
);

update public.projects set published = true where slug = 'by-admin';
select pg_temp.check(
  'admin can UPDATE a project',
  (select published from public.projects where slug = 'by-admin')
);

delete from public.projects where slug = 'by-admin';
select pg_temp.check(
  'admin can DELETE a project',
  (select count(*) from public.projects where slug = 'by-admin') = 0
);

do $$
begin
  insert into public.admin_users (user_id)
    values ('22222222-2222-2222-2222-222222222222');
  raise exception 'FAIL  admin was able to promote another account';
exception
  when insufficient_privilege then raise notice 'PASS  admin cannot promote another account';
end
$$;

reset role;

-- ============================================================
-- Trigger, constraint, and default behaviour
-- ============================================================

-- updated_at must move on UPDATE (PRD §24).
do $$
declare
  before_ts timestamptz;
  after_ts  timestamptz;
begin
  select updated_at into before_ts from public.projects where slug = 'published-project';
  perform pg_sleep(0.01);
  update public.projects set title = 'Renamed' where slug = 'published-project';
  select updated_at into after_ts from public.projects where slug = 'published-project';

  if after_ts > before_ts then
    raise notice 'PASS  updated_at trigger fires on UPDATE';
  else
    raise exception 'FAIL  updated_at did not change';
  end if;
end
$$;

-- New content must start as a draft (PRD §24, §26).
insert into public.certificates (title, issuer) values ('Some Cert', 'Some Issuer');
select pg_temp.check(
  'new content defaults to draft',
  (select not published from public.certificates where title = 'Some Cert')
);

-- "Present" is current = true; an end_date alongside it is contradictory.
do $$
begin
  insert into public.experiences (company, position, start_date, current, end_date)
    values ('Contradiction Inc', 'Dev', '2026-01-01', true, '2026-06-01');
  raise exception 'FAIL  a current experience accepted an end_date';
exception
  when check_violation then raise notice 'PASS  a current experience rejects an end_date';
end
$$;

-- Category is a closed set (PRD §24).
do $$
begin
  insert into public.projects (title, slug, category) values ('Bad', 'bad-cat', 'blockchain');
  raise exception 'FAIL  an unknown project category was accepted';
exception
  when check_violation then raise notice 'PASS  unknown project category rejected';
end
$$;

-- Slugs address public URLs, so they must be unique (PRD §12).
do $$
begin
  insert into public.projects (title, slug) values ('Duplicate', 'published-project');
  raise exception 'FAIL  a duplicate slug was accepted';
exception
  when unique_violation then raise notice 'PASS  duplicate slug rejected';
end
$$;

-- Deleting a project must take its images with it (PRD §24).
do $$
declare
  pid uuid;
  remaining integer;
begin
  insert into public.projects (title, slug) values ('Cascade Test', 'cascade-test')
    returning id into pid;
  insert into public.project_images (project_id, image_url)
    values (pid, 'https://example.com/a.png'), (pid, 'https://example.com/b.png');

  delete from public.projects where id = pid;
  select count(*) into remaining from public.project_images where project_id = pid;

  if remaining = 0 then
    raise notice 'PASS  deleting a project cascades to its images';
  else
    raise exception 'FAIL  % orphan image rows remain', remaining;
  end if;
end
$$;

select 'ALL RLS AND SCHEMA ASSERTIONS PASSED' as result;

-- ============================================================
-- Seed (PRD §41) — run before this file by run.sh
-- ============================================================

select pg_temp.check(
  'seed loaded all 18 skills listed in PRD 41',
  (select count(*) from public.technologies) = 18
);

select pg_temp.check(
  'seed is idempotent — no duplicate technologies after two runs',
  (select count(*) from (select name from public.technologies group by name having count(*) > 1) d) = 0
);

select pg_temp.check(
  'seed is idempotent — no duplicate experiences after two runs',
  (select count(*) from public.experiences where company in ('Templas','SAPA','Internship')) = 3
);

select pg_temp.check(
  'seed is idempotent — profiles and site_settings stay single-row',
  (select count(*) from public.profiles) = 1
    and (select count(*) from public.site_settings) = 1
);

-- Seeded projects are drafts on purpose: their descriptions are not
-- written yet, and a half-empty project page must not reach the public.
-- Scoped to the seeded slugs: this file's own fixtures include a
-- published project, which is not what this assertion is about.
select pg_temp.check(
  'all 7 seeded projects are drafts',
  (select count(*) from public.projects
    where slug in ('templas','sapa','nlp-bpjs-rag-chatbot','yolo-object-detection',
                   'transjakarta-forecasting','website-rbq','casir-pos')) = 7
    and (select count(*) from public.projects
    where slug in ('templas','sapa','nlp-bpjs-rag-chatbot','yolo-object-detection',
                   'transjakarta-forecasting','website-rbq','casir-pos')
      and published) = 0
);

select pg_temp.check(
  'seeded social links are hidden until their URLs are real',
  (select count(*) from public.social_links where visible) = 0
);

select 'SEED ASSERTIONS PASSED' as result;
