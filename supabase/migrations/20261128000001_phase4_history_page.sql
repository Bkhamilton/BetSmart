-- Phase 4: return an authenticated, snapshot-consistent page of history.
-- Apply after 20261127000000_phase4_atomic_sync_batch.sql.
--
-- Records are the current row images visible in the same PostgreSQL statement
-- snapshot as the change-log page. The record's revision may be newer than the
-- particular feed event if that entity changed again before this page snapshot;
-- subsequent feed entries remain safe to replay by UUID/revision.
CREATE OR REPLACE FUNCTION public.bs_get_sync_history_page(
  p_expected_user_id uuid,
  p_after bigint,
  p_limit integer DEFAULT 100
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_changes jsonb;
  v_missing_count bigint;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.'
      USING ERRCODE = '28000';
  END IF;
  IF p_expected_user_id IS NULL OR p_expected_user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'Expected cloud user does not match the authenticated user.'
      USING ERRCODE = '42501';
  END IF;
  IF p_after IS NULL OR p_after < 0 OR p_limit IS NULL OR p_limit < 1 THEN
    RAISE EXCEPTION 'Invalid sync cursor or page size.';
  END IF;

  -- This is one SELECT in a STABLE function, so the ordered log page and every
  -- joined row image share the calling statement's MVCC snapshot. All joins
  -- constrain user_id explicitly because this SECURITY DEFINER function
  -- intentionally bypasses the caller's table RLS policies.
  WITH page AS MATERIALIZED (
    SELECT
      log.change_id,
      log.entity_type,
      log.entity_id,
      log.revision,
      log.deleted_at
    FROM public.bs_sync_change_log AS log
    WHERE log.user_id = v_user_id
      AND log.change_id > p_after
    ORDER BY log.change_id
    LIMIT LEAST(p_limit, 500)
  ),
  hydrated AS MATERIALIZED (
    SELECT
      page.change_id,
      page.entity_type,
      page.entity_id,
      page.revision,
      page.deleted_at,
      CASE
        WHEN page.deleted_at IS NOT NULL THEN NULL::jsonb
        WHEN page.entity_type = 'bet_slip' AND slip.id IS NOT NULL THEN
          to_jsonb(slip) || pg_catalog.jsonb_build_object(
            'stake', slip.stake::text,
            'payout', slip.payout::text,
            'decimal_odds', slip.decimal_odds::text,
            'legacy_format_id', slip.legacy_format_id::text,
            'legacy_bookie_id', slip.legacy_bookie_id::text,
            'revision', slip.revision::text,
            'bookie_display_name',
              COALESCE(
                NULLIF(to_jsonb(slip)->>'bookie_display_name_snapshot', ''),
                bookie.display_name
              )
          )
        WHEN page.entity_type = 'participant_bet' AND participant.id IS NOT NULL THEN
          to_jsonb(participant) || pg_catalog.jsonb_build_object(
            'decimal_odds', participant.decimal_odds::text,
            'revision', participant.revision::text
          )
        WHEN page.entity_type = 'bet_leg' AND leg.id IS NOT NULL THEN
          to_jsonb(leg) || pg_catalog.jsonb_build_object(
            'odds_at_placement', leg.odds_at_placement::text,
            'line_at_placement', leg.line_at_placement::text,
            'legacy_market_id', leg.legacy_market_id::text,
            'legacy_bet_type_id', leg.legacy_bet_type_id::text,
            'legacy_target_id', leg.legacy_target_id::text,
            'bookie_reference_id', leg.bookie_reference_id::text,
            'revision', leg.revision::text
          )
        ELSE NULL::jsonb
      END AS record
    FROM page
    LEFT JOIN public.bs_bet_slips AS slip
      ON page.entity_type = 'bet_slip'
     AND slip.id = page.entity_id
     AND slip.user_id = v_user_id
    LEFT JOIN public.bs_user_bookies AS bookie
      ON bookie.id = slip.user_bookie_id
     AND bookie.user_id = v_user_id
    LEFT JOIN public.bs_participant_bets AS participant
      ON page.entity_type = 'participant_bet'
     AND participant.id = page.entity_id
     AND participant.user_id = v_user_id
    LEFT JOIN public.bs_bet_legs AS leg
      ON page.entity_type = 'bet_leg'
     AND leg.id = page.entity_id
     AND leg.user_id = v_user_id
  )
  SELECT
    COALESCE(
      pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object(
          'change_id', hydrated.change_id::text,
          'entity_type', hydrated.entity_type,
          'entity_id', hydrated.entity_id,
          'revision', hydrated.revision::text,
          'deleted_at', hydrated.deleted_at,
          'record', hydrated.record
        )
        ORDER BY hydrated.change_id
      ),
      '[]'::jsonb
    ),
    count(*) FILTER (
      WHERE hydrated.deleted_at IS NULL
        AND hydrated.record IS NULL
    )
  INTO v_changes, v_missing_count
  FROM hydrated;

  IF v_missing_count > 0 THEN
    RAISE EXCEPTION 'A live history change has no current owned record; refusing an incomplete page.';
  END IF;

  RETURN pg_catalog.jsonb_build_object(
    'cloud_user_id', v_user_id,
    'changes', v_changes
  );
END
$$;

REVOKE ALL ON FUNCTION public.bs_get_sync_history_page(uuid, bigint, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bs_get_sync_history_page(uuid, bigint, integer)
  TO authenticated;
