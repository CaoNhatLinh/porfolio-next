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
