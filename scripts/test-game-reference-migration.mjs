import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createTables } from '../api/sqlite/createTables.js';
import { migrateGameReferenceConstraints } from '../api/sqlite/gameReferenceMigration.js';
import { migrateLinePlacementSnapshot } from '../api/sqlite/linePlacementMigration.js';

const sqlite = new DatabaseSync(':memory:');
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
};

try {
  sqlite.exec('PRAGMA foreign_keys = OFF');
  await createTables(db);
  sqlite.exec('PRAGMA foreign_keys = OFF');
  await migrateLinePlacementSnapshot(db);

  sqlite.exec(`
    INSERT INTO Bookies (id, name) VALUES (1, 'Migration Book');
    INSERT INTO Leagues (id, leagueName, sport, description)
      VALUES (1, 'Migration League', 'Synthetic', 'fixture');
    INSERT INTO Teams (id, teamName, abbreviation, leagueId)
      VALUES (1, 'Home Team', 'HOM', 1), (2, 'Away Team', 'AWY', 1);
    INSERT INTO Seasons (id, leagueId, season, games, seasonType, startDate, endDate)
      VALUES (1, 1, '2026', 2, 'Regular Season', '2026-01-01', '2026-12-31');
    INSERT INTO Games (id, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId)
      VALUES (1, 'duplicate-provider-id', 1, '2026-01-01', '2026-01-01T00:00:00Z', 1, 2);
    INSERT INTO BetTargets (id, targetType, targetName, teamId, gameId)
      VALUES (10, 'Player', 'Existing Target', 1, 'duplicate-provider-id');
    INSERT INTO BetMarkets
      (id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
      VALUES (20, 'duplicate-provider-id', 'Points', '2026-01-01T00:00:00Z', 20.5, '+100', 'over', 10, 1);
    INSERT INTO MarketFetchHistory (id, gameId, marketType, lastFetched)
      VALUES (30, 'duplicate-provider-id', 'Points', '2026-01-01T01:00:00Z');
    INSERT INTO MarketFetchHistory (id, gameId, marketType, lastFetched)
      VALUES (70, 'deleted-high-water', 'Deleted', '2026-01-01T02:00:00Z');
    DELETE FROM MarketFetchHistory WHERE id = 70;

    CREATE INDEX idx_test_betmarkets_game_ref ON BetMarkets(gameId, marketType);
    CREATE TABLE test_mfh_audit (marketFetchId INTEGER NOT NULL);
    CREATE TRIGGER test_mfh_audit_insert
      AFTER INSERT ON MarketFetchHistory
      BEGIN
        INSERT INTO test_mfh_audit (marketFetchId) VALUES (NEW.id);
      END;
    CREATE VIEW test_game_reference_rows AS
      SELECT g.gameId, bm.id AS marketId, bt.targetName, mfh.id AS fetchId
      FROM Games g
      LEFT JOIN BetMarkets bm ON bm.gameId = g.gameId
      LEFT JOIN BetTargets bt ON bt.gameId = g.gameId
      LEFT JOIN MarketFetchHistory mfh ON mfh.gameId = g.gameId;
  `);
  assert.equal(sqlite.prepare("SELECT seq FROM sqlite_sequence WHERE name = 'MarketFetchHistory'").get().seq, 70);

  // createTables advances the shared SQLite version beyond the old game
  // migration marker. The repair must inspect schema, not skip on version.
  assert.equal(sqlite.prepare('PRAGMA user_version').get().user_version, 7);
  sqlite.exec('PRAGMA foreign_keys = ON');
  assert.equal(sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  const migration = await migrateGameReferenceConstraints(db);
  assert.equal(migration.applied, true);
  assert.ok(migration.changedTables.includes('BetMarkets'));
  assert.ok(migration.changedTables.includes('BetTargets'));
  assert.ok(migration.changedTables.includes('MarketFetchHistory'));
  assert.equal(sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);

  for (const table of ['BetMarkets', 'BetTargets', 'MarketFetchHistory', 'ParticipantBets']) {
    const invalidGameKey = sqlite.prepare(`PRAGMA foreign_key_list("${table}")`).all()
      .some(row => row.table === 'Games' && row.from.toLowerCase() === 'gameid' && row.to.toLowerCase() === 'gameid');
    assert.equal(invalidGameKey, false, `${table} must not reference non-unique Games(gameId)`);
  }

  assert.deepEqual(
    { ...sqlite.prepare('SELECT id, gameId, marketType FROM BetMarkets WHERE id = 20').get() },
    { id: 20, gameId: 'duplicate-provider-id', marketType: 'Points' }
  );
  assert.equal(sqlite.prepare('SELECT id, targetName FROM BetTargets WHERE id = 10').get().targetName, 'Existing Target');
  assert.equal(sqlite.prepare('SELECT id, gameId FROM MarketFetchHistory WHERE id = 30').get().gameId, 'duplicate-provider-id');
  assert.equal(sqlite.prepare("SELECT seq FROM sqlite_sequence WHERE name = 'MarketFetchHistory'").get().seq, 70);
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'index' AND name = 'idx_test_betmarkets_game_ref'").get().count,
    1
  );
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'view' AND name = 'test_game_reference_rows'").get().count,
    1
  );

  // Insert the parent game with FK enforcement on, using a gameId that is not
  // globally unique. A global UNIQUE(gameId) workaround is neither needed nor
  // safe: the schema's actual identity is composite.
  sqlite.prepare(`
    INSERT INTO Games (gameId, seasonId, date, timestamp, homeTeamId, awayTeamId)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('duplicate-provider-id', 1, '2026-01-02', '2026-01-02T00:00:00Z', 1, 2);
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS count FROM Games WHERE gameId = ?').get('duplicate-provider-id').count,
    2
  );

  sqlite.prepare(`
    INSERT INTO BetTargets (targetType, targetName, teamId, gameId)
    VALUES (?, ?, ?, ?)
  `).run('Player', 'New Target', 1, 'duplicate-provider-id');
  const targetId = sqlite.prepare('SELECT id FROM BetTargets WHERE targetName = ?').get('New Target').id;
  sqlite.prepare(`
    INSERT INTO BetMarkets
      (gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('duplicate-provider-id', 'Rebounds', '2026-01-02T00:00:00Z', 8.5, '+105', 'over', targetId, 1);
  sqlite.prepare(`
    INSERT INTO MarketFetchHistory (gameId, marketType, lastFetched)
    VALUES (?, ?, ?)
  `).run('duplicate-provider-id', 'Rebounds', '2026-01-02T01:00:00Z');
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM test_mfh_audit').get().count, 1);
  assert.ok(sqlite.prepare('SELECT COUNT(*) AS count FROM test_game_reference_rows').get().count > 0);

  const repeated = await migrateGameReferenceConstraints(db);
  assert.deepEqual(repeated, { applied: false, changedTables: [] });
  assert.equal(sqlite.prepare('PRAGMA user_version').get().user_version, 7);
  assert.ok(sqlite.prepare('PRAGMA table_info(Legs)').all()
    .some(column => column.name === 'cloudLineAtPlacement'));

  // An installed build may already have written user_version=6 before the
  // reference repair ran. That value must not suppress a structural repair.
  sqlite.exec(`
    PRAGMA foreign_keys = OFF;
    CREATE TABLE legacy_game_ref_probe (
      id INTEGER PRIMARY KEY,
      gameId TEXT,
      FOREIGN KEY (gameId) REFERENCES Games(gameId)
    );
    INSERT INTO legacy_game_ref_probe (id, gameId) VALUES (1, 'duplicate-provider-id');
    PRAGMA user_version = 6;
    PRAGMA foreign_keys = ON;
  `);
  const upgraded = await migrateGameReferenceConstraints(db);
  assert.deepEqual(upgraded, {
    applied: true,
    changedTables: ['legacy_game_ref_probe'],
  });
  assert.equal(sqlite.prepare('SELECT gameId FROM legacy_game_ref_probe WHERE id = 1').get().gameId, 'duplicate-provider-id');
  assert.equal(sqlite.prepare('PRAGMA foreign_key_list(legacy_game_ref_probe)').all().length, 0);
  assert.equal(sqlite.prepare('PRAGMA user_version').get().user_version, 6);
  console.log('PASS: game-reference migration preserves rows, IDs, sequences, indexes, triggers and views; Games/BetMarkets writes succeed with foreign_keys=ON.');
} finally {
  sqlite.close();
}
