-- Apply after the Phase 3 sync contract. The client must supply changes in
-- dependency order and retain the same operation IDs and payloads on retry.
CREATE FUNCTION public.bs_apply_sync_batch(p_operations jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_operation jsonb;
  v_operation_id uuid;
  v_seen_ids uuid[] := ARRAY[]::uuid[];
  v_responses jsonb := '[]'::jsonb;
  v_response jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication is required.' USING ERRCODE = '28000';
  END IF;
  IF jsonb_typeof(p_operations) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Sync batch must be an array.';
  END IF;
  IF jsonb_array_length(p_operations) NOT BETWEEN 1 AND 500 THEN
    RAISE EXCEPTION 'Sync batch must contain between 1 and 500 operations.';
  END IF;

  FOR v_operation IN SELECT value FROM pg_catalog.jsonb_array_elements(p_operations)
  LOOP
    IF jsonb_typeof(v_operation) IS DISTINCT FROM 'object'
       OR NOT (v_operation ?& ARRAY[
         'operation_id', 'entity_type', 'entity_id', 'action', 'expected_revision', 'payload'
       ])
       OR (SELECT count(*) FROM pg_catalog.jsonb_object_keys(v_operation)) <> 6
       OR jsonb_typeof(v_operation->'payload') IS DISTINCT FROM 'object'
       OR jsonb_typeof(v_operation->'expected_revision') IS DISTINCT FROM 'number' THEN
      RAISE EXCEPTION 'Invalid sync batch operation.';
    END IF;

    v_operation_id := (v_operation->>'operation_id')::uuid;
    IF v_operation_id IS NULL OR v_operation_id = ANY(v_seen_ids) THEN
      RAISE EXCEPTION 'Sync batch operation IDs must be unique and non-null.';
    END IF;
    v_seen_ids := pg_catalog.array_append(v_seen_ids, v_operation_id);

    v_response := public.bs_apply_sync_change(
      v_operation_id,
      v_operation->>'entity_type',
      (v_operation->>'entity_id')::uuid,
      v_operation->>'action',
      (v_operation->>'expected_revision')::bigint,
      v_operation->'payload'
    );
    v_responses := v_responses || pg_catalog.jsonb_build_array(v_response);
  END LOOP;

  RETURN v_responses;
END
$$;

REVOKE ALL ON FUNCTION public.bs_apply_sync_batch(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bs_apply_sync_batch(jsonb) TO authenticated;
