import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createTables } from '../api/sqlite/createTables.js';
import { migrateGameReferenceConstraints } from '../api/sqlite/gameReferenceMigration.js';
import { migrateLinePlacementSnapshot } from '../api/sqlite/linePlacementMigration.js';
import { pullHistory } from '../db/sync/pull.js';
import { pushHistory } from '../db/sync/push.js';

const CLOUD_USER = '11111111-1111-4111-8111-111111111111';
const SLIP = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const PARTICIPANT = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const LEG_WITH_LINE = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const LEG_WITHOUT_LINE = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const PLACED_AT = '2026-11-20T12:00:00.000Z';

const database = new DatabaseSync(':memory:');
const db = {
  execAsync: async sql => database.exec(sql),
  getFirstAsync: async (sql, params = []) => database.prepare(sql).get(...params),
  getAllAsync: async (sql, params = []) => database.prepare(sql).all(...params),
  runAsync: async (sql, params = []) => database.prepare(sql).run(...params),
  withTransactionAsync: async callback => {
    database.exec('BEGIN');
    try {
      await callback();
      database.exec('COMMIT');
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  },
  withExclusiveTransactionAsync: async callback => {
    database.exec('BEGIN EXCLUSIVE');
    try {
      await callback(db);
      database.exec('COMMIT');
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  },
};

const slip = {
  id: SLIP,
  user_id: CLOUD_USER,
  user_bookie_id: null,
  stake: '10.00',
  decimal_odds: null,
  currency_code: 'USD',
  bet_format: 'Single',
  status: 'pending',
  payout: null,
  placed_at: PLACED_AT,
  settled_at: null,
  legacy_format_id: null,
  legacy_bookie_id: null,
  odds_snapshot: '+100',
  legacy_result: null,
  legacy_result_at: null,
  revision: 1,
  created_at: PLACED_AT,
  updated_at: PLACED_AT,
  bookie_display_name: null,
  bookie_display_name_snapshot: null,
};

const participant = {
  id: PARTICIPANT,
  user_id: CLOUD_USER,
  bet_slip_id: SLIP,
  game_reference_id: 'provider-game',
  decimal_odds: null,
  odds_snapshot: '+100',
  sport_snapshot: 'Basketball',
  home_team_snapshot: 'Home',
  away_team_snapshot: 'Away',
  game_date_snapshot: '2026-11-21',
  league_snapshot: 'Example League',
  home_team_abbreviation_snapshot: 'HOM',
  away_team_abbreviation_snapshot: 'AWY',
  status: 'pending',
  legacy_result: null,
  legacy_result_at: null,
  revision: 1,
  created_at: PLACED_AT,
  updated_at: PLACED_AT,
};

const leg = (id, line, marketValue, selection) => ({
  id,
  user_id: CLOUD_USER,
  participant_bet_id: PARTICIPANT,
  market_reference_id: null,
  selection_description: selection,
  odds_at_placement: null,
  line_at_placement: line,
  market_type_snapshot: 'Player points',
  market_value_snapshot: marketValue,
  odds_snapshot: '+100',
  over_under_snapshot: 'over',
  target_name_snapshot: 'Example Player',
  target_type_snapshot: 'player',
  bet_type_snapshot: 'Player points',
  status: 'pending',
  legacy_market_id: null,
  legacy_bet_type_id: null,
  legacy_target_id: null,
  bookie_reference_id: null,
  legacy_result: null,
  legacy_result_at: null,
  revision: 1,
  created_at: PLACED_AT,
  updated_at: PLACED_AT,
});

const changes = [
  { change_id: '1', entity_type: 'bet_slip', entity_id: SLIP, revision: 1, deleted_at: null, record: slip },
  { change_id: '2', entity_type: 'participant_bet', entity_id: PARTICIPANT, revision: 1, deleted_at: null, record: participant },
  { change_id: '3', entity_type: 'bet_leg', entity_id: LEG_WITH_LINE, revision: 1, deleted_at: null,
    record: leg(LEG_WITH_LINE, '20.5000', 'different market snapshot', 'Player over') },
  { change_id: '4', entity_type: 'bet_leg', entity_id: LEG_WITHOUT_LINE, revision: 1, deleted_at: null,
    record: leg(LEG_WITHOUT_LINE, null, '33.5', 'Other player over') },
];

const pushCalls = [];
const client = {
  auth: {
    getUser: async () => ({ data: { user: { id: CLOUD_USER } }, error: null }),
    getSession: async () => ({ data: { session: { user: { id: CLOUD_USER } } }, error: null }),
  },
  rpc: async (name, args) => {
    if (name === 'bs_get_sync_history_page') {
      const after = BigInt(args.p_after);
      return {
        data: {
          cloud_user_id: CLOUD_USER,
          changes: changes.filter(change => BigInt(change.change_id) > after).slice(0, args.p_limit),
        },
        error: null,
      };
    }
    assert.equal(name, 'bs_apply_sync_batch');
    const operations = structuredClone(args.p_operations);
    pushCalls.push(operations);
    return {
      data: operations.map(operation => ({
        operation_id: operation.operation_id,
        entity_type: operation.entity_type,
        entity_id: operation.entity_id,
        revision: operation.expected_revision + 1,
      })),
      error: null,
    };
  },
};

try {
  await createTables(db);
  assert.ok(database.prepare('PRAGMA table_info(Legs)').all()
    .some(column => column.name === 'cloudLineAtPlacement'));
  const legUpdateTrigger = database.prepare(`
    SELECT sql FROM sqlite_master WHERE type = 'trigger' AND name = 'sync_Legs_update'
  `).get().sql;
  assert.match(legUpdateTrigger, /cloudLineAtPlacement/);
  await migrateLinePlacementSnapshot(db);
  await migrateGameReferenceConstraints(db);
  database.exec('PRAGMA foreign_keys = ON');
  const ownerId = Number(database.prepare(
    'INSERT INTO Users (cloudUserId, name, username) VALUES (?, ?, ?)'
  ).run(CLOUD_USER, 'Synthetic user', 'line-roundtrip').lastInsertRowid);

  const pulled = await pullHistory(db, client, ownerId, CLOUD_USER);
  assert.equal(pulled.inserted, 4);
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM sync_outbox').get().count, 0);

  const restored = database.prepare(`
    SELECT cloudId, marketValueSnapshot, cloudLineAtPlacement
    FROM Legs ORDER BY cloudId
  `).all();
  const byCloudId = new Map(restored.map(row => [row.cloudId, row]));
  assert.equal(byCloudId.get(LEG_WITH_LINE).marketValueSnapshot, 'different market snapshot');
  assert.equal(byCloudId.get(LEG_WITH_LINE).cloudLineAtPlacement, '20.5000');
  assert.equal(byCloudId.get(LEG_WITHOUT_LINE).marketValueSnapshot, '33.5');
  assert.equal(byCloudId.get(LEG_WITHOUT_LINE).cloudLineAtPlacement, null);

  // Edit only the independent market-value snapshot. The immutable outbox
  // captures the cloud line separately, including an explicit remote null.
  database.prepare('UPDATE Legs SET marketValueSnapshot = ? WHERE cloudId = ?')
    .run('updated market snapshot', LEG_WITH_LINE);
  database.prepare('UPDATE Legs SET marketValueSnapshot = ? WHERE cloudId = ?')
    .run('34.5', LEG_WITHOUT_LINE);
  const queued = database.prepare(`
    SELECT entityId, payloadJson FROM sync_outbox
    WHERE entityType = 'bet_leg' AND status = 'pending'
    ORDER BY sequence
  `).all();
  assert.equal(queued.length, 2);
  const captured = new Map(queued.map(row => [row.entityId, JSON.parse(row.payloadJson)]));
  assert.equal(captured.get(LEG_WITH_LINE).cloudLineAtPlacement, '20.5000');
  assert.equal(captured.get(LEG_WITH_LINE).marketValueSnapshot, 'updated market snapshot');
  assert.equal(captured.get(LEG_WITHOUT_LINE).cloudLineAtPlacement, null);
  assert.equal(captured.get(LEG_WITHOUT_LINE).marketValueSnapshot, '34.5');

  const pushed = await pushHistory(db, client, ownerId, CLOUD_USER);
  assert.equal(pushed.acknowledged, 2, JSON.stringify(pushed));
  assert.equal(pushCalls.length, 1);
  const payloads = new Map(pushCalls[0].map(operation => [
    operation.entity_id,
    operation.payload,
  ]));
  assert.equal(payloads.get(LEG_WITH_LINE).line_at_placement, '20.5000');
  assert.equal(payloads.get(LEG_WITH_LINE).market_value_snapshot, 'updated market snapshot');
  assert.equal(payloads.get(LEG_WITHOUT_LINE).line_at_placement, null);
  assert.equal(payloads.get(LEG_WITHOUT_LINE).market_value_snapshot, '34.5');
  console.log('PASS: pulled line_at_placement values round-trip independently from market-value snapshots.');
} finally {
  database.close();
}
