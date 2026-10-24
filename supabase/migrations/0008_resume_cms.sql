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
