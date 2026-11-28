import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { getAllValidParticipantBets, getAllValidParticipantBetsWithResults } from '../db/betslips/ParticipantBets.js';
import { getAllValidLegs, getAllValidLegsWithResults } from '../db/betslips/Legs.js';

const sqlite = new DatabaseSync(':memory:');
try {
  sqlite.exec(`
    CREATE TABLE ParticipantBets (
      id INTEGER PRIMARY KEY, betSlipId INTEGER, gameId TEXT, odds TEXT,
      homeTeamSnapshot TEXT, awayTeamSnapshot TEXT, cloudGameReferenceId TEXT,
      gameDateSnapshot TEXT, leagueSnapshot TEXT,
      homeTeamAbbreviationSnapshot TEXT, awayTeamAbbreviationSnapshot TEXT
    );
    CREATE TABLE Games (gameId TEXT, seasonId INTEGER, date TEXT, timestamp TEXT, homeTeamId INTEGER, awayTeamId INTEGER);
    CREATE TABLE Teams (id INTEGER PRIMARY KEY, teamName TEXT, abbreviation TEXT);
    CREATE TABLE Seasons (id INTEGER PRIMARY KEY, leagueId INTEGER);
    CREATE TABLE Leagues (id INTEGER PRIMARY KEY, leagueName TEXT);
    CREATE TABLE ParticipantBetsResults (participantBetId INTEGER, result TEXT);
    CREATE TABLE Legs (
      id INTEGER PRIMARY KEY, participantBetId INTEGER, betMarketId INTEGER, betTypeId INTEGER,
      marketTypeSnapshot TEXT, marketValueSnapshot TEXT, oddsSnapshot TEXT, overUnderSnapshot TEXT,
      targetNameSnapshot TEXT, targetTypeSnapshot TEXT, betTypeSnapshot TEXT
    );
    CREATE TABLE BetMarkets (id INTEGER PRIMARY KEY, marketType TEXT, value REAL, odds TEXT, overUnder TEXT, betTargetId INTEGER);
    CREATE TABLE BetTargets (id INTEGER PRIMARY KEY, targetName TEXT, targetType TEXT);
    CREATE TABLE BetTypes (id INTEGER PRIMARY KEY, betType TEXT);
    CREATE TABLE LegsResults (legId INTEGER, result TEXT);
    INSERT INTO ParticipantBets VALUES
      (1, 1, NULL, '+100', 'Home Snapshot', 'Away Snapshot', 'missing-game',
       '2026-01-02', 'Historical League', 'HST', 'AST');
    INSERT INTO ParticipantBetsResults VALUES (1, '1');
    INSERT INTO BetTargets VALUES (8, 'Changed Target', 'Team');
    INSERT INTO BetTypes VALUES (9, 'Changed Type');
    INSERT INTO BetMarkets VALUES (7, 'Changed Market', 1, '-100', 'under', 8);
    INSERT INTO Legs VALUES (1, 1, 7, 9, 'Snapshot Market', '21.5', '+120', 'over', 'Historical Player', 'Player', 'Snapshot Type');
    INSERT INTO LegsResults VALUES (1, '1');
    INSERT INTO ParticipantBets VALUES (2, 2, 'legacy-game', '-110', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
    INSERT INTO Teams VALUES (1, 'Home Team', 'HOM'), (2, 'Away Team', 'AWY');
    INSERT INTO Leagues VALUES (1, 'League');
    INSERT INTO Seasons VALUES (1, 1);
    INSERT INTO Games VALUES ('legacy-game', 1, '2026-01-01', '2026-01-01T00:00:00Z', 1, 2);
    INSERT INTO Legs VALUES (2, 2, 7, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
  `);
  const db = { getAllAsync: async (sql, params) => sqlite.prepare(sql).all(...params) };

  for (const getBets of [getAllValidParticipantBets, getAllValidParticipantBetsWithResults]) {
    const [bet] = await getBets(db, [1]);
    assert.equal(bet.gameId, 'missing-game');
    assert.equal(bet.homeTeamName, 'Home Snapshot');
    assert.equal(bet.homeTeamAbv, 'HST');
    assert.equal(bet.awayTeamName, 'Away Snapshot');
    assert.equal(bet.awayTeamAbv, 'AST');
    assert.equal(bet.date, '2026-01-02');
    assert.equal(bet.league, 'Historical League');
  }
  for (const getLegs of [getAllValidLegs, getAllValidLegsWithResults]) {
    const [leg] = await getLegs(db, [1]);
    assert.equal(leg.marketType, 'Snapshot Market');
    assert.equal(leg.value, '21.5');
    assert.equal(leg.odds, '+120');
    assert.equal(leg.betTarget, 'Historical Player');
    assert.equal(leg.targetType, 'Player');
    assert.equal(leg.betType, 'Snapshot Type');
  }

  const [legacyBet] = await getAllValidParticipantBets(db, [2]);
  const [legacyLeg] = await getAllValidLegs(db, [2]);
  assert.equal(legacyBet.homeTeamAbv, 'HOM');
  assert.equal(legacyBet.league, 'League');
  assert.equal(legacyLeg.marketType, 'Changed Market');
  assert.equal(legacyLeg.betTarget, 'Changed Target');
  console.log('PASS: history queries preserve snapshots and retain legacy reference fallback.');
} finally {
  sqlite.close();
}
