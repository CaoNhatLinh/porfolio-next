-- One row per page visit, updated on SPA navigation/pagehide.
alter table public.analytics_events add column if not exists view_id uuid;
create unique index if not exists analytics_events_view_id on public.analytics_events(view_id);
