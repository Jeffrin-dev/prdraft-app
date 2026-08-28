-- Idempotent GitHub webhook delivery tracking.
create table if not exists public.webhook_deliveries (
  delivery_id text primary key,
  received_at timestamptz not null default now(),
  status text not null default 'processing' check (status in ('processing', 'done', 'failed')),
  completed_at timestamptz
);

create index if not exists webhook_deliveries_received_at_idx
  on public.webhook_deliveries (received_at desc);

-- A pull request should only be counted once per installation and repository.
create unique index if not exists pr_events_installation_repo_pr_unique
  on public.pr_events (installation_id, repo_full_name, pr_number);

-- Atomic server-side write: insert the durable PR event first, then increment the
-- denormalized counter only when that insert actually created a new row.
create or replace function public.record_pr_event_and_increment(
  p_installation_id bigint,
  p_repo_full_name text,
  p_pr_number integer,
  p_pr_title text
)
returns table(inserted boolean, pr_count integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.pr_events (installation_id, repo_full_name, pr_number, pr_title)
  values (p_installation_id, p_repo_full_name, p_pr_number, p_pr_title)
  on conflict (installation_id, repo_full_name, pr_number) do nothing;

  if found then
    update public.installs
       set pr_count = coalesce(public.installs.pr_count, 0) + 1
     where public.installs.installation_id = p_installation_id
     returning public.installs.pr_count into pr_count;

    inserted := true;
    return next;
    return;
  end if;

  select coalesce(public.installs.pr_count, 0)
    into pr_count
    from public.installs
   where public.installs.installation_id = p_installation_id;

  inserted := false;
  return next;
end;
$$;

-- Manual backfill/correction query. Review and run manually when ready.
-- update public.installs i
--    set pr_count = coalesce(actual.actual_count, 0)
--   from (
--     select i2.installation_id, count(pe.id)::integer as actual_count
--       from public.installs i2
--       left join public.pr_events pe
--         on pe.installation_id = i2.installation_id
--      group by i2.installation_id
--   ) actual
--  where actual.installation_id = i.installation_id;
