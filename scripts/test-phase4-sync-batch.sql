\set ON_ERROR_STOP on

-- Run only against the disposable local test database, after all migrations.
DO $$
BEGIN
  IF current_database() <> 'betsmart_phase4_test' THEN
    RAISE EXCEPTION 'This test requires the disposable betsmart_phase4_test database.';
  END IF;
END
$$;

BEGIN;
INSERT INTO auth.users (id) VALUES
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002');

SET LOCAL ROLE authenticated;
SELECT pg_catalog.set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
DECLARE
  batch jsonb := '[
    {"operation_id":"10000000-0000-4000-8000-000000000001","entity_type":"bet_slip","entity_id":"20000000-0000-4000-8000-000000000001","action":"upsert","expected_revision":0,"payload":{"stake":10,"placed_at":"2026-01-01T00:00:00Z"}},
    {"operation_id":"10000000-0000-4000-8000-000000000002","entity_type":"participant_bet","entity_id":"20000000-0000-4000-8000-000000000002","action":"upsert","expected_revision":0,"payload":{"bet_slip_id":"20000000-0000-4000-8000-000000000001"}},
    {"operation_id":"10000000-0000-4000-8000-000000000003","entity_type":"bet_leg","entity_id":"20000000-0000-4000-8000-000000000003","action":"upsert","expected_revision":0,"payload":{"participant_bet_id":"20000000-0000-4000-8000-000000000002","selection_description":"Selection"}}
  ]'::jsonb;
  response jsonb;
BEGIN
  response := public.bs_apply_sync_batch(batch);
  IF jsonb_array_length(response) <> 3
     OR (response->0->>'revision')::int <> 1
     OR (response->2->>'revision')::int <> 1 THEN
    RAISE EXCEPTION 'Batch did not return the ordered create acknowledgements.';
  END IF;
  IF public.bs_apply_sync_batch(batch) IS DISTINCT FROM response THEN
    RAISE EXCEPTION 'An identical retry did not return the same acknowledgements.';
  END IF;

  BEGIN
    PERFORM public.bs_apply_sync_batch('[]'::jsonb);
    RAISE EXCEPTION 'An empty batch was accepted.';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM NOT LIKE '%between 1 and 500%' THEN RAISE; END IF;
  END;

  BEGIN
    PERFORM public.bs_apply_sync_batch('{"operation_id":"not-an-array"}'::jsonb);
    RAISE EXCEPTION 'A non-array batch was accepted.';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM NOT LIKE '%must be an array%' THEN RAISE; END IF;
  END;

  BEGIN
    PERFORM public.bs_apply_sync_batch(jsonb_set(batch, '{0,payload,stake}', '20'));
    RAISE EXCEPTION 'Reusing an operation ID with changed data was accepted.';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM NOT LIKE '%already used with a different request%' THEN RAISE; END IF;
  END;

  BEGIN
    PERFORM public.bs_apply_sync_batch(jsonb_build_array(batch->0, batch->0));
    RAISE EXCEPTION 'Duplicate operation IDs were accepted.';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM NOT LIKE '%must be unique%' THEN RAISE; END IF;
  END;

  BEGIN
    PERFORM public.bs_apply_sync_batch('[
      {"operation_id":"10000000-0000-4000-8000-000000000004","entity_type":"bet_slip","entity_id":"20000000-0000-4000-8000-000000000001","action":"upsert","expected_revision":1,"payload":{"stake":20}},
      {"operation_id":"10000000-0000-4000-8000-000000000005","entity_type":"bet_leg","entity_id":"20000000-0000-4000-8000-000000000003","action":"upsert","expected_revision":99,"payload":{"selection_description":"Stale"}}
    ]'::jsonb);
    RAISE EXCEPTION 'A stale revision was accepted.';
  EXCEPTION WHEN serialization_failure THEN
    NULL;
  END;
END
$$;

RESET ROLE;
DO $$
BEGIN
  IF (SELECT stake FROM public.bs_bet_slips WHERE id = '20000000-0000-4000-8000-000000000001') <> 10
     OR (SELECT revision FROM public.bs_bet_slips WHERE id = '20000000-0000-4000-8000-000000000001') <> 1
     OR EXISTS (SELECT 1 FROM public.bs_sync_operations WHERE operation_id IN
       ('10000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000005'))
     OR (SELECT count(*) FROM public.bs_sync_change_log) <> 3 THEN
    RAISE EXCEPTION 'A failed batch did not roll back all changes and receipts.';
  END IF;
  IF has_function_privilege('anon', 'public.bs_apply_sync_batch(jsonb)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Anonymous users can execute the batch contract.';
  END IF;
END
$$;

SET LOCAL ROLE authenticated;
SELECT pg_catalog.set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
DO $$
BEGIN
  BEGIN
    PERFORM public.bs_apply_sync_batch('[
      {"operation_id":"10000000-0000-4000-8000-000000000006","entity_type":"bet_leg","entity_id":"20000000-0000-4000-8000-000000000004","action":"upsert","expected_revision":0,"payload":{"participant_bet_id":"20000000-0000-4000-8000-000000000002","selection_description":"Other user"}}
    ]'::jsonb);
    RAISE EXCEPTION 'Cross-owner parent was accepted.';
  EXCEPTION WHEN foreign_key_violation THEN
    NULL;
  END;
END
$$;

SELECT pg_catalog.set_config('request.jwt.claim.sub', '', true);
DO $$
BEGIN
  BEGIN
    PERFORM public.bs_apply_sync_batch('[]'::jsonb);
    RAISE EXCEPTION 'An unauthenticated batch was accepted.';
  EXCEPTION WHEN invalid_authorization_specification THEN
    NULL;
  END;
END
$$;
ROLLBACK;
