-- ============================================================
-- Seed — initial content (PRD.md §41)
--
-- Scope note, deliberately narrow:
--   PRD §41 lists project TITLES and skill NAMES, nothing more. Those
--   are seeded verbatim. Descriptions, roles, challenges, results and
--   dates are NOT invented here — they describe real work and only the
--   owner can write them truthfully.
--
--   Every project and experience is therefore seeded as a DRAFT
--   (published = false, the column default). They appear in the admin
--   list ready to be filled in, and stay off the public site until
--   published on purpose (PRD §26).
--
-- Idempotent: safe to run more than once against the same database.
-- ============================================================

-- ------------------------------------------------------------
-- technologies (PRD §41 Skills — 18 entries, grouped per §10)
-- ------------------------------------------------------------
insert into public.technologies (name, category, display_order, visible) values
  ('HTML',            'frontend',  10, true),
  ('CSS',             'frontend',  20, true),
  ('JavaScript',      'frontend',  30, true),
  ('TypeScript',      'frontend',  40, true),
  ('React',           'frontend',  50, true),
  ('Next.js',         'frontend',  60, true),
  ('Tailwind CSS',    'frontend',  70, true),
  ('PHP',             'backend',   10, true),
  ('Laravel',         'backend',   20, true),
  ('Livewire',        'backend',   30, true),
  ('REST API',        'backend',   40, true),
  ('Laravel Sanctum', 'backend',   50, true),
  ('MySQL',           'database',  10, true),
  ('PostgreSQL',      'database',  20, true),
  ('Supabase',        'database',  30, true),
  ('Git',             'tools',     10, true),
  ('GitHub',          'tools',     20, true),
  ('Docker',          'tools',     30, true)
on conflict (name) do nothing;

-- ------------------------------------------------------------
-- projects (PRD §41 — titles only; the rest is the owner's to write)
-- ------------------------------------------------------------
-- `category` is a guess that is cheap to correct in the admin UI, and
-- unlike prose it cannot be wrong about facts: every row is a draft, so
-- nothing here reaches the public site before being reviewed.
insert into public.projects (title, slug, category) values
  ('Templas',                  'templas',                  'web'),
  ('SAPA',                     'sapa',                     'web'),
  ('NLP BPJS / RAG Chatbot',   'nlp-bpjs-rag-chatbot',     'ai'),
  ('YOLO Object Detection',    'yolo-object-detection',    'ai'),
  ('Transjakarta Forecasting', 'transjakarta-forecasting', 'data'),
  ('Website RBQ',              'website-rbq',              'web'),
  ('Casir POS',                'casir-pos',                'web')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- experiences (PRD §41)
-- ------------------------------------------------------------
-- Only the year is given in the PRD, so start_date is the 1 January of
-- that year — a placeholder to be corrected in the admin UI, not a
-- claim. start_date is NOT NULL, so some value has to be chosen.
insert into public.experiences (company, position, start_date, current, published)
select v.company, v.position, v.start_date, v.current, false
from (values
  ('Internship',  'Web Developer Intern',  date '2026-01-01', true),
  ('Templas',     'Full Stack Developer',  date '2026-01-01', false),
  ('SAPA',        'Full Stack Developer',  date '2025-01-01', false)
) as v (company, position, start_date, current)
where not exists (
  select 1 from public.experiences e
  where e.company = v.company and e.position = v.position
);

-- ------------------------------------------------------------
-- education (PRD §15)
-- ------------------------------------------------------------
-- The only seeded row that is published: PRD §15 states it as fact,
-- with a real institution, degree and start year.
insert into public.education (institution, degree, field, start_date, published)
select 'Sekolah Tinggi Teknologi Terpadu Nurul Fikri',
       'S1', 'Teknik Informatika', date '2024-09-01', true
where not exists (
  select 1 from public.education
  where institution = 'Sekolah Tinggi Teknologi Terpadu Nurul Fikri'
);

-- ------------------------------------------------------------
-- profiles (PRD §8, §24) — single row
-- ------------------------------------------------------------
-- Name and headline come from the PRD hero copy (§8). Bio is taken from
-- the About copy the PRD spells out verbatim (§9).
insert into public.profiles (name, headline, bio)
select 'Sholahuddin Robbani',
       'Web Developer',
       'Saya adalah mahasiswa Teknik Informatika yang memiliki ketertarikan dan pengalaman dalam pengembangan aplikasi web. Saya terbiasa mengembangkan aplikasi dari sisi frontend, backend, database, hingga integrasi API.'
where not exists (select 1 from public.profiles);

-- ------------------------------------------------------------
-- social_links (PRD §17, §18)
-- ------------------------------------------------------------
-- URLs are unknown to the PRD, so the rows are seeded hidden
-- (visible = false) with placeholder targets. A live link pointing at
-- the wrong profile is worse than no link, and RLS hides them until the
-- real URLs are filled in.
insert into public.social_links (platform, url, icon, display_order, visible)
select v.platform, v.url, v.icon, v.display_order, false
from (values
  ('GitHub',    'https://github.com/',      'github',    10),
  ('LinkedIn',  'https://linkedin.com/in/', 'linkedin',  20),
  ('Email',     'mailto:',                  'mail',      30),
  ('Instagram', 'https://instagram.com/',   'instagram', 40)
) as v (platform, url, icon, display_order)
where not exists (
  select 1 from public.social_links s where s.platform = v.platform
);

-- ------------------------------------------------------------
-- site_settings (PRD §30) — single row
-- ------------------------------------------------------------
insert into public.site_settings (site_title, site_description)
select 'Sholahuddin Robbani — Web Developer',
       'Portfolio Sholahuddin Robbani, Web Developer yang berfokus pada pengembangan aplikasi web.'
where not exists (select 1 from public.site_settings);
