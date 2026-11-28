-- Phase 4 aggregate contract.
-- One RPC call is one complete bet-slip aggregate. The client includes
-- bet_slip_cloud_id and parent_cloud_id as transport-only payload markers;
-- they are validated here and stripped before the immutable row request hash.

CREATE OR REPLACE FUNCTION public.bs_apply_sync_batch(p_operations jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_operation jsonb;
  v_operation_id uuid;
  v_entity_id uuid;
  v_root_id uuid;
  v_aggregate_id uuid;
  v_parent_id uuid;
  v_parent_root_id uuid;
  v_entity_type text;
  v_action text;
  v_expected_revision bigint;
  v_payload jsonb;
  v_response jsonb;
  v_responses jsonb := '[]'::jsonb;
  v_seen_ids uuid[] := ARRAY[]::uuid[];
  v_live_children boolean;
  v_has_receipt boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '28000';
  END IF;
  IF jsonb_typeof(p_operations) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Sync aggregate must be an array.';
  END IF;
  IF jsonb_array_length(p_operations) NOT BETWEEN 1 AND 500 THEN
    RAISE EXCEPTION 'Sync aggregate must contain between 1 and 500 operations.';
  END IF;

  -- Validate the complete request envelope and enforce one aggregate per RPC
  -- before acquiring its transaction-scoped lock.
  FOR v_operation IN SELECT value FROM pg_catalog.jsonb_array_elements(p_operations)
  LOOP
    IF jsonb_typeof(v_operation) IS DISTINCT FROM 'object'
       OR NOT (v_operation ?& ARRAY[
         'operation_id', 'entity_type', 'entity_id', 'action', 'expected_revision', 'payload'
       ])
       OR (SELECT count(*) FROM pg_catalog.jsonb_object_keys(v_operation)) <> 6
       OR jsonb_typeof(v_operation->'payload') IS DISTINCT FROM 'object'
       OR jsonb_typeof(v_operation->'expected_revision') IS DISTINCT FROM 'number' THEN
      RAISE EXCEPTION 'Invalid sync aggregate operation.';
    END IF;

    v_operation_id := (v_operation->>'operation_id')::uuid;
    v_entity_id := (v_operation->>'entity_id')::uuid;
    v_entity_type := v_operation->>'entity_type';
    v_action := v_operation->>'action';
    v_expected_revision := (v_operation->>'expected_revision')::bigint;
    IF v_operation_id IS NULL OR v_entity_id IS NULL
       OR v_action NOT IN ('upsert', 'delete')
       OR v_expected_revision < 0
       OR v_operation_id = ANY(v_seen_ids) THEN
      RAISE EXCEPTION 'Invalid or duplicate sync aggregate operation.';
    END IF;
    v_seen_ids := pg_catalog.array_append(v_seen_ids, v_operation_id);

    IF (v_operation->'payload'->>'user_id')::uuid IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Payload owner does not match the authenticated user.'
        USING ERRCODE = '42501';
    END IF;
    v_root_id := (v_operation->'payload'->>'bet_slip_cloud_id')::uuid;
    IF v_root_id IS NULL THEN
      RAISE EXCEPTION 'Operation is missing immutable bet_slip_cloud_id.';
    END IF;
    IF v_aggregate_id IS NULL THEN
      v_aggregate_id := v_root_id;
    ELSIF v_aggregate_id IS DISTINCT FROM v_root_id THEN
      RAISE EXCEPTION 'A sync RPC must contain exactly one complete bet-slip aggregate.';
    END IF;
  END LOOP;

  -- Every writer for this account/slip goes through this function, so a child
  -- insertion cannot race the final no-live-child check of a parent deletion.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text || ':' || v_aggregate_id::text, 52053)
  );

  FOR v_operation IN SELECT value FROM pg_catalog.jsonb_array_elements(p_operations)
  LOOP
    v_operation_id := (v_operation->>'operation_id')::uuid;
    v_entity_id := (v_operation->>'entity_id')::uuid;
    v_entity_type := v_operation->>'entity_type';
    v_action := v_operation->>'action';
    v_expected_revision := (v_operation->>'expected_revision')::bigint;
    v_payload := (v_operation->'payload') - 'bet_slip_cloud_id' - 'parent_cloud_id';
    SELECT EXISTS (
      SELECT 1
      FROM public.bs_sync_operations AS receipt
      WHERE receipt.user_id = v_user_id
        AND receipt.operation_id = v_operation_id
    )
    INTO v_has_receipt;

    IF v_entity_type = 'bet_slip' THEN
      IF v_entity_id IS DISTINCT FROM v_aggregate_id THEN
        RAISE EXCEPTION 'Bet-slip entity does not match the aggregate root.';
      END IF;
    ELSIF v_entity_type = 'participant_bet' THEN
      IF v_action = 'upsert' AND v_payload ? 'bet_slip_id' THEN
        v_parent_id := (v_payload->>'bet_slip_id')::uuid;
      ELSE
        SELECT participant.bet_slip_id
        INTO v_parent_id
        FROM public.bs_participant_bets AS participant
        WHERE participant.id = v_entity_id
          AND participant.user_id = v_user_id;
      END IF;
      IF v_parent_id IS DISTINCT FROM v_aggregate_id THEN
        RAISE EXCEPTION 'Participant parent does not match the aggregate root.'
          USING ERRCODE = '23514';
      END IF;
      IF (v_operation->'payload'->>'parent_cloud_id')::uuid IS DISTINCT FROM v_parent_id THEN
        RAISE EXCEPTION 'Participant parent marker does not match its stored parent.'
          USING ERRCODE = '23514';
      END IF;
      IF v_action = 'upsert' AND NOT v_has_receipt AND NOT EXISTS (
        SELECT 1 FROM public.bs_bet_slips AS slip
        WHERE slip.id = v_aggregate_id
          AND slip.user_id = v_user_id
          AND slip.deleted_at IS NULL
      ) THEN
        RAISE EXCEPTION 'Cannot upsert a participant under a missing or deleted slip.'
          USING ERRCODE = '23514';
      END IF;
    ELSIF v_entity_type = 'bet_leg' THEN
      IF v_action = 'upsert' AND v_payload ? 'participant_bet_id' THEN
        v_parent_id := (v_payload->>'participant_bet_id')::uuid;
      ELSE
        SELECT leg.participant_bet_id
        INTO v_parent_id
        FROM public.bs_bet_legs AS leg
        WHERE leg.id = v_entity_id
          AND leg.user_id = v_user_id;
      END IF;
      SELECT participant.bet_slip_id, participant.deleted_at IS NULL
      INTO v_parent_root_id, v_live_children
      FROM public.bs_participant_bets AS participant
      WHERE participant.id = v_parent_id
        AND participant.user_id = v_user_id;
      IF v_parent_root_id IS DISTINCT FROM v_aggregate_id THEN
        RAISE EXCEPTION 'Leg parent does not match the aggregate root.'
          USING ERRCODE = '23514';
      END IF;
      IF (v_operation->'payload'->>'parent_cloud_id')::uuid IS DISTINCT FROM v_parent_id THEN
        RAISE EXCEPTION 'Leg parent marker does not match its stored parent.'
          USING ERRCODE = '23514';
      END IF;
      IF v_action = 'upsert' AND NOT v_has_receipt
         AND (v_live_children IS DISTINCT FROM TRUE OR NOT EXISTS (
           SELECT 1 FROM public.bs_bet_slips AS slip
           WHERE slip.id = v_aggregate_id
             AND slip.user_id = v_user_id
             AND slip.deleted_at IS NULL
         )) THEN
        RAISE EXCEPTION 'Cannot upsert a leg under a missing or deleted parent.'
          USING ERRCODE = '23514';
      END IF;
    ELSE
      RAISE EXCEPTION 'Unsupported sync entity type.';
    END IF;

    v_response := public.bs_apply_sync_change(
      v_operation_id,
      v_entity_type,
      v_entity_id,
      v_action,
      v_expected_revision,
      v_payload
    );
    v_responses := v_responses || pg_catalog.jsonb_build_array(v_response);
  END LOOP;

  -- A soft deletion is legal only if this same SQL transaction tombstoned all
  -- descendants. Composite FKs alone do not reject live children of tombstones.
  IF EXISTS (
    SELECT 1
    FROM public.bs_bet_slips AS slip
    JOIN public.bs_participant_bets AS participant
      ON participant.user_id = slip.user_id
     AND participant.bet_slip_id = slip.id
    WHERE slip.id = v_aggregate_id
      AND slip.user_id = v_user_id
      AND slip.deleted_at IS NOT NULL
      AND participant.deleted_at IS NULL
  ) OR EXISTS (
    SELECT 1
    FROM public.bs_participant_bets AS participant
    JOIN public.bs_bet_legs AS leg
      ON leg.user_id = participant.user_id
     AND leg.participant_bet_id = participant.id
    WHERE participant.user_id = v_user_id
      AND participant.bet_slip_id = v_aggregate_id
      AND participant.deleted_at IS NOT NULL
      AND leg.deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Aggregate deletion would leave a live child under a tombstoned parent.'
      USING ERRCODE = '23514';
  END IF;

  RETURN v_responses;
END
$$;

-- The guarded aggregate RPC is the only authenticated write path.
REVOKE ALL ON FUNCTION public.bs_apply_sync_change(uuid, text, uuid, text, bigint, jsonb)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.bs_apply_sync_batch(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bs_apply_sync_batch(jsonb) TO authenticated;
