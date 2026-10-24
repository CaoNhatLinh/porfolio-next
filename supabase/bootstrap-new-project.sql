-- One-time bootstrap for the NEW, empty kamling-portfolio project only.
-- Generated from existing migrations; do not run on an existing database.
-- 0004 only deletes obsolete lab samples; a fresh project has none.
BEGIN;

-- 0001_initial.sql
create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public) values ('portfolio-media', 'portfolio-media', true) on conflict (id) do nothing;

do $$ begin create type public.content_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED'); exception when duplicate_object then null; end $$;
do $$ begin create type public.contact_status as enum ('NEW', 'READ', 'REPLIED', 'ARCHIVED'); exception when duplicate_object then null; end $$;

create table if not exists public.site_profile (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  title jsonb not null default '{}'::jsonb,
  intro jsonb not null default '{}'::jsonb,
  bio jsonb not null default '{}'::jsonb,
  email text not null,
  image_url text,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create unique index if not exists site_profile_one_owner on public.site_profile(owner_id);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  category text not null,
  summary jsonb not null default '{}'::jsonb,
  role jsonb not null default '{}'::jsonb,
  year text,
  stack text[] not null default '{}',
  image_url text,
  content jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  outcome jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'DRAFT',
  is_featured boolean not null default false,
  featured_order integer not null default 0,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists projects_public_order on public.projects(status, is_featured desc, featured_order, sort_order);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  topic text not null default 'Notes',
  reading_time text,
  cover_url text,
  status public.content_status not null default 'DRAFT',
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists articles_public_order on public.articles(status, published_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  project text not null,
  budget_range text,
  website text,
  message text,
  status public.contact_status not null default 'NEW',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at on public.contact_messages(created_at desc);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  storage_key text not null unique,
  url text not null,
  mime_type text not null,
  byte_size bigint not null,
  width integer,
  height integer,
  alt_text text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists media_assets_owner on public.media_assets(owner_id, created_at desc);

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  visitor_hash text not null,
  path text not null,
  referrer_domain text,
  viewport text,
  device_family text,
  country_code text,
  engaged_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at on public.analytics_events(created_at desc);
create index if not exists analytics_events_path on public.analytics_events(path);

create table if not exists public.analytics_daily (
  day date primary key,
  page_views integer not null default 0,
  unique_visitors integer not null default 0,
  engaged_ms_total bigint not null default 0,
  top_pages jsonb not null default '[]'::jsonb,
  top_referrers jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.site_profile enable row level security;
alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.contact_messages enable row level security;
alter table public.media_assets enable row level security;
alter table public.analytics_events enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "public reads portfolio media" on storage.objects;
drop policy if exists "owner uploads portfolio media" on storage.objects;
drop policy if exists "owner updates portfolio media" on storage.objects;
drop policy if exists "owner deletes portfolio media" on storage.objects;
create policy "public reads portfolio media" on storage.objects for select using (bucket_id = 'portfolio-media');
create policy "owner uploads portfolio media" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owner updates portfolio media" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owner deletes portfolio media" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "public reads profile" on public.site_profile;
drop policy if exists "owner manages profile" on public.site_profile;
drop policy if exists "public reads published projects" on public.projects;
drop policy if exists "owner manages projects" on public.projects;
drop policy if exists "public reads published articles" on public.articles;
drop policy if exists "owner manages articles" on public.articles;
drop policy if exists "owner reads messages" on public.contact_messages;
drop policy if exists "owner manages media metadata" on public.media_assets;
drop policy if exists "owner reads analytics" on public.analytics_events;
drop policy if exists "owner reads daily analytics" on public.analytics_daily;
drop policy if exists "owner reads audit logs" on public.audit_logs;
create policy "public reads profile" on public.site_profile for select using (true);
create policy "owner manages profile" on public.site_profile for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "public reads published projects" on public.projects for select using (status = 'PUBLISHED');
create policy "owner manages projects" on public.projects for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "public reads published articles" on public.articles for select using (status = 'PUBLISHED');
create policy "owner manages articles" on public.articles for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner reads messages" on public.contact_messages for select using (false);
create policy "owner manages media metadata" on public.media_assets for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner reads analytics" on public.analytics_events for select using (false);
create policy "owner reads daily analytics" on public.analytics_daily for select using (false);
create policy "owner reads audit logs" on public.audit_logs for select using (actor_id = auth.uid());

-- 0002_completion_pass.sql
-- Completion pass: additive CMS fields. Safe to run after 0001_initial.sql.
alter table public.site_profile add column if not exists location text;
alter table public.site_profile add column if not exists availability jsonb not null default '{}'::jsonb;
alter table public.site_profile add column if not exists socials jsonb not null default '[]'::jsonb;
alter table public.site_profile add column if not exists resume_url text;

alter table public.projects add column if not exists gallery jsonb not null default '[]'::jsonb;

create index if not exists projects_owner_sort_order on public.projects(owner_id, sort_order, featured_order);

-- 0003_portfolio_vitality.sql
-- Portfolio vitality and hiring conversion fields. Additive and safe to rerun.
alter table public.site_profile add column if not exists resume_updated_at date;
alter table public.site_profile add column if not exists response_time jsonb not null default '{}'::jsonb;
alter table public.site_profile add column if not exists engagement_modes text[] not null default '{}';

alter table public.projects add column if not exists duration text;
alter table public.projects add column if not exists team_context jsonb not null default '{}'::jsonb;
alter table public.projects add column if not exists proof_links jsonb not null default '[]'::jsonb;

alter table public.contact_messages add column if not exists intent text not null default 'general';
alter table public.contact_messages add column if not exists timeline text;
create index if not exists contact_messages_intent_created_at on public.contact_messages(intent, created_at desc);

alter table public.analytics_events add column if not exists event_name text not null default 'page_view';
create index if not exists analytics_events_event_name on public.analytics_events(event_name, created_at desc);

create table if not exists public.lab_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'DRAFT',
  cover_image text,
  demo_url text,
  repo_url text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists lab_items_public_order on public.lab_items(status, sort_order);
alter table public.lab_items enable row level security;
drop policy if exists "public reads published lab items" on public.lab_items;
drop policy if exists "owner manages lab items" on public.lab_items;
create policy "public reads published lab items" on public.lab_items for select using (status = 'PUBLISHED');
create policy "owner manages lab items" on public.lab_items for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- 0005_restrict_direct_writes.sql
-- All CMS mutations go through owner-checked server actions using service_role.
-- An unrelated authenticated account must not publish its own content here.
drop policy if exists "owner manages profile" on public.site_profile;
drop policy if exists "owner manages projects" on public.projects;
drop policy if exists "owner manages articles" on public.articles;
drop policy if exists "owner manages lab items" on public.lab_items;
drop policy if exists "owner manages media metadata" on public.media_assets;
drop policy if exists "owner uploads portfolio media" on storage.objects;
drop policy if exists "owner updates portfolio media" on storage.objects;
drop policy if exists "owner deletes portfolio media" on storage.objects;

-- Public SELECT policies stay intact; drafts, inbox, analytics and metadata
-- remain inaccessible to anon/authenticated. service_role bypasses RLS.

-- 0006_contact_rate_limit.sql
-- Durable rate limit shared by all Vercel instances; stores only keyed hashes.
create table if not exists public.contact_rate_limits (
  key_hash text primary key,
  window_start timestamptz not null,
  attempts integer not null check (attempts > 0)
);
alter table public.contact_rate_limits enable row level security;
revoke all on public.contact_rate_limits from anon, authenticated;

create or replace function public.consume_contact_attempt(p_key text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare attempt_count integer;
begin
  if p_key !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid rate limit key';
  end if;
  delete from public.contact_rate_limits where window_start < now() - interval '2 hours';
  insert into public.contact_rate_limits as limits (key_hash, window_start, attempts)
  values (p_key, now(), 1)
  on conflict (key_hash) do update set
    attempts = case when limits.window_start <= now() - interval '1 hour' then 1 else least(limits.attempts + 1, 6) end,
    window_start = case when limits.window_start <= now() - interval '1 hour' then now() else limits.window_start end
  returning attempts into attempt_count;
  return attempt_count <= 5;
end;
$$;
revoke all on function public.consume_contact_attempt(text) from public, anon, authenticated;
grant execute on function public.consume_contact_attempt(text) to service_role;

-- 0007_analytics_view_identity.sql
-- One row per page visit, updated on SPA navigation/pagehide.
alter table public.analytics_events add column if not exists view_id uuid;
create unique index if not exists analytics_events_view_id on public.analytics_events(view_id);

-- 0008_resume_cms.sql
-- Additive single-owner resume CMS. Writes are server-only (service_role).
create table public.resume_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('EXPERIENCE','SKILL','EDUCATION','CERTIFICATION','SERVICE')),
  title jsonb not null, subtitle jsonb not null default '{"vi":"","en":""}',
  body jsonb not null default '{"vi":"","en":""}', tools text[] not null default '{}',
  start_date text, end_date text, is_current boolean not null default false,
  logo_url text, evidence_url text, project_slug text,
  status public.content_status not null default 'DRAFT', sort_order integer not null default 0 check(sort_order >= 0),
  updated_at timestamptz not null default now(), created_at timestamptz not null default now(),
  check (start_date is null or start_date ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  check (end_date is null or (start_date is not null and end_date ~ '^\d{4}-(0[1-9]|1[0-2])$' and end_date >= start_date)),
  check (not is_current or (start_date is not null and end_date is null))
);
create index resume_entries_public_order on public.resume_entries(status, kind, sort_order, id);
create index resume_entries_owner on public.resume_entries(owner_id, kind);
alter table public.resume_entries enable row level security;
create policy "public reads published resume" on public.resume_entries for select using(status = 'PUBLISHED');
alter table public.media_assets add column if not exists original_name text not null default '';
alter table public.projects add column if not exists image_fit text not null default 'cover' check(image_fit in ('cover','contain'));
alter table public.site_profile add column if not exists resume_asset_id uuid references public.media_assets(id) on delete restrict;
-- Limit public storage to supported formats. Files are intentionally public portfolio assets.
update storage.buckets set file_size_limit = 4194304, allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','application/pdf'] where id = 'portfolio-media';

create or replace function public.media_reference_count(asset_url text, actor_id uuid)
returns bigint language sql stable security invoker set search_path = public as $$
  select
    (select count(*) from site_profile where owner_id = actor_id and (image_url = asset_url or resume_url = asset_url)) +
    (select count(*) from projects where owner_id = actor_id and (image_url = asset_url or strpos(gallery::text, asset_url) > 0 or strpos(content::text, asset_url) > 0)) +
    (select count(*) from articles where owner_id = actor_id and (cover_url = asset_url or strpos(body::text, asset_url) > 0)) +
    (select count(*) from lab_items where owner_id = actor_id and cover_image = asset_url) +
    (select count(*) from resume_entries where owner_id = actor_id and (logo_url = asset_url or evidence_url = asset_url or strpos(body::text, asset_url) > 0));
$$;
revoke all on function public.media_reference_count(text, uuid) from public, anon, authenticated;
grant execute on function public.media_reference_count(text, uuid) to service_role;

COMMIT;

-- Verify row-level security and the empty journal after successful commit.
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
SELECT count(*) AS article_count FROM public.articles;

