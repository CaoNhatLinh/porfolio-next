-- Back up resume entries and CV selection before using this rollback.
drop function if exists public.media_reference_count(text, uuid);
alter table public.site_profile drop column if exists resume_asset_id;
alter table public.media_assets drop column if exists original_name;
alter table public.projects drop column if exists image_fit;
drop table if exists public.resume_entries;
update storage.buckets set file_size_limit = null, allowed_mime_types = null where id = 'portfolio-media';
