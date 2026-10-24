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
