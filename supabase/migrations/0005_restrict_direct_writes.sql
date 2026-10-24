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
