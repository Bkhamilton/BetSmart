import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createTables } from '../api/sqlite/createTables.js';
import { migrateGameReferenceConstraints } from '../api/sqlite/gameReferenceMigration.js';
import { migrateLinePlacementSnapshot } from '../api/sqlite/linePlacementMigration.js';
import { insertBetSlip } from '../db/betslips/BetSlips.js';
import { insertParticipantBet } from '../db/betslips/ParticipantBets.js';
import { insertLeg } from '../db/betslips/Legs.js';
import { pushHistory } from '../db/sync/push.js';
import { pullHistory } from '../db/sync/pull.js';

if (process.env.PGDATABASE !== 'betsmart_phase4_test'
    || !['127.0.0.1', 'localhost', '::1'].includes(process.env.PGHOST)) {
  throw new Error('Use only a local, disposable betsmart_phase4_test PostgreSQL database.');
}
const psql = process.env.PSQL || 'psql';
const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const directory = mkdtempSync(join(tmpdir(), 'betsmart-phase4-e2e-'));
const opened = [];
let insertedUsers = false;

const literal = value => `'${String(value).replace(/'/g, "''")}'`;
const sql = statement => execFileSync(psql, [
  '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-c', statement,
], { encoding: 'utf8', env: process.env, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const asOwner = (user, statement) => sql(
  `SET "request.jwt.claim.sub" = ${literal(user)}; SET ROLE authenticated; ${statement}`
);

const makeClient = user => {
  let loseNextResponse = false;
  return {
    loseNextResponse: () => { loseNextResponse = true; },
    auth: {
      getSession: async () => ({ data: { session: { user: { id: user } } }, error: null }),
      getUser: async () => ({ data: { user: { id: user } }, error: null }),
    },
    rpc: async (name, args) => {
      try {
        let query;
        if (name === 'bs_apply_sync_batch') {
          query = `SELECT public.bs_apply_sync_batch(${literal(JSON.stringify(args.p_operations))}::jsonb)::text`;
        } else if (name === 'bs_get_sync_history_page') {
          query = `SELECT public.bs_get_sync_history_page(${literal(args.p_expected_user_id)}::uuid, ${literal(args.p_after)}::bigint, ${Number(args.p_limit)})::text`;
        } else {
          throw new Error(`Unexpected RPC: ${name}`);
        }
        const data = JSON.parse(asOwner(user, query));
        if (loseNextResponse && name === 'bs_apply_sync_batch') {
          loseNextResponse = false;
          return { data: null, error: { message: 'Synthetic lost response' } };
        }
        return { data, error: null };
      } catch (error) {
        const message = error.stderr ? String(error.stderr) : error.message;
        return { data: null, error: { message, code: /revision conflict/i.test(message) ? '40001' : undefined } };
      }
    },
  };
};

const openDevice = async (name, user, localId, existing = false) => {
  const sqlite = new DatabaseSync(join(directory, `${name}.sqlite`));
  opened.push(sqlite);
  const db = {
    execAsync: async statement => sqlite.exec(statement),
    getFirstAsync: async (statement, params = []) => sqlite.prepare(statement).get(...params),
    getAllAsync: async (statement, params = []) => sqlite.prepare(statement).all(...params),
    runAsync: async (statement, params = []) => {
      const result = sqlite.prepare(statement).run(...params);
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
  await migrateGameReferenceConstraints(db);
  await migrateLinePlacementSnapshot(db);
  if (!existing) {
    sqlite.prepare('INSERT INTO Users (id, username, cloudUserId) VALUES (?, ?, ?)')
      .run(localId, name, user);
  }
  return { sqlite, db, localId };
};

try {
  assert.equal(sql('SELECT current_database()'), 'betsmart_phase4_test');
  assert.equal(Number(sql(`SELECT count(*) FROM auth.users WHERE id IN (${literal(owner)}, ${literal(other)})`)), 0);
  sql(`INSERT INTO auth.users (id) VALUES (${literal(owner)}), (${literal(other)})`);
  insertedUsers = true;
  let source = await openDevice('source', owner, 1);
  const target = await openDevice('target', owner, 7);
  const conflicting = await openDevice('conflicting', owner, 9);
  const separate = await openDevice('separate', other, 11);
  const client = makeClient(owner);
  const otherClient = makeClient(other);

  source.sqlite.exec(`
    PRAGMA foreign_keys = ON;
    INSERT INTO Leagues (id, leagueName, sport) VALUES (1, 'Synthetic League', 'Basketball');
    INSERT INTO Teams (id, teamName, abbreviation, leagueId)
      VALUES (1, 'Home', 'HOM', 1), (2, 'Away', 'AWY', 1);
    INSERT INTO Seasons (id, leagueId, season, games, seasonType, startDate, endDate)
      VALUES (1, 1, '2026', 1, 'Regular Season', '2026-01-01', '2026-12-31');
    INSERT INTO Games (gameId, seasonId, date, timestamp, homeTeamId, awayTeamId)
      VALUES ('synthetic-game', 1, '2026-01-02', '2026-01-01', 1, 2);
    INSERT INTO Bookies (id, name) VALUES (1, 'Synthetic Book');
    INSERT INTO BetFormats (id, formatName) VALUES (1, 'Single');
    INSERT INTO BetTypes (id, betType) VALUES (1, 'Player Points');
    INSERT INTO BetTargets (id, targetType, targetName) VALUES (1, 'Player', 'Synthetic Player');
    INSERT INTO BetMarkets (id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
      VALUES (1, 'synthetic-game', 'points', '2026-01-01T00:00:00Z', 20.5, '+110', 'over', 1, 1);
  `);
  let slipId;
  let participantId;
  let legId;
  await source.db.withTransactionAsync(async () => {
    slipId = await insertBetSlip(source.db, 1, '2026-01-01T12:00:00Z', '+110', 10, 21, 1, 1, {
      formatNameSnapshot: 'Single', bookieNameSnapshot: 'Synthetic Book',
    });
    participantId = await insertParticipantBet(source.db, slipId, 'synthetic-game', '+110', {
      sportSnapshot: 'Basketball', homeTeamSnapshot: 'Home', awayTeamSnapshot: 'Away',
      gameDateSnapshot: '2026-01-02', leagueSnapshot: 'Synthetic League',
      homeTeamAbbreviationSnapshot: 'HOM', awayTeamAbbreviationSnapshot: 'AWY',
    });
    legId = await insertLeg(source.db, participantId, 1, 1, {
      marketTypeSnapshot: 'points', marketValueSnapshot: '20.5', oddsSnapshot: '+110',
      overUnderSnapshot: 'over', targetNameSnapshot: 'Synthetic Player',
      targetTypeSnapshot: 'Player', betTypeSnapshot: 'Player Points',
    });
  });
  assert.equal(source.sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  source.sqlite.close();
  opened.splice(opened.indexOf(source.sqlite), 1);
  source = await openDevice('source', owner, 1, true);

  client.loseNextResponse();
  await pushHistory(source.db, client, 1, owner);
  await pushHistory(source.db, client, 1, owner);
  assert.equal(source.sqlite.prepare("SELECT count(*) AS n FROM sync_outbox WHERE status != 'acked'").get().n, 0);
  assert.equal(Number(asOwner(owner, 'SELECT count(*) FROM public.bs_bet_slips')), 1);
  assert.equal(Number(asOwner(owner, 'SELECT count(*) FROM public.bs_participant_bets')), 1);
  assert.equal(Number(asOwner(owner, 'SELECT count(*) FROM public.bs_bet_legs')), 1);
  assert.equal(Number(asOwner(other, 'SELECT count(*) FROM public.bs_bet_slips')), 0);
  assert.throws(() => sql('SET ROLE anon; SELECT * FROM public.bs_bet_slips'));
  assert.throws(() => asOwner(other,
    `SELECT public.bs_get_sync_history_page(${literal(owner)}::uuid, 0, 100)`));

  await pullHistory(target.db, client, 7, owner);
  const slip = target.sqlite.prepare('SELECT * FROM BetSlips WHERE userId = 7').get();
  const participant = target.sqlite.prepare('SELECT * FROM ParticipantBets WHERE betSlipId = ?').get(slip.id);
  const leg = target.sqlite.prepare('SELECT * FROM Legs WHERE participantBetId = ?').get(participant.id);
  assert.equal(slip.bookieNameSnapshot, 'Synthetic Book');
  assert.equal(participant.leagueSnapshot, 'Synthetic League');
  assert.equal(leg.marketValueSnapshot, '20.5');
  assert.equal(target.sqlite.prepare("SELECT count(*) AS n FROM sync_outbox WHERE status != 'acked'").get().n, 0);

  const sourceSlip = source.sqlite.prepare('SELECT cloudId FROM BetSlips WHERE id = ?').get(slipId);
  const sourceParticipant = source.sqlite.prepare('SELECT cloudId FROM ParticipantBets WHERE id = ?').get(participantId);
  const sourceLeg = source.sqlite.prepare('SELECT cloudId, cloudRevision FROM Legs WHERE id = ?').get(legId);
  const lineChange = await client.rpc('bs_apply_sync_batch', { p_operations: [{
    operation_id: '33333333-3333-4333-8333-333333333333',
    entity_type: 'bet_leg',
    entity_id: sourceLeg.cloudId,
    action: 'upsert',
    expected_revision: sourceLeg.cloudRevision,
    payload: {
      user_id: owner,
      bet_slip_cloud_id: sourceSlip.cloudId,
      parent_cloud_id: sourceParticipant.cloudId,
      participant_bet_id: sourceParticipant.cloudId,
      line_at_placement: '19.7500',
      market_value_snapshot: '20.5',
    },
  }] });
  assert.equal(lineChange.error, null);
  await pullHistory(source.db, client, 1, owner);
  await pullHistory(target.db, client, 7, owner);
  const restoredLine = target.sqlite.prepare('SELECT cloudLineAtPlacement, marketValueSnapshot FROM Legs WHERE id = ?').get(leg.id);
  assert.equal(restoredLine.cloudLineAtPlacement, '19.7500');
  assert.equal(restoredLine.marketValueSnapshot, '20.5');
  await target.db.runAsync('UPDATE Legs SET targetNameSnapshot = ? WHERE id = ?', ['Renamed Player', leg.id]);
  await pushHistory(target.db, client, 7, owner);
  assert.equal(target.sqlite.prepare("SELECT count(*) AS n FROM sync_outbox WHERE status != 'acked'").get().n, 0);
  assert.equal(asOwner(owner, `SELECT line_at_placement::text FROM public.bs_bet_legs WHERE id = ${literal(sourceLeg.cloudId)}::uuid`), '19.7500');
  await pullHistory(source.db, client, 1, owner);

  await pullHistory(separate.db, otherClient, 11, other);
  assert.equal(separate.sqlite.prepare('SELECT count(*) AS n FROM BetSlips').get().n, 0);

  await source.db.withTransactionAsync(async () => {
    await source.db.runAsync('INSERT INTO LegsResults (legId, result) VALUES (?, ?)', [legId, 1]);
    await source.db.runAsync('INSERT INTO ParticipantBetsResults (participantBetId, result) VALUES (?, ?)', [participantId, 1]);
    await source.db.runAsync('INSERT INTO BetSlipsResults (betSlipId, result) VALUES (?, ?)', [slipId, 1]);
  });
  await pushHistory(source.db, client, 1, owner);
  await pullHistory(target.db, client, 7, owner);
  assert.equal(target.sqlite.prepare('SELECT result FROM BetSlipsResults WHERE betSlipId = ?').get(slip.id).result, '1');
  assert.equal(target.sqlite.prepare('SELECT result FROM LegsResults WHERE legId = ?').get(leg.id).result, '1');

  await pullHistory(conflicting.db, client, 9, owner);
  const conflictSlip = conflicting.sqlite.prepare('SELECT id FROM BetSlips WHERE userId = 9').get().id;
  await source.db.runAsync('UPDATE BetSlips SET betAmount = ? WHERE id = ?', [11, slipId]);
  await conflicting.db.runAsync('UPDATE BetSlips SET betAmount = ? WHERE id = ?', [12, conflictSlip]);
  await pushHistory(source.db, client, 1, owner);
  await pushHistory(conflicting.db, client, 9, owner);
  assert.equal(conflicting.sqlite.prepare('SELECT betAmount FROM BetSlips WHERE id = ?').get(conflictSlip).betAmount, 12);
  assert.ok(conflicting.sqlite.prepare("SELECT count(*) AS n FROM sync_outbox WHERE status != 'acked'").get().n > 0);
  assert.equal(asOwner(owner, 'SELECT stake = 11 FROM public.bs_bet_slips'), 't');

  await source.db.withTransactionAsync(async () => {
    await source.db.runAsync('DELETE FROM LegsResults WHERE legId = ?', [legId]);
    await source.db.runAsync('DELETE FROM Legs WHERE id = ?', [legId]);
    await source.db.runAsync('DELETE FROM ParticipantBetsResults WHERE participantBetId = ?', [participantId]);
    await source.db.runAsync('DELETE FROM ParticipantBets WHERE id = ?', [participantId]);
    await source.db.runAsync('DELETE FROM BetSlipsResults WHERE betSlipId = ?', [slipId]);
    await source.db.runAsync('DELETE FROM BetSlips WHERE id = ?', [slipId]);
  });
  await pushHistory(source.db, client, 1, owner);
  assert.equal(source.sqlite.prepare("SELECT count(*) AS n FROM sync_outbox WHERE status != 'acked'").get().n, 0);
  await pullHistory(target.db, client, 7, owner);
  assert.equal(target.sqlite.prepare('SELECT count(*) AS n FROM BetSlips WHERE userId = 7').get().n, 0);
  console.log('PASS: PostgreSQL and SQLite devices preserve, settle, retry, restore and delete history.');
} finally {
  for (const sqlite of opened) sqlite.close();
  if (insertedUsers) sql(`DELETE FROM auth.users WHERE id IN (${literal(owner)}, ${literal(other)})`);
  rmSync(directory, { recursive: true, force: true });
}
