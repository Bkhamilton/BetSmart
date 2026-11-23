-- Apply once to the target Supabase database before running the service.
create or replace function public.refresh_game_markets(
  p_game jsonb,
  p_target_name text,
  p_markets jsonb
)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_game public."Games";
  v_target_id public."BetTargets".id%type;
  v_count integer;
begin
  if jsonb_typeof(p_game) <> 'object' or jsonb_typeof(p_markets) <> 'array'
     or jsonb_array_length(p_markets) = 0 or p_target_name is null then
    raise exception 'Invalid market refresh input';
  end if;

  v_game := jsonb_populate_record(null::public."Games", p_game);
  if v_game."gameId" is null then
    raise exception 'Missing game id';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_game."gameId"));

  if exists (
    select 1 from jsonb_populate_recordset(null::public."BetMarkets", p_markets) m
    where m."gameId" is distinct from v_game."gameId"
       or m."marketType" not in ('moneyline', 'spread', 'totals')
       or m."marketType" is null or m."bookieId" is null
       or (m."marketType" <> 'totals' and m."betTargetId" is null)
  ) then
    raise exception 'Invalid market rows';
  end if;

  if not exists (select 1 from public."Games" where "gameId" = v_game."gameId") then
    insert into public."Games" ("gameId", "seasonId", date, timestamp, "homeTeamId", "awayTeamId")
    values (v_game."gameId", v_game."seasonId", v_game.date, v_game.timestamp, v_game."homeTeamId", v_game."awayTeamId");
  end if;

  begin
    select id into strict v_target_id from public."BetTargets"
    where "gameId" = v_game."gameId" and "targetType" = 'Game';
  exception when no_data_found then
    insert into public."BetTargets" ("targetType", "targetName", "teamId", "gameId")
    values ('Game', p_target_name, null, v_game."gameId") returning id into v_target_id;
  end;

  delete from public."BetMarkets" old
  where old."gameId" = v_game."gameId"
    and exists (
      select 1 from jsonb_populate_recordset(null::public."BetMarkets", p_markets) m
      where m."marketType" = old."marketType" and m."bookieId" = old."bookieId"
    );

  insert into public."BetMarkets" ("gameId", "marketType", timestamp, value, odds, "overUnder", "betTargetId", "bookieId")
  select m."gameId", m."marketType", m.timestamp, m.value, m.odds, m."overUnder",
    case when m."marketType" = 'totals' then v_target_id else m."betTargetId" end, m."bookieId"
  from jsonb_populate_recordset(null::public."BetMarkets", p_markets) m;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.refresh_game_markets(jsonb, text, jsonb) from public, anon, authenticated;
grant execute on function public.refresh_game_markets(jsonb, text, jsonb) to service_role;
