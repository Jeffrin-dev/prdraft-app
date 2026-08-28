-- Serialize each installation's usage check and write so simultaneous webhook
-- deliveries cannot both claim the final free-tier slot.
drop function if exists public.record_pr_event_and_increment(bigint, text, integer, text);

create function public.record_pr_event_and_increment(
  p_installation_id bigint,
  p_repo_full_name text,
  p_pr_number integer,
  p_pr_title text
)
returns table(inserted boolean, pr_count integer, reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_event_count integer;
  v_free_tier_pr_limit constant integer := 10;
begin
  -- Lock the installation row before counting. Every invocation for this
  -- installation consequently observes the event written by the prior one.
  select i.plan
    into v_plan
    from public.installs i
   where i.installation_id = p_installation_id
   for update;

  if not found then
    raise exception 'Installation % not found', p_installation_id;
  end if;

  select count(*)::integer
    into v_event_count
    from public.pr_events pe
   where pe.installation_id = p_installation_id;

  if v_plan = 'free' and v_event_count >= v_free_tier_pr_limit then
    inserted := false;
    pr_count := v_event_count;
    reason := 'cap_exceeded';
    return next;
    return;
  end if;

  insert into public.pr_events (installation_id, repo_full_name, pr_number, pr_title)
  values (p_installation_id, p_repo_full_name, p_pr_number, p_pr_title)
  on conflict (installation_id, repo_full_name, pr_number) do nothing;

  if found then
    update public.installs
       set pr_count = coalesce(public.installs.pr_count, 0) + 1
     where public.installs.installation_id = p_installation_id
     returning public.installs.pr_count into pr_count;

    inserted := true;
    reason := 'inserted';
    return next;
    return;
  end if;

  inserted := false;
  pr_count := v_event_count;
  reason := 'already_recorded';
  return next;
end;
$$;
