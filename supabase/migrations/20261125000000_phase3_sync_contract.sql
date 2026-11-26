-- Phase 3: preserve the legacy betting fields and define a guarded sync contract.
-- Apply only after reviewing the target project and its migration history.

ALTER TABLE public.bs_bet_slips
  ALTER COLUMN stake TYPE numeric USING stake::numeric,
  ALTER COLUMN payout TYPE numeric USING payout::numeric,
  ADD COLUMN IF NOT EXISTS legacy_format_id bigint,
  ADD COLUMN IF NOT EXISTS legacy_bookie_id bigint,
  ADD COLUMN IF NOT EXISTS odds_snapshot text,
  ADD COLUMN IF NOT EXISTS legacy_result_at timestamptz,
  ADD COLUMN IF NOT EXISTS legacy_result smallint
    CHECK (legacy_result IS NULL OR legacy_result IN (-1, 0, 1));

ALTER TABLE public.bs_participant_bets
  ADD COLUMN IF NOT EXISTS odds_snapshot text,
  ADD COLUMN IF NOT EXISTS sport_snapshot text,
  ADD COLUMN IF NOT EXISTS home_team_snapshot text,
  ADD COLUMN IF NOT EXISTS away_team_snapshot text,
  ADD COLUMN IF NOT EXISTS legacy_result_at timestamptz,
  ADD COLUMN IF NOT EXISTS legacy_result smallint
    CHECK (legacy_result IS NULL OR legacy_result IN (-1, 0, 1));

ALTER TABLE public.bs_bet_legs
  ADD COLUMN IF NOT EXISTS legacy_market_id bigint,
  ADD COLUMN IF NOT EXISTS legacy_bet_type_id bigint,
  ADD COLUMN IF NOT EXISTS market_type_snapshot text,
  ADD COLUMN IF NOT EXISTS market_value_snapshot text,
  ADD COLUMN IF NOT EXISTS odds_snapshot text,
  ADD COLUMN IF NOT EXISTS over_under_snapshot text,
  ADD COLUMN IF NOT EXISTS target_name_snapshot text,
  ADD COLUMN IF NOT EXISTS target_type_snapshot text,
  ADD COLUMN IF NOT EXISTS legacy_target_id bigint,
  ADD COLUMN IF NOT EXISTS bookie_reference_id bigint,
  ADD COLUMN IF NOT EXISTS legacy_result_at timestamptz,
  ADD COLUMN IF NOT EXISTS legacy_result smallint
    CHECK (legacy_result IS NULL OR legacy_result IN (-1, 0, 1));

CREATE TABLE public.bs_sync_operations (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_id uuid NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('upsert', 'delete')),
  expected_revision bigint NOT NULL CHECK (expected_revision >= 0),
  request_hash text NOT NULL,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, operation_id)
);

CREATE TABLE public.bs_sync_change_log (
  change_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  revision bigint NOT NULL,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bs_sync_change_log_owner_cursor
  ON public.bs_sync_change_log(user_id, change_id);

ALTER TABLE public.bs_sync_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bs_sync_change_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.bs_sync_operations, public.bs_sync_change_log FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.bs_bet_slips,
  public.bs_participant_bets, public.bs_bet_legs FROM authenticated;
GRANT SELECT ON public.bs_bet_slips,
  public.bs_participant_bets, public.bs_bet_legs TO authenticated;

CREATE FUNCTION public.bs_record_sync_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Serialize change-log allocation per owner so a committed cursor cannot
  -- advance past another transaction that has allocated a lower change ID.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(NEW.user_id::text, 52052)
  );
  INSERT INTO public.bs_sync_change_log
    (user_id, entity_type, entity_id, revision, deleted_at)
  VALUES
    (NEW.user_id, TG_ARGV[0], NEW.id, NEW.revision, NEW.deleted_at);
  RETURN NEW;
END
$$;

CREATE TRIGGER bs_bet_slips_record_sync_change
AFTER INSERT OR UPDATE ON public.bs_bet_slips
FOR EACH ROW EXECUTE FUNCTION public.bs_record_sync_change('bet_slip');
CREATE TRIGGER bs_participant_bets_record_sync_change
AFTER INSERT OR UPDATE ON public.bs_participant_bets
FOR EACH ROW EXECUTE FUNCTION public.bs_record_sync_change('participant_bet');
CREATE TRIGGER bs_bet_legs_record_sync_change
AFTER INSERT OR UPDATE ON public.bs_bet_legs
FOR EACH ROW EXECUTE FUNCTION public.bs_record_sync_change('bet_leg');

CREATE FUNCTION public.bs_apply_sync_change(
  p_operation_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_expected_revision bigint,
  p_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_table text;
  v_request_hash text;
  v_prior public.bs_sync_operations%ROWTYPE;
  v_payload jsonb;
  v_columns text;
  v_values text;
  v_assignments text;
  v_invalid_key text;
  v_current_revision bigint;
  v_current_deleted_at timestamptz;
  v_revision bigint;
  v_deleted_at timestamptz;
  v_response jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '28000';
  END IF;
  IF p_operation_id IS NULL OR p_entity_id IS NULL
     OR p_action NOT IN ('upsert', 'delete')
     OR p_expected_revision IS NULL OR p_expected_revision < 0
     OR jsonb_typeof(p_payload) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid sync operation.';
  END IF;

  v_table := CASE p_entity_type
    WHEN 'bet_slip' THEN 'bs_bet_slips'
    WHEN 'participant_bet' THEN 'bs_participant_bets'
    WHEN 'bet_leg' THEN 'bs_bet_legs'
    ELSE NULL
  END;
  IF v_table IS NULL THEN
    RAISE EXCEPTION 'Unsupported sync entity type.';
  END IF;
  IF p_payload ? 'id' AND (p_payload->>'id')::uuid IS DISTINCT FROM p_entity_id THEN
    RAISE EXCEPTION 'Payload ID does not match the operation entity ID.';
  END IF;
  IF p_payload ? 'user_id' AND (p_payload->>'user_id')::uuid IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'Payload owner does not match the authenticated user.';
  END IF;
  IF p_payload ?| ARRAY['revision', 'updated_at', 'deleted_at', 'created_at'] THEN
    RAISE EXCEPTION 'Server-managed sync fields cannot be supplied by clients.';
  END IF;

  v_payload := jsonb_set(
    jsonb_set(p_payload, '{id}', pg_catalog.to_jsonb(p_entity_id), true),
    '{user_id}', pg_catalog.to_jsonb(v_user_id), true
  );

  SELECT key INTO v_invalid_key
  FROM pg_catalog.jsonb_object_keys(v_payload) AS payload_keys(key)
  WHERE NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_attribute AS attributes
    WHERE attributes.attrelid = pg_catalog.to_regclass('public.' || v_table)
      AND attributes.attname = key
      AND attributes.attnum > 0
      AND NOT attributes.attisdropped
  )
  LIMIT 1;
  IF v_invalid_key IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported field in sync payload: %.', v_invalid_key;
  END IF;

  v_request_hash := pg_catalog.encode(
    public.digest(
      pg_catalog.convert_to(
        pg_catalog.jsonb_build_object(
          'entity_type', p_entity_type,
          'entity_id', p_entity_id,
          'action', p_action,
          'expected_revision', p_expected_revision,
          'payload', v_payload
        )::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );

  INSERT INTO public.bs_sync_operations
    (user_id, operation_id, entity_type, entity_id, action, expected_revision, request_hash)
  VALUES
    (v_user_id, p_operation_id, p_entity_type, p_entity_id, p_action, p_expected_revision, v_request_hash)
  ON CONFLICT (user_id, operation_id) DO NOTHING;

  IF NOT FOUND THEN
    SELECT * INTO v_prior
    FROM public.bs_sync_operations
    WHERE user_id = v_user_id AND operation_id = p_operation_id;
    IF v_prior.request_hash IS DISTINCT FROM v_request_hash THEN
      RAISE EXCEPTION 'Operation ID was already used with a different request.';
    END IF;
    RETURN v_prior.response;
  END IF;

  EXECUTE pg_catalog.format(
    'SELECT revision, deleted_at FROM public.%I WHERE id = $1 AND user_id = $2 FOR UPDATE',
    v_table
  ) INTO v_current_revision, v_current_deleted_at USING p_entity_id, v_user_id;

  IF p_action = 'delete' THEN
    IF v_current_revision IS NULL
       OR v_current_revision <> p_expected_revision
       OR v_current_deleted_at IS NOT NULL THEN
      RAISE EXCEPTION 'Sync revision conflict.' USING ERRCODE = '40001';
    END IF;
    EXECUTE pg_catalog.format(
      'UPDATE public.%I SET deleted_at = pg_catalog.clock_timestamp() ' ||
      'WHERE id = $1 AND user_id = $2 AND revision = $3 AND deleted_at IS NULL ' ||
      'RETURNING revision, deleted_at',
      v_table
    ) INTO v_revision, v_deleted_at USING p_entity_id, v_user_id, p_expected_revision;
  ELSIF v_current_revision IS NULL THEN
    IF p_expected_revision <> 0 THEN
      RAISE EXCEPTION 'Sync revision conflict.' USING ERRCODE = '40001';
    END IF;

    SELECT
      pg_catalog.string_agg(pg_catalog.format('%I', attributes.attname), ', ' ORDER BY attributes.attnum),
      pg_catalog.string_agg(
        pg_catalog.format('(pg_catalog.jsonb_populate_record(NULL::public.%I, $1)).%I', v_table, attributes.attname),
        ', ' ORDER BY attributes.attnum
      )
    INTO v_columns, v_values
    FROM pg_catalog.pg_attribute AS attributes
    WHERE attributes.attrelid = pg_catalog.to_regclass('public.' || v_table)
      AND attributes.attname IN (SELECT key FROM pg_catalog.jsonb_object_keys(v_payload) AS keys(key))
      AND attributes.attname NOT IN ('id', 'user_id', 'revision', 'updated_at', 'deleted_at', 'created_at')
      AND attributes.attnum > 0
      AND NOT attributes.attisdropped;

    EXECUTE pg_catalog.format(
      'INSERT INTO public.%I (id, user_id%s) ' ||
      'SELECT $3, $2%s RETURNING revision, deleted_at',
      v_table,
      CASE WHEN v_columns IS NULL THEN '' ELSE ', ' || v_columns END,
      CASE WHEN v_values IS NULL THEN '' ELSE ', ' || v_values END
    ) INTO v_revision, v_deleted_at USING v_payload, v_user_id, p_entity_id;
  ELSE
    IF v_current_revision <> p_expected_revision OR v_current_deleted_at IS NOT NULL THEN
      RAISE EXCEPTION 'Sync revision conflict.' USING ERRCODE = '40001';
    END IF;

    SELECT pg_catalog.string_agg(
      pg_catalog.format(
        '%I = (pg_catalog.jsonb_populate_record(NULL::public.%I, $1)).%I',
        attributes.attname, v_table, attributes.attname
      ),
      ', ' ORDER BY attributes.attnum
    )
    INTO v_assignments
    FROM pg_catalog.pg_attribute AS attributes
    WHERE attributes.attrelid = pg_catalog.to_regclass('public.' || v_table)
      AND attributes.attname IN (SELECT key FROM pg_catalog.jsonb_object_keys(v_payload) AS keys(key))
      AND attributes.attname NOT IN ('id', 'user_id', 'revision', 'updated_at', 'deleted_at', 'created_at')
      AND attributes.attnum > 0
      AND NOT attributes.attisdropped;

    IF v_assignments IS NULL THEN
      RAISE EXCEPTION 'Sync update contains no mutable fields.';
    END IF;
    EXECUTE pg_catalog.format(
      'UPDATE public.%I SET %s ' ||
      'WHERE id = $2 AND user_id = $3 AND revision = $4 AND deleted_at IS NULL ' ||
      'RETURNING revision, deleted_at',
      v_table, v_assignments
    ) INTO v_revision, v_deleted_at USING v_payload, p_entity_id, v_user_id, p_expected_revision;
    IF v_revision IS NULL THEN
      RAISE EXCEPTION 'Sync revision conflict.' USING ERRCODE = '40001';
    END IF;
  END IF;

  v_response := pg_catalog.jsonb_build_object(
    'operation_id', p_operation_id,
    'entity_type', p_entity_type,
    'entity_id', p_entity_id,
    'revision', v_revision,
    'deleted_at', v_deleted_at
  );
  UPDATE public.bs_sync_operations
  SET response = v_response
  WHERE user_id = v_user_id AND operation_id = p_operation_id;
  RETURN v_response;
END
$$;

CREATE FUNCTION public.bs_get_sync_changes(p_after bigint, p_limit integer DEFAULT 100)
RETURNS TABLE (
  change_id text,
  entity_type text,
  entity_id uuid,
  revision bigint,
  deleted_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '28000';
  END IF;
  IF p_after IS NULL OR p_after < 0 OR p_limit IS NULL OR p_limit < 1 THEN
    RAISE EXCEPTION 'Invalid sync cursor or page size.';
  END IF;

  RETURN QUERY
  SELECT log.change_id::text, log.entity_type, log.entity_id, log.revision, log.deleted_at
  FROM public.bs_sync_change_log AS log
  WHERE log.user_id = auth.uid() AND log.change_id > p_after
  ORDER BY log.change_id
  LIMIT LEAST(p_limit, 500);
END
$$;

REVOKE ALL ON FUNCTION public.bs_apply_sync_change(uuid, text, uuid, text, bigint, jsonb) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.bs_get_sync_changes(bigint, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bs_apply_sync_change(uuid, text, uuid, text, bigint, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bs_get_sync_changes(bigint, integer) TO authenticated;
