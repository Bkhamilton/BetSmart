import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { createTables } from '../api/sqlite/createTables.js';
import { migrateSyncSchema } from '../api/sqlite/syncMigration.js';
import { insertBetSlip } from '../db/betslips/BetSlips.js';
import { insertParticipantBet } from '../db/betslips/ParticipantBets.js';

const sqlite = new DatabaseSync(':memory:');
try {
  const db = {
    execAsync: async sql => sqlite.exec(sql),
    getFirstAsync: async (sql, params = []) => sqlite.prepare(sql).get(...params),
    getAllAsync: async (sql, params = []) => sqlite.prepare(sql).all(...params),
    runAsync: async (sql, params = []) => {
      const result = sqlite.prepare(sql).run(...params);
      return { ...result, lastInsertRowId: Number(result.lastInsertRowid) };
    },
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
    PRAGMA foreign_keys = ON;
    INSERT INTO Users (id, username, cloudUserId) VALUES (1, 'snapshot-test', '11111111-1111-4111-8111-111111111111');
    INSERT INTO Bookies (id, name) VALUES (1, 'Original Book');
    INSERT INTO BetFormats (id, formatName) VALUES (1, 'Single');
  `);
  const slipId = await insertBetSlip(db, 1, '2026-01-01T00:00:00Z', '+100', 10, 20, 1, 1, {
    formatNameSnapshot: 'Single',
    bookieNameSnapshot: 'Original Book',
  });
  await insertParticipantBet(db, slipId, 'provider-game', '+100', {
    sportSnapshot: 'Basketball',
    homeTeamSnapshot: 'Original Home',
    awayTeamSnapshot: 'Original Away',
    gameDateSnapshot: '2026-01-02',
    leagueSnapshot: 'Original League',
    homeTeamAbbreviationSnapshot: 'HOM',
    awayTeamAbbreviationSnapshot: 'AWY',
  });
  const rows = sqlite.prepare('SELECT entityType, payloadJson FROM sync_outbox ORDER BY sequence').all();
  const slip = JSON.parse(rows[0].payloadJson);
  const participant = JSON.parse(rows[1].payloadJson);
  assert.equal(slip.formatNameSnapshot, 'Single');
  assert.equal(slip.bookieNameSnapshot, 'Original Book');
  assert.equal(slip.betSlipCloudId, slip.cloudId);
  assert.equal(slip.parentCloudId, null);
  assert.equal(participant.betSlipCloudId, slip.cloudId);
  assert.equal(participant.parentCloudId, slip.cloudId);
  assert.equal(participant.gameDateSnapshot, '2026-01-02');
  assert.equal(participant.leagueSnapshot, 'Original League');
  assert.equal(participant.homeTeamAbbreviationSnapshot, 'HOM');
  assert.equal(participant.awayTeamAbbreviationSnapshot, 'AWY');
  assert.equal(sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  sqlite.exec(`
    UPDATE BetSlips SET odds = '+105' WHERE id = 1;
    UPDATE sync_outbox SET payloadJson = json_remove(payloadJson, '$.betSlipCloudId', '$.parentCloudId')
    WHERE ownerUserId = 1;
    UPDATE sync_outbox SET attempts = 1 WHERE ownerUserId = 1 AND sequence = 3;
    PRAGMA user_version = 3;
  `);
  const attemptedPayloadBeforeMigration = sqlite.prepare(
    'SELECT payloadJson FROM sync_outbox WHERE sequence = 3'
  ).get().payloadJson;
  await migrateSyncSchema(db);
  assert.ok(sqlite.prepare('PRAGMA table_info(Legs)').all()
    .some(column => column.name === 'cloudLineAtPlacement'));
  const upgraded = sqlite.prepare('SELECT entityType, payloadJson FROM sync_outbox WHERE ownerUserId = 1 ORDER BY sequence').all();
  assert.equal(JSON.parse(upgraded[0].payloadJson).betSlipCloudId, slip.cloudId);
  assert.equal(JSON.parse(upgraded[1].payloadJson).parentCloudId, slip.cloudId);
  assert.equal(JSON.parse(upgraded[2].payloadJson).betSlipCloudId, undefined);
  assert.equal(upgraded[2].payloadJson, attemptedPayloadBeforeMigration);
  assert.equal(JSON.parse(upgraded[0].payloadJson).oddsChanged, 0);
  assert.equal(JSON.parse(upgraded[1].payloadJson).oddsChanged, 0);
  assert.equal(JSON.parse(upgraded[2].payloadJson).oddsChanged, 1);
  sqlite.prepare('UPDATE BetSlips SET cloudNotes = ? WHERE id = 1').run('Unrelated later edit');
  const queuedAfterOddsEdit = sqlite.prepare(`
    SELECT payloadJson FROM sync_outbox
    WHERE entityType = 'bet_slip' AND entityId = ? ORDER BY sequence DESC LIMIT 1
  `).get(slip.cloudId);
  assert.equal(JSON.parse(queuedAfterOddsEdit.payloadJson).oddsChanged, 1);
  sqlite.exec(`
    PRAGMA foreign_keys = OFF;
    INSERT INTO Leagues (id, leagueName, sport) VALUES (1, 'Current League', 'Basketball');
    INSERT INTO Teams (id, teamName, abbreviation, leagueId)
      VALUES (1, 'Home', 'HOM', 1), (2, 'Away', 'AWY', 1);
    INSERT INTO Seasons (id, leagueId, season, games, seasonType, startDate, endDate)
      VALUES (1, 1, '2026', 1, 'Regular Season', '2026-01-01', '2026-12-31');
    INSERT INTO Games (gameId, seasonId, date, timestamp, homeTeamId, awayTeamId)
      VALUES ('provider-game', 1, '2026-01-02', '2026-01-01', 1, 2),
             ('provider-game', 1, '2026-01-03', '2026-01-01', 1, 2);
    PRAGMA foreign_keys = ON;
    INSERT INTO ParticipantBetsResults (participantBetId, result) VALUES (1, '1');
    INSERT INTO Users (id, username, cloudUserId) VALUES (2, 'restore-test', '22222222-2222-4222-8222-222222222222');
    INSERT INTO BetSlips (id, date, betAmount, winnings, userId, formatNameSnapshot, bookieNameSnapshot)
      VALUES (2, '2026-01-01T00:00:00Z', 10, 20, 2, 'Single', 'Historical Book');
    INSERT INTO ParticipantBets (id, betSlipId, leagueSnapshot) VALUES (2, 2, 'Historical League');
    INSERT INTO Legs (id, participantBetId, marketTypeSnapshot, betTypeSnapshot)
      VALUES (2, 2, 'Historical Market', 'Historical Type');
    INSERT INTO BetSlipsResults (betSlipId, result) VALUES (2, '1');
    INSERT INTO ParticipantBetsResults (participantBetId, result) VALUES (2, '1');
    INSERT INTO LegsResults (legId, result) VALUES (2, '1');
  `);
  sqlite.prepare('UPDATE Legs SET cloudLineAtPlacement = ? WHERE id = 2').run('17.2500');
  const capturedLineUpdate = JSON.parse(sqlite.prepare(`
    SELECT payloadJson FROM sync_outbox
    WHERE entityType = 'bet_leg' AND entityId = (SELECT cloudId FROM Legs WHERE id = 2)
    ORDER BY sequence DESC LIMIT 1
  `).get().payloadJson);
  assert.equal(capturedLineUpdate.cloudLineAtPlacement, '17.2500');
  assert.equal(sqlite.prepare('SELECT total_bets FROM LeaguePerformance WHERE userId = 1').get().total_bets, 1);
  assert.equal(sqlite.prepare('SELECT leagueName FROM LeaguePerformance WHERE userId = 2').get().leagueName, 'Historical League');
  assert.equal(sqlite.prepare('SELECT market_name FROM MarketPerformance WHERE userId = 2').get().market_name, 'Historical Market');
  assert.equal(sqlite.prepare('SELECT betType FROM BetTypePerformance WHERE userId = 2').get().betType, 'Historical Type');
  assert.equal(sqlite.prepare('SELECT format_name FROM BetFormatPerformance WHERE userId = 2').get().format_name, 'Single');
  assert.equal(sqlite.prepare('SELECT bookie_name FROM BookiePerformance WHERE userId = 2').get().bookie_name, 'Historical Book');
  const secondSlipCloud = sqlite.prepare('SELECT cloudId FROM BetSlips WHERE id = 2').get().cloudId;
  const secondParticipantCloud = sqlite.prepare('SELECT cloudId FROM ParticipantBets WHERE id = 2').get().cloudId;
  sqlite.exec(`
    DELETE FROM LegsResults WHERE legId = 2;
    DELETE FROM Legs WHERE id = 2;
    DELETE FROM ParticipantBetsResults WHERE participantBetId = 2;
    DELETE FROM ParticipantBets WHERE id = 2;
    DELETE FROM BetSlipsResults WHERE betSlipId = 2;
    DELETE FROM BetSlips WHERE id = 2;
  `);
  const deletionPayloads = sqlite.prepare(
    "SELECT entityType, payloadJson FROM sync_outbox WHERE ownerUserId = 2 AND action = 'delete' ORDER BY sequence"
  ).all();
  assert.equal(deletionPayloads.length, 3);
  for (const row of deletionPayloads) {
    const payload = JSON.parse(row.payloadJson);
    assert.equal(payload.betSlipCloudId, secondSlipCloud);
    if (row.entityType === 'bet_leg') assert.equal(payload.parentCloudId, secondParticipantCloud);
    if (row.entityType === 'participant_bet') assert.equal(payload.parentCloudId, secondSlipCloud);
    if (row.entityType === 'bet_leg') assert.equal(payload.cloudLineAtPlacement, '17.2500');
  }
  console.log('PASS: new history snapshots are recorded in the transactional outbox with foreign keys enabled.');
} finally {
  sqlite.close();
}
