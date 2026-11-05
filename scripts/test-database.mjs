import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTables } from '../api/sqlite/createTables.js';

const directory = mkdtempSync(join(tmpdir(), 'betsmart-db-'));
const filename = join(directory, 'test.db');
let sqlite;
try {
  sqlite = new DatabaseSync(filename);
  const db = { execAsync: async sql => sqlite.exec(sql) };
  await createTables(db);
  sqlite.exec(`
    INSERT INTO Users (id, username, password) VALUES (1, 'local-user', 'test');
    INSERT INTO Bookies (id, name) VALUES (1, 'Local Bookie');
    INSERT INTO BetFormats (id, formatName) VALUES (1, 'Single');
    INSERT INTO BetSlips (formatId, date, odds, betAmount, winnings, userId, bookieId)
    VALUES (1, '2026-01-01', '+100', 10, 20, 1, 1);
  `);
  await createTables(db);
  sqlite.close();
  sqlite = new DatabaseSync(filename);
  await createTables(db);
  assert.equal(sqlite.prepare('SELECT username FROM Users').get().username, 'local-user');
  assert.equal(sqlite.prepare('SELECT betAmount FROM BetSlips').get().betAmount, 10);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM BetSlips').get().count, 1);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'view' AND name = 'OverallBettingPerformance'").get().count, 1);
  console.log('PASS: fresh schema, repeat initialization, persisted betting history, and insight views after reopening.');
} finally {
  sqlite?.close();
  rmSync(directory, { recursive: true, force: true });
}
