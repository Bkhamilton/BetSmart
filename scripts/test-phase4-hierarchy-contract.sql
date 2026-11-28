\set ON_ERROR_STOP on

-- Run only against the isolated PostgreSQL test database after all Supabase
-- migrations. This script creates then removes its test auth user by rollback.
DO $$
BEGIN
  IF current_database() <> 'betsmart_phase4_test' THEN
    RAISE EXCEPTION 'This test requires the disposable betsmart_phase4_test database.';
  END IF;
END
$$;

BEGIN;
INSERT INTO auth.users (id) VALUES
  ('00000000-0000-4000-8000-000000000091');
SET LOCAL ROLE authenticated;
SELECT pg_catalog.set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000091',
  true
);

DO $$
DECLARE
  create_batch jsonb := '[
    {
      "operation_id":"10000000-0000-4000-8000-000000000091",
      "entity_type":"bet_slip",
      "entity_id":"20000000-0000-4000-8000-000000000091",
      "action":"upsert",
      "expected_revision":0,
      "payload":{
        "user_id":"00000000-0000-4000-8000-000000000091",
        "bet_slip_cloud_id":"20000000-0000-4000-8000-000000000091",
        "stake":"10.00",
        "currency_code":"USD",
        "placed_at":"2026-01-01T00:00:00Z"
      }
    },
    {
      "operation_id":"10000000-0000-4000-8000-000000000092",
      "entity_type":"participant_bet",
      "entity_id":"20000000-0000-4000-8000-000000000092",
      "action":"upsert",
      "expected_revision":0,
      "payload":{
        "user_id":"00000000-0000-4000-8000-000000000091",
        "bet_slip_cloud_id":"20000000-0000-4000-8000-000000000091",
        "parent_cloud_id":"20000000-0000-4000-8000-000000000091",
        "bet_slip_id":"20000000-0000-4000-8000-000000000091"
      }
    },
    {
      "operation_id":"10000000-0000-4000-8000-000000000093",
      "entity_type":"bet_leg",
      "entity_id":"20000000-0000-4000-8000-000000000093",
      "action":"upsert",
      "expected_revision":0,
      "payload":{
        "user_id":"00000000-0000-4000-8000-000000000091",
        "bet_slip_cloud_id":"20000000-0000-4000-8000-000000000091",
        "parent_cloud_id":"20000000-0000-4000-8000-000000000092",
        "participant_bet_id":"20000000-0000-4000-8000-000000000092",
        "selection_description":"Integration test"
      }
    }
  ]'::jsonb;
  response jsonb;
BEGIN
  response := public.bs_apply_sync_batch(create_batch);
  IF jsonb_array_length(response) <> 3 THEN
    RAISE EXCEPTION 'A complete hierarchy create did not acknowledge all three rows.';
  END IF;

  -- A parent tombstone without the complete descendant closure must roll back.
  BEGIN
    PERFORM public.bs_apply_sync_batch('[{
      "operation_id":"10000000-0000-4000-8000-000000000094",
      "entity_type":"bet_slip",
      "entity_id":"20000000-0000-4000-8000-000000000091",
      "action":"delete",
      "expected_revision":1,
      "payload":{
        "user_id":"00000000-0000-4000-8000-000000000091",
        "bet_slip_cloud_id":"20000000-0000-4000-8000-000000000091"
      }
    }]'::jsonb);
    RAISE EXCEPTION 'The RPC accepted a root deletion with live children.';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;
  IF (SELECT deleted_at FROM public.bs_bet_slips
      WHERE id = '20000000-0000-4000-8000-000000000091') IS NOT NULL THEN
    RAISE EXCEPTION 'Rejected parent deletion was not atomic.';
  END IF;

  response := public.bs_apply_sync_batch('[
    {
      "operation_id":"10000000-0000-4000-8000-000000000095",
      "entity_type":"bet_leg",
      "entity_id":"20000000-0000-4000-8000-000000000093",
      "action":"delete",
      "expected_revision":1,
      "payload":{
        "user_id":"00000000-0000-4000-8000-000000000091",
        "bet_slip_cloud_id":"20000000-0000-4000-8000-000000000091",
        "parent_cloud_id":"20000000-0000-4000-8000-000000000092"
      }
    },
    {
      "operation_id":"10000000-0000-4000-8000-000000000096",
      "entity_type":"participant_bet",
      "entity_id":"20000000-0000-4000-8000-000000000092",
      "action":"delete",
      "expected_revision":1,
      "payload":{
        "user_id":"00000000-0000-4000-8000-000000000091",
        "bet_slip_cloud_id":"20000000-0000-4000-8000-000000000091",
        "parent_cloud_id":"20000000-0000-4000-8000-000000000091"
      }
    },
    {
      "operation_id":"10000000-0000-4000-8000-000000000097",
      "entity_type":"bet_slip",
      "entity_id":"20000000-0000-4000-8000-000000000091",
      "action":"delete",
      "expected_revision":1,
      "payload":{
        "user_id":"00000000-0000-4000-8000-000000000091",
        "bet_slip_cloud_id":"20000000-0000-4000-8000-000000000091"
      }
    }
  ]'::jsonb);
  IF jsonb_array_length(response) <> 3 THEN
    RAISE EXCEPTION 'A complete hierarchy delete did not acknowledge all three rows.';
  END IF;

  -- Replaying the original create batch after its aggregate was deleted must
  -- return its receipts, not reject the now-tombstoned parents.
  response := public.bs_apply_sync_batch(create_batch);
  IF jsonb_array_length(response) <> 3
     OR (response->0->>'revision')::int <> 1
     OR (response->1->>'revision')::int <> 1
     OR (response->2->>'revision')::int <> 1 THEN
    RAISE EXCEPTION 'Create receipts were not replayed after the hierarchy was tombstoned.';
  END IF;
END
$$;

ROLLBACK;
