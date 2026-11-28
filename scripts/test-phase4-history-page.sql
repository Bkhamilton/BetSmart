\set ON_ERROR_STOP on

DO $$
BEGIN
  IF current_database() <> 'betsmart_phase4_history_test' THEN
    RAISE EXCEPTION 'This test requires the disposable betsmart_phase4_history_test database.';
  END IF;
END
$$;

BEGIN;
INSERT INTO auth.users (id) VALUES
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002');

-- Seed synthetic records as the disposable test database owner. The history
-- triggers create their change-feed events; RPC reads below run as authenticated.
INSERT INTO public.bs_user_bookies (id, user_id, display_name)
VALUES (
  '30000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  'Account sportsbook'
);
INSERT INTO public.bs_bet_slips (
  id, user_id, user_bookie_id, stake, decimal_odds, currency_code, bet_format,
  status, payout, placed_at, settled_at, legacy_format_id, legacy_bookie_id,
  odds_snapshot, legacy_result, legacy_result_at, bookie_display_name_snapshot
) VALUES (
  '20000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  12.30, 2.100000, 'USD', 'Single', 'won', 25.83,
  '2026-11-20T12:00:00Z', '2026-11-20T14:00:00Z',
  9223372036854775806, 9223372036854775805, '+110', 1,
  '2026-11-20T14:00:00Z', 'Placed sportsbook name'
);
INSERT INTO public.bs_participant_bets (
  id, user_id, bet_slip_id, game_reference_id, decimal_odds, status,
  odds_snapshot, sport_snapshot, home_team_snapshot, away_team_snapshot,
  legacy_result, legacy_result_at, game_date_snapshot, league_snapshot,
  home_team_abbreviation_snapshot, away_team_abbreviation_snapshot
) VALUES (
  '20000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  'provider-game-a', 2.000000, 'won', '+100', 'Synthetic sport',
  'Synthetic home', 'Synthetic away', 1, '2026-11-20T14:00:00Z',
  '2026-11-20T13:00:00Z', 'Synthetic league', 'HOM', 'AWY'
);
INSERT INTO public.bs_bet_legs (
  id, user_id, participant_bet_id, market_reference_id,
  selection_description, odds_at_placement, line_at_placement, status,
  legacy_market_id, legacy_bet_type_id, market_type_snapshot,
  market_value_snapshot, odds_snapshot, over_under_snapshot,
  target_name_snapshot, target_type_snapshot, legacy_target_id,
  bookie_reference_id, legacy_result, legacy_result_at, bet_type_snapshot
) VALUES (
  '20000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  'provider-market-a', 'Synthetic player over 20.5 points',
  1.910000, 20.5000, 'won', 9223372036854775804,
  9223372036854775803, 'player points', 'original market value',
  '+110', 'over', 'Synthetic player', 'player',
  9223372036854775802, 9223372036854775801, 1, '2026-11-20T14:00:00Z',
  'Player points'
);
INSERT INTO public.bs_bet_slips (id, user_id, stake, placed_at)
VALUES (
  '20000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000002',
  5.00,
  '2026-11-21T00:00:00Z'
);

SET LOCAL ROLE authenticated;
SELECT pg_catalog.set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
DECLARE
  user_a uuid := '00000000-0000-4000-8000-000000000001';
  user_b uuid := '00000000-0000-4000-8000-000000000002';
  page jsonb;
  next_page jsonb;
  other_page jsonb;
  row_json jsonb;
  first_change_id bigint;
  latest_change_id bigint;
BEGIN
  page := public.bs_get_sync_history_page(user_a, 0, 2);
  IF page->>'cloud_user_id' <> user_a::text
     OR jsonb_array_length(page->'changes') <> 2 THEN
    RAISE EXCEPTION 'The first page has an invalid owner or page size.';
  END IF;
  IF page->'changes'->0->>'entity_type' <> 'bet_slip'
     OR page->'changes'->1->>'entity_type' <> 'participant_bet' THEN
    RAISE EXCEPTION 'The page is not ordered by the global change cursor.';
  END IF;
  first_change_id := (page->'changes'->0->>'change_id')::bigint;
  latest_change_id := (page->'changes'->1->>'change_id')::bigint;
  IF first_change_id >= latest_change_id
     OR jsonb_typeof(page->'changes'->0->'change_id') <> 'string'
     OR jsonb_typeof(page->'changes'->0->'revision') <> 'string' THEN
    RAISE EXCEPTION 'Cursor and revision values must be ordered strings.';
  END IF;

  row_json := page->'changes'->0->'record';
  IF row_json->>'id' <> '20000000-0000-4000-8000-000000000001'
     OR row_json->>'user_id' <> user_a::text
     OR row_json->>'stake' <> '12.30'
     OR jsonb_typeof(row_json->'stake') <> 'string'
     OR row_json->>'payout' <> '25.83'
     OR jsonb_typeof(row_json->'decimal_odds') <> 'string'
     OR row_json->>'legacy_format_id' <> '9223372036854775806'
     OR row_json->>'legacy_bookie_id' <> '9223372036854775805'
     OR row_json->>'bookie_display_name_snapshot' <> 'Placed sportsbook name'
     OR row_json->>'bookie_display_name' <> 'Placed sportsbook name' THEN
    RAISE EXCEPTION 'Slip record fields, precise numbers, or sportsbook display snapshot were not preserved.';
  END IF;

  row_json := page->'changes'->1->'record';
  IF row_json->>'game_date_snapshot' <> '2026-11-20T13:00:00Z'
     OR row_json->>'league_snapshot' <> 'Synthetic league'
     OR row_json->>'home_team_abbreviation_snapshot' <> 'HOM'
     OR row_json->>'away_team_abbreviation_snapshot' <> 'AWY'
     OR row_json->>'decimal_odds' <> '2.000000'
     OR jsonb_typeof(row_json->'decimal_odds') <> 'string' THEN
    RAISE EXCEPTION 'Participant snapshot fields or exact decimal values were not preserved.';
  END IF;

  next_page := public.bs_get_sync_history_page(user_a, latest_change_id, 100);
  IF jsonb_array_length(next_page->'changes') <> 1
     OR next_page->'changes'->0->>'entity_type' <> 'bet_leg' THEN
    RAISE EXCEPTION 'Cursor pagination did not return the remaining leg.';
  END IF;
  latest_change_id := (next_page->'changes'->0->>'change_id')::bigint;
  row_json := next_page->'changes'->0->'record';
  IF row_json->>'selection_description' <> 'Synthetic player over 20.5 points'
     OR row_json->>'market_value_snapshot' <> 'original market value'
     OR row_json->>'bet_type_snapshot' <> 'Player points'
     OR row_json->>'odds_at_placement' <> '1.910000'
     OR jsonb_typeof(row_json->'odds_at_placement') <> 'string'
     OR row_json->>'line_at_placement' <> '20.5000'
     OR jsonb_typeof(row_json->'line_at_placement') <> 'string'
     OR row_json->>'legacy_market_id' <> '9223372036854775804' THEN
    RAISE EXCEPTION 'Leg snapshots or exact numeric/reference values were not preserved.';
  END IF;

  other_page := public.bs_get_sync_history_page(user_a, 9223372036854775807, 100);
  IF jsonb_array_length(other_page->'changes') <> 0 THEN
    RAISE EXCEPTION 'An empty page should return an empty changes array.';
  END IF;

  BEGIN
    PERFORM public.bs_get_sync_history_page(user_b, 0, 100);
    RAISE EXCEPTION 'A mismatched expected cloud user was accepted.';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;

  BEGIN
    PERFORM public.bs_get_sync_history_page(user_a, 0, 0);
    RAISE EXCEPTION 'A zero page limit was accepted.';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM NOT LIKE '%Invalid sync cursor or page size%' THEN RAISE; END IF;
  END;

  PERFORM pg_catalog.set_config('request.jwt.claim.sub', user_b::text, true);
  other_page := public.bs_get_sync_history_page(user_b, 0, 100);
  IF other_page->>'cloud_user_id' <> user_b::text
     OR jsonb_array_length(other_page->'changes') <> 1
     OR other_page->'changes'->0->'record'->>'user_id' <> user_b::text THEN
    RAISE EXCEPTION 'One authenticated user received another owner''s history.';
  END IF;
  PERFORM pg_catalog.set_config('request.jwt.claim.sub', user_a::text, true);

  IF has_function_privilege('anon', 'public.bs_get_sync_history_page(uuid,bigint,integer)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Anonymous users can execute the history page RPC.';
  END IF;
  IF NOT has_function_privilege('authenticated', 'public.bs_get_sync_history_page(uuid,bigint,integer)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Authenticated users cannot execute the history page RPC.';
  END IF;
  IF (SELECT provolatile FROM pg_catalog.pg_proc
      WHERE oid = 'public.bs_get_sync_history_page(uuid,bigint,integer)'::regprocedure) <> 's' THEN
    RAISE EXCEPTION 'History page must be STABLE to use one statement snapshot.';
  END IF;
END
$$;

RESET ROLE;
UPDATE public.bs_bet_legs SET deleted_at = clock_timestamp()
WHERE id = '20000000-0000-4000-8000-000000000003';
UPDATE public.bs_participant_bets SET deleted_at = clock_timestamp()
WHERE id = '20000000-0000-4000-8000-000000000002';
UPDATE public.bs_bet_slips SET deleted_at = clock_timestamp()
WHERE id = '20000000-0000-4000-8000-000000000001';

SELECT pg_catalog.set_config(
  'betsmart.last_live_change',
  (SELECT max(change_id)::text
   FROM public.bs_sync_change_log
   WHERE user_id = '00000000-0000-4000-8000-000000000001'
     AND revision = 1),
  true
);
SET LOCAL ROLE authenticated;
SELECT pg_catalog.set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
DO $$
DECLARE
  user_a uuid := '00000000-0000-4000-8000-000000000001';
  last_live_change bigint;
  tombstone_page jsonb;
BEGIN
  last_live_change := current_setting('betsmart.last_live_change')::bigint;
  tombstone_page := public.bs_get_sync_history_page(user_a, last_live_change, 100);
  IF jsonb_array_length(tombstone_page->'changes') <> 3
     OR (SELECT count(*) FROM jsonb_array_elements(tombstone_page->'changes') AS events(value)
         WHERE value->>'deleted_at' IS NOT NULL AND value->'record' = 'null'::jsonb) <> 3 THEN
    RAISE EXCEPTION 'Soft-deletion tombstones were not represented without live records.';
  END IF;
END
$$;

RESET ROLE;
SELECT pg_catalog.set_config('request.jwt.claim.sub', '', true);
DO $$
BEGIN
  BEGIN
    PERFORM public.bs_get_sync_history_page(
      '00000000-0000-4000-8000-000000000001',
      0,
      100
    );
    RAISE EXCEPTION 'An unauthenticated history page request was accepted.';
  EXCEPTION WHEN invalid_authorization_specification THEN
    NULL;
  END;
END
$$;

ROLLBACK;
