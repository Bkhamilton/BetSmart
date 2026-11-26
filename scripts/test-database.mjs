import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTables } from '../api/sqlite/createTables.js';
import {
  acknowledgeSyncOperation,
  claimPendingSyncOperations,
  getUserSyncState,
  markSyncOperationFailed,
  saveUserPullCursor,
} from '../db/sync/outbox.js';

const directory = mkdtempSync(join(tmpdir(), 'betsmart-db-'));
const filename = join(directory, 'test.db');
let sqlite;
try {
  sqlite = new DatabaseSync(filename);
  sqlite.exec(`
    PRAGMA foreign_keys = OFF;
    CREATE TABLE Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
    CREATE TABLE UserSessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER REFERENCES Users(id)
    );
    CREATE TABLE BetSlips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      formatId INTEGER NOT NULL,
      date TEXT NOT NULL,
      odds TEXT NOT NULL,
      betAmount REAL NOT NULL,
      winnings REAL,
      userId INTEGER NOT NULL,
      bookieId INTEGER NOT NULL,
      FOREIGN KEY (formatId) REFERENCES BetFormats(id),
      FOREIGN KEY (userId) REFERENCES Users(id),
      FOREIGN KEY (bookieId) REFERENCES Bookies(id),
      UNIQUE (formatId, date, odds, betAmount, winnings, userId, bookieId)
    );
    INSERT INTO Users (id, name, email, username, password)
    VALUES (1, 'Local User', 'local@example.com', 'local-user', 'legacy-password');
    INSERT INTO UserSessions (userId) VALUES (1);
    INSERT INTO BetSlips (id, formatId, date, odds, betAmount, winnings, userId, bookieId)
    VALUES (1, 1, '2026-01-01', '+100', 10, 20, 1, 1);
  `);
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

  await createTables(db);
  sqlite.exec(`
    INSERT INTO Bookies (id, name) VALUES (1, 'Local Bookie');
    INSERT INTO BetFormats (id, formatName) VALUES (1, 'Single');
  `);
  await createTables(db);
  sqlite.close();
  sqlite = new DatabaseSync(filename);
  await createTables(db);
  sqlite.exec('PRAGMA foreign_keys = OFF');

  const betSlip = sqlite.prepare('SELECT * FROM BetSlips').get();
  assert.match(betSlip.cloudId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = 1').get().count, 1);

  sqlite.prepare(`
    INSERT INTO ParticipantBets
      (betSlipId, gameId, odds, sportSnapshot, homeTeamSnapshot, awayTeamSnapshot)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(betSlip.id, 'game-1', '+100', 'Basketball', 'Home', 'Away');
  const participantBet = sqlite.prepare('SELECT * FROM ParticipantBets').get();
  sqlite.prepare(`
    INSERT INTO Legs (
      participantBetId, betMarketId, betTypeId, marketTypeSnapshot,
      marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
      targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot,
      bookieIdSnapshot, betTypeSnapshot
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(participantBet.id, 1, 1, 'Player Points', '20.5', '+110', 'over', 4, 'Test Player', 'Player', 1, 'Player Points');
  assert.equal(participantBet.sportSnapshot, 'Basketball');
  assert.equal(sqlite.prepare('SELECT marketValueSnapshot FROM Legs').get().marketValueSnapshot, '20.5');
  sqlite.prepare('INSERT INTO BetSlipsResults (betSlipId, result) VALUES (?, ?)').run(betSlip.id, 1);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = 1').get().count, 4);

  sqlite.prepare('UPDATE BetSlips SET betAmount = ? WHERE id = ?').run(12, betSlip.id);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = 1').get().count, 5);
  assert.equal(
    JSON.parse(sqlite.prepare("SELECT payloadJson FROM sync_outbox WHERE entityType = 'bet_slip' AND json_extract(payloadJson, '$.resultDeleted') = 0").get().payloadJson).result,
    '1.0'
  );

  const secondUser = sqlite.prepare(
    'INSERT INTO Users (name, email, username) VALUES (?, ?, ?)'
  ).run('Second User', 'second@example.com', 'second-user').lastInsertRowid;
  const secondSlipId = sqlite.prepare(
    'INSERT INTO BetSlips (formatId, date, odds, betAmount, winnings, userId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(1, '2026-01-02', '+110', 5, 10.5, secondUser, 1).lastInsertRowid;
  assert.throws(
    () => sqlite.prepare('UPDATE BetSlips SET userId = ? WHERE id = ?').run(secondUser, betSlip.id),
    /Bet slip owner cannot be changed/
  );
  assert.throws(
    () => sqlite.prepare('UPDATE ParticipantBets SET betSlipId = ? WHERE id = ?').run(secondSlipId, participantBet.id),
    /Participant bet cannot be moved between accounts/
  );

  const claimed = await claimPendingSyncOperations(db, 1, 20, new Date('2026-11-25T12:00:00.000Z'));
  assert.equal(claimed.length, 3);
  assert.ok(claimed.every((operation) => operation.ownerUserId === 1 && operation.status === 'in_flight'));
  assert.ok(claimed.some((operation) => operation.entityType === 'participant_bet'));
  const slipCreate = claimed.find((operation) => operation.entityType === 'bet_slip');
  const participantCreate = claimed.find((operation) => operation.entityType === 'participant_bet');
  await markSyncOperationFailed(db, 1, participantCreate.id, new Error('Temporary network failure'), '2026-11-25T12:05:00.000Z');
  await acknowledgeSyncOperation(db, 1, slipCreate.id, 1, new Date('2026-11-25T12:01:00.000Z'));
  const nextSlipOperation = await claimPendingSyncOperations(db, 1, 20, new Date('2026-11-25T12:02:00.000Z'));
  assert.equal(nextSlipOperation.length, 1);
  assert.equal(nextSlipOperation[0].entityType, 'bet_slip');
  await acknowledgeSyncOperation(db, 1, nextSlipOperation[0].id, 2, new Date('2026-11-25T12:03:00.000Z'));
  const slipUpdate = await claimPendingSyncOperations(db, 1, 20, new Date('2026-11-25T12:04:00.000Z'));
  assert.equal(slipUpdate.length, 1);
  assert.equal(slipUpdate[0].expectedRevision, 2);
  await acknowledgeSyncOperation(db, 1, slipUpdate[0].id, 3, new Date('2026-11-25T12:04:30.000Z'));
  assert.equal(
    (await claimPendingSyncOperations(db, 1, 20, new Date('2026-11-25T12:04:45.000Z'))).length,
    0
  );
  const retries = await claimPendingSyncOperations(db, 1, 20, new Date('2026-11-25T12:06:00.000Z'));
  assert.equal(retries.length, 2);
  assert.equal(sqlite.prepare('SELECT cloudRevision FROM BetSlips WHERE id = ?').get(betSlip.id).cloudRevision, 3);

  await saveUserPullCursor(db, 1, '123');
  assert.equal((await getUserSyncState(db, 1)).pullCursor, '123');
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = ? AND status = 'pending'").get(secondUser).count,
    1
  );

  const queuedBeforeRollback = sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = 1').get().count;
  await assert.rejects(db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE BetSlips SET betAmount = ? WHERE id = ?', [20, betSlip.id]);
    throw new Error('Rollback expected by test.');
  }), /Rollback expected by test/);
  assert.equal(sqlite.prepare('SELECT betAmount FROM BetSlips WHERE id = ?').get(betSlip.id).betAmount, 12);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = 1').get().count, queuedBeforeRollback);

  assert.equal(sqlite.prepare('SELECT username FROM Users').get().username, 'local-user');
  assert.equal(sqlite.prepare('SELECT betAmount FROM BetSlips WHERE id = ?').get(betSlip.id).betAmount, 12);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips WHERE userId = 1').get().count, 1);
  assert.equal(sqlite.prepare('SELECT cloudUserId FROM Users WHERE id = 1').get().cloudUserId, null);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM pragma_table_info('Users') WHERE name = 'password'").get().count, 0);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'table' AND name = 'UserSessions'").get().count, 0);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'view' AND name = 'OverallBettingPerformance'").get().count, 1);
  sqlite.prepare('DELETE FROM BetSlipsResults WHERE betSlipId = ?').run(betSlip.id);
  sqlite.prepare('DELETE FROM BetSlips WHERE id = ?').run(betSlip.id);
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS count FROM sync_outbox WHERE ownerUserId = 1 AND action = 'delete'").get().count,
    1
  );
  assert.equal(
    JSON.parse(sqlite.prepare("SELECT payloadJson FROM sync_outbox WHERE entityType = 'bet_slip' AND json_extract(payloadJson, '$.resultDeleted') = 1").get().payloadJson).resultDeleted,
    1
  );
  console.log('PASS: auth migration preserves local IDs/history, removes passwords/sessions, and repeated initialization remains stable.');
} finally {
  sqlite?.close();
  rmSync(directory, { recursive: true, force: true });
}
