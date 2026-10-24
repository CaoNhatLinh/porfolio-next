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
