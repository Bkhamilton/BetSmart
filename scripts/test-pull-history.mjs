import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createTables } from '../api/sqlite/createTables.js';
import { migrateGameReferenceConstraints } from '../api/sqlite/gameReferenceMigration.js';
import { migrateLinePlacementSnapshot } from '../api/sqlite/linePlacementMigration.js';
import { migrateSyncSchema } from '../api/sqlite/syncMigration.js';
import { pullHistory } from '../db/sync/pull.js';

const CLOUD_A = '11111111-1111-4111-8111-111111111111';
const CLOUD_B = '22222222-2222-4222-8222-222222222222';
const SLIP = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const PARTICIPANT = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const LEG = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const OTHER_SLIP = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

const makeDatabase = async () => {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec('PRAGMA foreign_keys = ON');
  const db = {
    execAsync: async sql => sqlite.exec(sql),
    getFirstAsync: async (sql, parameters = []) => sqlite.prepare(sql).get(...parameters),
    getAllAsync: async (sql, parameters = []) => sqlite.prepare(sql).all(...parameters),
    runAsync: async (sql, parameters = []) => sqlite.prepare(sql).run(...parameters),
    withTransactionAsync: async callback => {
      sqlite.exec('BEGIN');
      try {
        await callback();
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
    withExclusiveTransactionAsync: async callback => {
      sqlite.exec('BEGIN EXCLUSIVE');
      try {
        await callback(db);
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  await createTables(db);
  await migrateLinePlacementSnapshot(db);
  await migrateGameReferenceConstraints(db);
  sqlite.exec('PRAGMA foreign_keys = ON');
  const ownerA = sqlite.prepare(
    'INSERT INTO Users (cloudUserId, name, username) VALUES (?, ?, ?)'
  ).run(CLOUD_A, 'Synthetic A', 'synthetic-a').lastInsertRowid;
  const ownerB = sqlite.prepare(
    'INSERT INTO Users (cloudUserId, name, username) VALUES (?, ?, ?)'
  ).run(CLOUD_B, 'Synthetic B', 'synthetic-b').lastInsertRowid;
  return { sqlite, db, ownerA, ownerB };
};

const slipRecord = (userId = CLOUD_A, overrides = {}) => ({
  id: SLIP,
  user_id: userId,
  user_bookie_id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  stake: '12.30',
  decimal_odds: '2.1',
  currency_code: 'USD',
  bet_format: 'Single',
  status: 'won',
  payout: '25.83',
  placed_at: '2026-11-20T12:00:00.000Z',
  settled_at: '2026-11-20T14:00:00.000Z',
  legacy_format_id: 7,
  legacy_bookie_id: 8,
  odds_snapshot: '+110',
  legacy_result: 1,
  legacy_result_at: '2026-11-20T14:00:00.000Z',
  revision: 1,
  created_at: '2026-11-20T12:00:00.000Z',
  updated_at: '2026-11-20T14:00:00.000Z',
  bookie_display_name: 'Synthetic Book',
  bookie_display_name_snapshot: null,
  ...overrides,
});

const participantRecord = (overrides = {}) => ({
  id: PARTICIPANT,
  user_id: CLOUD_A,
  bet_slip_id: SLIP,
  game_reference_id: 'provider-game-a',
  decimal_odds: '2',
  odds_snapshot: '+100',
  sport_snapshot: 'Synthetic sport',
  home_team_snapshot: 'Synthetic home',
  away_team_snapshot: 'Synthetic away',
  status: 'won',
  legacy_result: 1,
  legacy_result_at: '2026-11-20T14:00:00.000Z',
  revision: 1,
  created_at: '2026-11-20T12:00:00.000Z',
  updated_at: '2026-11-20T14:00:00.000Z',
  ...overrides,
});

const legRecord = (overrides = {}) => ({
  id: LEG,
  user_id: CLOUD_A,
  participant_bet_id: PARTICIPANT,
  market_reference_id: 'provider-market-a',
  selection_description: 'Synthetic player over 20.5 points',
  odds_at_placement: '1.91',
  line_at_placement: '20.5000',
  status: 'won',
  legacy_market_id: 45,
  legacy_bet_type_id: 46,
  market_type_snapshot: 'player points',
  market_value_snapshot: 'market-value-snapshot',
  odds_snapshot: '+110',
  over_under_snapshot: 'over',
  target_name_snapshot: 'Synthetic player',
  target_type_snapshot: 'player',
  legacy_target_id: 47,
  bookie_reference_id: 48,
  legacy_result: 1,
  legacy_result_at: '2026-11-20T14:00:00.000Z',
  revision: 1,
  created_at: '2026-11-20T12:00:00.000Z',
  updated_at: '2026-11-20T14:00:00.000Z',
  ...overrides,
});

const change = (changeId, entityType, entityId, record, overrides = {}) => ({
  change_id: String(changeId),
  entity_type: entityType,
  entity_id: entityId,
  revision: record?.revision ?? 1,
  deleted_at: null,
  record,
  ...overrides,
});

const makeClient = (cloudUserId, allChanges, afterRpc = null) => {
  const calls = [];
  return {
    calls,
    auth: {
      getUser: async () => ({ data: { user: { id: cloudUserId } }, error: null }),
    },
    rpc: async (name, args) => {
      calls.push({ name, args });
      if (afterRpc) await afterRpc(name, args);
      if (name !== 'bs_get_sync_history_page') {
        return { data: null, error: new Error(`Unexpected RPC ${name}`) };
      }
      const after = BigInt(args.p_after);
      const changes = allChanges
        .filter(row => BigInt(row.change_id) > after)
        .slice(0, args.p_limit);
      return { data: { cloud_user_id: cloudUserId, changes }, error: null };
    },
  };
};

const testRestoreReplayAndForeignKeys = async () => {
  const { sqlite, db, ownerA } = await makeDatabase();
  try {
    sqlite.prepare('INSERT INTO BetFormats (formatName) VALUES (?)').run('Single');
    sqlite.prepare('INSERT INTO Bookies (name) VALUES (?)').run('Synthetic local bookie');
    assert.equal(sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
    assert.equal(
      sqlite.prepare("SELECT COUNT(*) AS count FROM pragma_foreign_key_list('ParticipantBets') WHERE \"table\" = 'Games'").get().count,
      0,
      'restored game IDs must not use the non-unique legacy Games(gameId) key'
    );

    const changes = [
      change(1, 'bet_slip', SLIP, slipRecord()),
      change(2, 'participant_bet', PARTICIPANT, participantRecord()),
      change(3, 'bet_leg', LEG, legRecord()),
    ];
    const client = makeClient(CLOUD_A, changes);
    const first = await pullHistory(db, client, ownerA, CLOUD_A);
    assert.deepEqual(first, {
      pages: 1,
      inserted: 3,
      updated: 0,
      deleted: 0,
      skipped: 0,
      cursor: '3',
      warnings: [
        'Some participant records lack historical game date, league, or team-abbreviation snapshots. Pull does not infer these from current shared reference data.',
      ],
    });
    assert.equal(client.calls[0].name, 'bs_get_sync_history_page');
    assert.equal(client.calls[0].args.p_expected_user_id, CLOUD_A);
    assert.equal(client.calls[0].args.p_after, '0');
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = ?').get(ownerA).count, 0);

    const restoredSlip = sqlite.prepare('SELECT * FROM BetSlips WHERE cloudId = ?').get(SLIP);
    assert.equal(restoredSlip.formatId, 1);
    assert.equal(restoredSlip.bookieId, null);
    assert.equal(restoredSlip.cloudBookieId, slipRecord().user_bookie_id);
    assert.equal(restoredSlip.bookieNameSnapshot, 'Synthetic Book');
    assert.equal(restoredSlip.cloudLegacyBookieId, '8');
    assert.equal(restoredSlip.cloudStake, '12.30');
    assert.equal(restoredSlip.cloudStatus, 'won');
    assert.equal(sqlite.prepare('SELECT result FROM BetSlipsResults WHERE betSlipId = ?').get(restoredSlip.id).result, '1');

    const restoredParticipant = sqlite.prepare('SELECT * FROM ParticipantBets WHERE cloudId = ?').get(PARTICIPANT);
    assert.equal(restoredParticipant.gameId, null);
    assert.equal(restoredParticipant.cloudGameReferenceId, 'provider-game-a');
    assert.equal(restoredParticipant.homeTeamSnapshot, 'Synthetic home');
    assert.equal(sqlite.prepare('SELECT result FROM ParticipantBetsResults WHERE participantBetId = ?').get(restoredParticipant.id).result, '1');

    const restoredLeg = sqlite.prepare('SELECT * FROM Legs WHERE cloudId = ?').get(LEG);
    assert.equal(restoredLeg.betMarketId, null);
    assert.equal(restoredLeg.betTypeId, null);
    assert.equal(restoredLeg.cloudLegacyMarketId, '45');
    assert.equal(restoredLeg.cloudSelectionDescription, 'Synthetic player over 20.5 points');
    assert.equal(restoredLeg.marketValueSnapshot, 'market-value-snapshot');
    assert.equal(restoredLeg.cloudLineAtPlacement, '20.5000');
    assert.notEqual(restoredLeg.cloudLineAtPlacement, restoredLeg.marketValueSnapshot);
    assert.equal(sqlite.prepare('SELECT result FROM LegsResults WHERE legId = ?').get(restoredLeg.id).result, '1');
    assert.equal(sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);

    const updatedLineAndMarket = makeClient(CLOUD_A, [
      ...changes,
      change(4, 'bet_leg', LEG, legRecord({
        revision: 2,
        line_at_placement: '21.5000',
        market_value_snapshot: 'separate market snapshot v2',
      })),
    ]);
    const updateResult = await pullHistory(db, updatedLineAndMarket, ownerA, CLOUD_A);
    assert.equal(updateResult.updated, 1);
    const updatedLeg = sqlite.prepare('SELECT * FROM Legs WHERE cloudId = ?').get(LEG);
    assert.equal(updatedLeg.cloudLineAtPlacement, '21.5000');
    assert.equal(updatedLeg.marketValueSnapshot, 'separate market snapshot v2');
    assert.deepEqual(await migrateLinePlacementSnapshot(db), { applied: false });
    const afterRepeatedMigration = sqlite.prepare('SELECT * FROM Legs WHERE cloudId = ?').get(LEG);
    assert.equal(afterRepeatedMigration.cloudLineAtPlacement, '21.5000');
    assert.equal(afterRepeatedMigration.marketValueSnapshot, 'separate market snapshot v2');

    const replay = await pullHistory(db, client, ownerA, CLOUD_A);
    assert.equal(replay.inserted, 0);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 1);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM ParticipantBets').get().count, 1);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM Legs').get().count, 1);
  } finally {
    sqlite.close();
  }
};

const testPendingLocalEditRollsBackPage = async () => {
  const { sqlite, db, ownerA } = await makeDatabase();
  try {
    const localId = sqlite.prepare(`
      INSERT INTO BetSlips
        (formatId, date, odds, betAmount, userId, cloudId)
      VALUES (NULL, '2026-11-21', '+100', 5, ?, ?)
    `).run(ownerA, SLIP).lastInsertRowid;
    const outboxBefore = sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = ?').get(ownerA).count;
    const client = makeClient(CLOUD_A, [
      change(1, 'bet_slip', SLIP, slipRecord(CLOUD_A, { revision: 2, stake: '99.00' })),
    ]);

    await assert.rejects(
      pullHistory(db, client, ownerA, CLOUD_A),
      /pending local edit/
    );
    assert.equal(sqlite.prepare('SELECT betAmount FROM BetSlips WHERE id = ?').get(localId).betAmount, 5);
    assert.equal(sqlite.prepare('SELECT pullCursor FROM user_sync_state WHERE userId = ?').get(ownerA), undefined);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = ?').get(ownerA).count, outboxBefore);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_pull_context').get().count, 0);
  } finally {
    sqlite.close();
  }
};

const testIsolationAndAuthSwitch = async () => {
  const { sqlite, db, ownerA, ownerB } = await makeDatabase();
  try {
    const crossOwner = change(1, 'bet_slip', OTHER_SLIP, slipRecord(CLOUD_B));
    const wrongRowClient = makeClient(CLOUD_A, [crossOwner]);
    await assert.rejects(pullHistory(db, wrongRowClient, ownerA, CLOUD_A), /account-owned record snapshot/);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 0);

    let authCalls = 0;
    const switchingClient = makeClient(CLOUD_A, [change(1, 'bet_slip', SLIP, slipRecord())]);
    switchingClient.auth.getUser = async () => ({
      data: { user: { id: ++authCalls === 1 ? CLOUD_A : CLOUD_B } },
      error: null,
    });
    await assert.rejects(pullHistory(db, switchingClient, ownerA, CLOUD_A), /active Supabase account changed/);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 0);

    const clientB = makeClient(CLOUD_B, [change(1, 'bet_slip', OTHER_SLIP, slipRecord(CLOUD_B, { id: OTHER_SLIP }))]);
    await pullHistory(db, clientB, ownerB, CLOUD_B);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips WHERE userId = ?').get(ownerA).count, 0);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips WHERE userId = ?').get(ownerB).count, 1);
  } finally {
    sqlite.close();
  }
};

const testTombstoneDeleteAndReplay = async () => {
  const { sqlite, db, ownerA } = await makeDatabase();
  try {
    const restoreClient = makeClient(CLOUD_A, [
      change(1, 'bet_slip', SLIP, slipRecord()),
      change(2, 'participant_bet', PARTICIPANT, participantRecord()),
      change(3, 'bet_leg', LEG, legRecord()),
    ]);
    await pullHistory(db, restoreClient, ownerA, CLOUD_A);
    const tombstone = {
      change_id: '4',
      entity_type: 'bet_slip',
      entity_id: SLIP,
      revision: 2,
      deleted_at: '2026-11-22T00:00:00Z',
      record: null,
    };
    const deleteClient = makeClient(CLOUD_A, [tombstone]);
    const deleted = await pullHistory(db, deleteClient, ownerA, CLOUD_A);
    assert.equal(deleted.deleted, 1);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 0);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM ParticipantBets').get().count, 0);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM Legs').get().count, 0);
    assert.equal(
      sqlite.prepare('SELECT revision FROM sync_remote_tombstones WHERE ownerUserId = ? AND entityType = ? AND entityId = ?').get(ownerA, 'bet_slip', SLIP).revision,
      2
    );

    sqlite.prepare('UPDATE user_sync_state SET pullCursor = ? WHERE userId = ?').run('3', ownerA);
    const replay = await pullHistory(db, deleteClient, ownerA, CLOUD_A);
    assert.equal(replay.skipped, 1);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 0);
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = ?').get(ownerA).count, 0);
  } finally {
    sqlite.close();
  }
};

const testAtomicPageRollback = async () => {
  const { sqlite, db, ownerA } = await makeDatabase();
  try {
    const seed = makeClient(CLOUD_A, [change(1, 'bet_slip', SLIP, slipRecord())]);
    await pullHistory(db, seed, ownerA, CLOUD_A);
    const brokenParticipant = participantRecord({
      id: PARTICIPANT,
      bet_slip_id: OTHER_SLIP,
      revision: 2,
    });
    const atomicClient = makeClient(CLOUD_A, [
      change(2, 'bet_slip', SLIP, slipRecord(CLOUD_A, { revision: 2, stake: '88.00' })),
      change(3, 'participant_bet', PARTICIPANT, brokenParticipant),
    ]);
    await assert.rejects(pullHistory(db, atomicClient, ownerA, CLOUD_A), /parent slip is not present/);
    assert.equal(sqlite.prepare('SELECT betAmount FROM BetSlips WHERE cloudId = ?').get(SLIP).betAmount, 12.3);
    assert.equal(sqlite.prepare('SELECT pullCursor FROM user_sync_state WHERE userId = ?').get(ownerA).pullCursor, '1');
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_pull_context').get().count, 0);
  } finally {
    sqlite.close();
  }
};

const testTwoDatabaseRestoreAndMigrationPreservation = async () => {
  const firstDevice = await makeDatabase();
  const secondDevice = await makeDatabase();
  const migrationDevice = await makeDatabase();
  try {
    const changes = [
      change(1, 'bet_slip', SLIP, slipRecord()),
      change(2, 'participant_bet', PARTICIPANT, participantRecord()),
      change(3, 'bet_leg', LEG, legRecord()),
    ];
    const client = makeClient(CLOUD_A, changes);
    await pullHistory(firstDevice.db, client, firstDevice.ownerA, CLOUD_A);
    await pullHistory(secondDevice.db, client, secondDevice.ownerA, CLOUD_A);
    assert.equal(firstDevice.sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 1);
    assert.equal(secondDevice.sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 1);
    assert.notEqual(
      firstDevice.sqlite.prepare('SELECT id FROM BetSlips WHERE cloudId = ?').get(SLIP).id,
      undefined
    );
    assert.equal(
      secondDevice.sqlite.prepare('SELECT cloudId FROM Legs WHERE cloudId = ?').get(LEG).cloudId,
      LEG
    );

    // Exercise the version-2 -> pull-schema rebuild with local history already
    // present, including its legacy identifiers and parent relationship.
    const localId = migrationDevice.sqlite.prepare(`
      INSERT INTO BetSlips (formatId, date, odds, betAmount, userId, cloudId)
      VALUES (NULL, '2026-10-01', '+105', 7.25, ?, ?)
    `).run(migrationDevice.ownerA, OTHER_SLIP).lastInsertRowid;
    const participantId = migrationDevice.sqlite.prepare(`
      INSERT INTO ParticipantBets (betSlipId, gameId, odds, cloudId)
      VALUES (?, 'legacy-game-ref', '+105', ?)
    `).run(localId, 'ffffffff-ffff-4fff-8fff-ffffffffffff').lastInsertRowid;
    migrationDevice.sqlite.exec('PRAGMA user_version = 2');
    await migrateSyncSchema(migrationDevice.db);
    assert.equal(migrationDevice.sqlite.prepare('SELECT id, betAmount, cloudId FROM BetSlips WHERE cloudId = ?').get(OTHER_SLIP).id, localId);
    assert.equal(migrationDevice.sqlite.prepare('SELECT gameId FROM ParticipantBets WHERE id = ?').get(participantId).gameId, 'legacy-game-ref');
    assert.equal(migrationDevice.sqlite.prepare('SELECT user_version FROM pragma_user_version').get().user_version, 7);
    await migrateGameReferenceConstraints(migrationDevice.db);
    await migrateLinePlacementSnapshot(migrationDevice.db);
    assert.equal(migrationDevice.sqlite.prepare('SELECT user_version FROM pragma_user_version').get().user_version, 7);
    assert.ok(migrationDevice.sqlite.prepare('PRAGMA table_info(Legs)').all()
      .some(column => column.name === 'cloudLineAtPlacement'));
    assert.equal(migrationDevice.sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  } finally {
    firstDevice.sqlite.close();
    secondDevice.sqlite.close();
    migrationDevice.sqlite.close();
  }
};

await testRestoreReplayAndForeignKeys();
await testPendingLocalEditRollsBackPage();
await testIsolationAndAuthSwitch();
await testTombstoneDeleteAndReplay();
await testAtomicPageRollback();
await testTwoDatabaseRestoreAndMigrationPreservation();
console.log('PASS: history pull restore, replay, pending-edit protection, isolation, tombstones, atomic rollback, and foreign_keys=ON.');
