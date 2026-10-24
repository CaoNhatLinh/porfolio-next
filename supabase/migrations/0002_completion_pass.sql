-- Completion pass: additive CMS fields. Safe to run after 0001_initial.sql.
alter table public.site_profile add column if not exists location text;
alter table public.site_profile add column if not exists availability jsonb not null default '{}'::jsonb;
alter table public.site_profile add column if not exists socials jsonb not null default '[]'::jsonb;
alter table public.site_profile add column if not exists resume_url text;

alter table public.projects add column if not exists gallery jsonb not null default '[]'::jsonb;

create index if not exists projects_owner_sort_order on public.projects(owner_id, sort_order, featured_order);
