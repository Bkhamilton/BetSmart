import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTables } from '../api/sqlite/createTables.js';
import { pushHistory } from '../db/sync/push.js';

const CLOUD_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const CLOUD_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const CLOUD_OTHER = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const CLOUD_C = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const directory = mkdtempSync(join(tmpdir(), 'betsmart-phase4-push-'));
const sqlite = new DatabaseSync(join(directory, 'push.db'));
const cloudRows = new Map();
const operationReceipts = new Map();
const calls = [];
let currentCloudUser = CLOUD_A;
let failAfterCommitOnce = false;
let afterDispatch = null;
let invalidFixtureSequence = 1;

const db = {
    execAsync: async (sql) => sqlite.exec(sql),
    getFirstAsync: async (sql, parameters = []) => sqlite.prepare(sql).get(...parameters),
    getAllAsync: async (sql, parameters = []) => sqlite.prepare(sql).all(...parameters),
    runAsync: async (sql, parameters = []) => sqlite.prepare(sql).run(...parameters),
    withTransactionAsync: async (callback) => {
        sqlite.exec('BEGIN');
        try {
            await callback();
            sqlite.exec('COMMIT');
        } catch (error) {
            sqlite.exec('ROLLBACK');
            throw error;
        }
    },
    withExclusiveTransactionAsync: async (callback) => {
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

class RpcFailure extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

const cloneMap = (source) => new Map(
    [...source.entries()].map(([key, value]) => [key, structuredClone(value)])
);

const entityKey = (operation) => `${operation.entity_type}:${operation.entity_id}`;

const validateAndApply = (operations, nextRows, nextReceipts) => {
    const aggregateIds = new Set(operations.map((operation) =>
        operation.payload.bet_slip_cloud_id
    ));
    if (aggregateIds.size !== 1 || !aggregateIds.has([...aggregateIds][0])) {
        throw new RpcFailure('A sync RPC must contain exactly one complete bet-slip aggregate.', '23514');
    }
    const aggregateId = [...aggregateIds][0];
    if (typeof aggregateId !== 'string' || !aggregateId) {
        throw new RpcFailure('Missing immutable bet-slip aggregate marker.', '23514');
    }
    if (operations.some((operation) =>
        operation.payload.user_id !== currentCloudUser
        || operation.payload.bet_slip_cloud_id !== aggregateId
    )) {
        throw new RpcFailure('Payload owner or aggregate marker does not match the RPC context.', '42501');
    }

    const responses = [];
    for (const operation of operations) {
        const requestJson = JSON.stringify(operation);
        const prior = nextReceipts.get(operation.operation_id);
        if (prior) {
            if (prior.requestJson !== requestJson) {
                throw new RpcFailure('Operation ID was already used with a different request.', 'P0001');
            }
            responses.push(prior.response);
            continue;
        }
        const key = entityKey(operation);
        const old = nextRows.get(key);
        const hasReceipt = nextReceipts.has(operation.operation_id);
        const revision = old?.revision ?? 0;
        if (revision !== operation.expected_revision) {
            throw new RpcFailure('Sync revision conflict.', '40001');
        }
        if (operation.action === 'delete' && !old) {
            throw new RpcFailure('Sync revision conflict.', '40001');
        }

        if (operation.entity_type === 'bet_slip' && operation.entity_id !== aggregateId) {
            throw new RpcFailure('Bet-slip entity does not match aggregate marker.', '23514');
        }
        if (operation.entity_type === 'participant_bet') {
            const parentId = operation.action === 'upsert'
                ? operation.payload.bet_slip_id
                : old?.payload.bet_slip_id;
            if (operation.payload.parent_cloud_id !== parentId || parentId !== aggregateId) {
                throw new RpcFailure('Participant parent marker does not match aggregate root.', '23514');
            }
            const parent = nextRows.get(`bet_slip:${parentId}`);
            if (operation.action === 'upsert' && !hasReceipt && (!parent || parent.deleted)) {
                throw new RpcFailure('Missing live bet-slip parent.', '23503');
            }
        }
        if (operation.entity_type === 'bet_leg') {
            const parentId = operation.action === 'upsert'
                ? operation.payload.participant_bet_id
                : old?.payload.participant_bet_id;
            if (operation.payload.parent_cloud_id !== parentId) {
                throw new RpcFailure('Leg parent marker does not match stored participant.', '23514');
            }
            const parent = nextRows.get(`participant_bet:${parentId}`);
            const root = parent?.payload.bet_slip_id;
            if (root !== aggregateId) {
                throw new RpcFailure('Leg parent does not match aggregate root.', '23514');
            }
            if (operation.action === 'upsert' && !hasReceipt && (!parent || parent.deleted)) {
                throw new RpcFailure('Missing live participant parent.', '23503');
            }
        }
        if (operation.action === 'delete' && operation.entity_type === 'bet_slip') {
            const liveChildren = [...nextRows.values()].some((row) =>
                row.entity_type === 'participant_bet'
                && row.payload.bet_slip_id === operation.entity_id
                && !row.deleted
            );
            if (liveChildren) throw new RpcFailure('A live child cannot remain under a deleted parent.', '23503');
        }
        const response = {
            operation_id: operation.operation_id,
            entity_type: operation.entity_type,
            entity_id: operation.entity_id,
            revision: revision + 1,
            deleted_at: operation.action === 'delete' ? '2026-11-27T00:00:00Z' : null,
        };
        nextRows.set(key, {
            entity_type: operation.entity_type,
            revision: revision + 1,
            deleted: operation.action === 'delete',
            payload: { ...(old?.payload ?? {}), ...operation.payload },
        });
        nextReceipts.set(operation.operation_id, { requestJson, response });
        responses.push(response);
    }

    const root = nextRows.get(`bet_slip:${aggregateId}`);
    if (root?.deleted) {
        const liveParticipant = [...nextRows.values()].some((row) =>
            row.entity_type === 'participant_bet'
            && row.payload.bet_slip_id === aggregateId
            && !row.deleted
        );
        if (liveParticipant) {
            throw new RpcFailure('Aggregate deletion leaves a live participant under a tombstone.', '23514');
        }
    }
    const deletedParticipants = [...nextRows.entries()].filter(([key, row]) =>
        key.startsWith('participant_bet:') && row.deleted
    );
    for (const [participantKey] of deletedParticipants) {
        const participantId = participantKey.slice('participant_bet:'.length);
        const liveLeg = [...nextRows.values()].some((row) =>
            row.entity_type === 'bet_leg'
            && row.payload.participant_bet_id === participantId
            && !row.deleted
        );
        if (liveLeg) {
            throw new RpcFailure('Aggregate deletion leaves a live leg under a tombstone.', '23514');
        }
    }
    return responses;
};

const client = {
    auth: {
        getSession: async () => ({
            data: { session: { user: { id: currentCloudUser } } },
            error: null,
        }),
    },
    rpc: async (functionName, args) => {
        assert.equal(functionName, 'bs_apply_sync_batch');
        assert.deepEqual(Object.keys(args), ['p_operations']);
        assert.ok(Array.isArray(args.p_operations));
        calls.push(structuredClone(args.p_operations));
        const nextRows = cloneMap(cloudRows);
        const nextReceipts = cloneMap(operationReceipts);
        try {
            const responses = validateAndApply(args.p_operations, nextRows, nextReceipts);
            // Commit only after every operation validates, matching the SQL RPC.
            cloudRows.clear();
            for (const [key, value] of nextRows) cloudRows.set(key, value);
            operationReceipts.clear();
            for (const [key, value] of nextReceipts) operationReceipts.set(key, value);
            if (afterDispatch) {
                const hook = afterDispatch;
                afterDispatch = null;
                await hook();
            }
            if (failAfterCommitOnce) {
                failAfterCommitOnce = false;
                return { data: null, error: new RpcFailure('Simulated lost RPC response.', 'NETWORK') };
            }
            return { data: responses, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },
};

const insertSlip = (userId, placedAt, stake = 10, winnings = 20) => {
    sqlite.prepare(`
        INSERT INTO BetSlips (formatId, date, odds, betAmount, winnings, userId, bookieId)
        VALUES (1, ?, '+100', ?, ?, ?, 1)
    `).run(placedAt, stake, winnings, userId);
    return sqlite.prepare('SELECT * FROM BetSlips WHERE id = last_insert_rowid()').get();
};

const statusFor = (operationId) => sqlite.prepare(
    'SELECT status, lastError FROM sync_outbox WHERE id = ?'
).get(operationId);

const assertInvalidFinancialPayloadIsBlocked = async (field, value, { remove = false } = {}) => {
    const minute = String(invalidFixtureSequence++).padStart(2, '0');
    const slip = insertSlip(1, `2026-09-29T00:${minute}:00Z`);
    const operationRows = sqlite.prepare(
        'SELECT id, payloadJson FROM sync_outbox WHERE entityType = ? AND entityId = ?'
    ).all('bet_slip', slip.cloudId);
    assert.ok(operationRows.length > 0);
    for (const row of operationRows) {
        const payload = JSON.parse(row.payloadJson);
        if (remove) delete payload[field];
        else payload[field] = value;
        sqlite.prepare('UPDATE sync_outbox SET payloadJson = ? WHERE id = ?')
            .run(JSON.stringify(payload), row.id);
    }

    const rpcCount = calls.length;
    const result = await pushHistory(db, client, 1, CLOUD_A);
    assert.ok(result.failed > 0, `${field}=${String(value)} should fail safely`);
    assert.equal(calls.length, rpcCount, 'invalid source data must not reach Supabase');
    assert.ok(result.blocked.some((item) => /invalid|blank|required|incomplete|missing/i.test(item.reason)));

    // Isolate each malformed fixture; the test is about validation, not retry.
    sqlite.prepare(`
        UPDATE sync_outbox SET status = 'acked'
        WHERE ownerUserId = 1 AND entityId = ?
    `).run(slip.cloudId);
};

try {
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
            FOREIGN KEY (bookieId) REFERENCES Bookies(id)
        );
        INSERT INTO Users (id, name, email, username, password)
        VALUES (1, 'Local A', 'a@example.test', 'local-a', 'legacy'),
               (2, 'Local B', 'b@example.test', 'local-b', 'legacy');
    `);
    await createTables(db);
    sqlite.exec(`
        UPDATE Users SET cloudUserId = '${CLOUD_A}' WHERE id = 1;
        UPDATE Users SET cloudUserId = '${CLOUD_B}' WHERE id = 2;
        INSERT INTO Users (id, name, email, username, cloudUserId)
        VALUES (3, 'Local C', 'c@example.test', 'local-c', '${CLOUD_C}');
        INSERT INTO Bookies (id, name) VALUES (1, 'Reference Book');
        INSERT INTO BetFormats (id, formatName) VALUES (1, 'Parlay');
    `);
    sqlite.exec('PRAGMA foreign_keys = ON');
    assert.equal(sqlite.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);

    // Keep enforcement ON for the remaining regression. The concurrent Phase 3
    // pull migration rebuilds ParticipantBets without its invalid gameId FK;
    // the existing BetMarkets FK still targets non-unique Games.gameId.
    const participantForeignKeys = sqlite.prepare('PRAGMA foreign_key_list(ParticipantBets)').all();
    assert.equal(participantForeignKeys.some((row) => row.from === 'gameId'), false);
    const schemaProbeSlip = insertSlip(1, '2026-09-30T12:00:00Z');
    assert.throws(() => sqlite.prepare(`
        INSERT INTO BetMarkets
            (gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
        VALUES ('fixture-game', 'Probe', '2026-09-30T00:00:00Z', 1, '+100', 'over', 13, 1)
    `).run(), /foreign key mismatch/i);
    // This fixture exists only to assert the legacy FK mismatch and is not
    // part of the sync test ledger.
    sqlite.prepare(`
        UPDATE sync_outbox SET status = 'acked'
        WHERE ownerUserId = 1 AND entityId = ?
    `).run(schemaProbeSlip.cloudId);
    // This index is test-only and the fixture has one game ID. Production must
    // not add it without proving that historical data has no duplicates.
    sqlite.exec('CREATE UNIQUE INDEX test_only_games_game_id ON Games(gameId)');
    sqlite.exec(`
        INSERT INTO Leagues (id, leagueName, sport) VALUES (1, 'Test League', 'Basketball');
        INSERT INTO Teams (id, teamName, abbreviation, leagueId) VALUES
            (1, 'Home Team', 'HOM', 1), (2, 'Away Team', 'AWY', 1);
        INSERT INTO Seasons (id, leagueId, season, games, seasonType, startDate, endDate)
        VALUES (1, 1, '2026', 1, 'Regular Season', '2026-01-01', '2026-12-31');
        INSERT INTO Games (id, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId)
        VALUES (1, 'game-1', 1, '2026-10-02', '2026-10-02T00:00:00Z', 1, 2);
        INSERT INTO BetTargets (id, targetType, targetName, gameId)
        VALUES (13, 'Player', 'Player X', 'game-1');
        INSERT INTO BetTypes (id, betType) VALUES (12, 'Player Points');
        INSERT INTO BetMarkets
            (id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
        VALUES (11, 'game-1', 'Points', '2026-10-02T00:00:00Z', 20.5, '-110', 'over', 13, 1);
    `);

    // Source payloads are complete snapshots: null/blank/boolean coercions
    // cannot silently turn a financial input into zero, and missing keys are
    // not treated as an explicit nullable payout.
    const exactMoneySlip = insertSlip(1, '2026-09-29T00:00:00Z');
    const exactMoneyRows = sqlite.prepare(
        'SELECT id, payloadJson FROM sync_outbox WHERE entityType = ? AND entityId = ?'
    ).all('bet_slip', exactMoneySlip.cloudId);
    for (const row of exactMoneyRows) {
        const payload = JSON.parse(row.payloadJson);
        payload.cloudCurrencyCode = 'USD';
        payload.cloudStake = '10.00';
        payload.cloudPayout = '20.00';
        sqlite.prepare('UPDATE sync_outbox SET payloadJson = ? WHERE id = ?')
            .run(JSON.stringify(payload), row.id);
    }
    const exactMoneyResult = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(exactMoneyResult.acknowledged, 1);
    assert.equal(calls.at(-1)[0].payload.stake, '10.00');
    assert.equal(calls.at(-1)[0].payload.payout, '20.00');

    await assertInvalidFinancialPayloadIsBlocked('betAmount', null);
    await assertInvalidFinancialPayloadIsBlocked('betAmount', '');
    await assertInvalidFinancialPayloadIsBlocked('betAmount', true);
    await assertInvalidFinancialPayloadIsBlocked('betAmount', undefined, { remove: true });
    await assertInvalidFinancialPayloadIsBlocked('winnings', '');
    await assertInvalidFinancialPayloadIsBlocked('winnings', false);
    await assertInvalidFinancialPayloadIsBlocked('winnings', undefined, { remove: true });

    if (process.env.PHASE4_FINANCIAL_ONLY === '1') {
        console.log('Phase 4 financial source validation checks passed.');
    } else {
    // Missing Supabase configuration fails before claiming and preserves local work.
    const offlineSlip = insertSlip(1, '2026-10-01T12:00:00Z');
    const offlineOperation = sqlite.prepare(
        'SELECT id FROM sync_outbox WHERE entityType = ? AND entityId = ? ORDER BY sequence LIMIT 1'
    ).get('bet_slip', offlineSlip.cloudId).id;
    await assert.rejects(
        pushHistory(db, null, 1, CLOUD_A),
        /Supabase is not configured/
    );
    assert.equal(statusFor(offlineOperation).status, 'pending');
    // Clear this fixture's first operation from the local queue by pushing it.
    let response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 1);

    // Exercise complete supported hierarchy serialization and parent ordering.
    const aggregateSlip = insertSlip(1, '2026-10-02T12:00:00Z', 10, 20);
    sqlite.prepare(`
        INSERT INTO ParticipantBets
            (betSlipId, gameId, odds, sportSnapshot, homeTeamSnapshot, awayTeamSnapshot)
        VALUES (?, 'game-1', '-110', 'Basketball', 'Home', 'Away')
    `).run(aggregateSlip.id);
    const participant = sqlite.prepare('SELECT * FROM ParticipantBets WHERE id = last_insert_rowid()').get();
    sqlite.prepare(`
        INSERT INTO Legs (
            participantBetId, betMarketId, betTypeId, marketTypeSnapshot,
            marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
            targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot,
            bookieIdSnapshot, betTypeSnapshot
        ) VALUES (?, 11, 12, 'Points', '20.5', '-110', 'over', 13, 'Player X', 'Player', 1, 'Player Points')
    `).run(participant.id);
    const leg = sqlite.prepare('SELECT * FROM Legs WHERE id = last_insert_rowid()').get();

    const beforeAggregateCalls = calls.length;
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 3);
    assert.equal(response.failed, 0);
    const aggregateBatch = calls[beforeAggregateCalls];
    assert.deepEqual(aggregateBatch.map((op) => op.entity_type), [
        'bet_slip', 'participant_bet', 'bet_leg',
    ]);
    assert.ok(aggregateBatch.every((op) => op.payload.user_id === CLOUD_A));
    assert.equal(aggregateBatch[0].payload.stake, '10');
    assert.equal(aggregateBatch[0].payload.payout, '20'); // gross return, not net profit
    assert.equal(aggregateBatch[0].payload.currency_code, 'USD');
    assert.equal(aggregateBatch[1].payload.bet_slip_id, aggregateSlip.cloudId);
    assert.equal(aggregateBatch[2].payload.participant_bet_id, participant.cloudId);
    assert.match(aggregateBatch[2].payload.selection_description, /Player X Points 20.5 over/);
    assert.equal(sqlite.prepare('SELECT cloudRevision FROM BetSlips WHERE id = ?').get(aggregateSlip.id).cloudRevision, 1);
    assert.equal(sqlite.prepare('SELECT cloudRevision FROM Legs WHERE id = ?').get(leg.id).cloudRevision, 1);

    // Never-attempted legacy child events can be hydrated from their preserved
    // local parent row; the resulting UUID ancestry is persisted before send.
    const recoverableLegacySlip = insertSlip(1, '2026-10-02T18:00:00Z');
    sqlite.prepare(`
        INSERT INTO ParticipantBets
            (betSlipId, gameId, odds, sportSnapshot)
        VALUES (?, 'game-1', '-110', 'Basketball')
    `).run(recoverableLegacySlip.id);
    const recoverableParticipant = sqlite.prepare(
        'SELECT * FROM ParticipantBets WHERE id = last_insert_rowid()'
    ).get();
    const legacyParticipantOps = sqlite.prepare(`
        SELECT id, payloadJson FROM sync_outbox
        WHERE entityType = 'participant_bet' AND entityId = ?
    `).all(recoverableParticipant.cloudId);
    for (const row of legacyParticipantOps) {
        const payload = JSON.parse(row.payloadJson);
        delete payload.betSlipCloudId;
        delete payload.parentCloudId;
        sqlite.prepare('UPDATE sync_outbox SET payloadJson = ? WHERE id = ?')
            .run(JSON.stringify(payload), row.id);
    }
    const legacyBackfillCallCount = calls.length;
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 2, JSON.stringify(response));
    assert.equal(calls.length, legacyBackfillCallCount + 1);
    const hydratedPayload = JSON.parse(sqlite.prepare(
        'SELECT payloadJson FROM sync_outbox WHERE id = ?'
    ).get(legacyParticipantOps[0].id).payloadJson);
    assert.equal(hydratedPayload.betSlipCloudId, recoverableLegacySlip.cloudId);
    assert.equal(hydratedPayload.parentCloudId, recoverableLegacySlip.cloudId);

    // Exact remote decimal odds survive unrelated edits. Once odds change,
    // every later queued edit must carry the invalidation through the batch;
    // acknowledgement clears the stale local decimal snapshot for future edits.
    const oddsSlip = insertSlip(1, '2026-10-02T19:00:00Z');
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 1);
    const oddsRemote = cloudRows.get(`bet_slip:${oddsSlip.cloudId}`);
    oddsRemote.payload.decimal_odds = '2.400000';
    sqlite.prepare('INSERT OR IGNORE INTO sync_pull_context (userId) VALUES (1)').run();
    sqlite.prepare(`
        UPDATE BetSlips SET cloudDecimalOdds = '2.400000'
        WHERE id = ?
    `).run(oddsSlip.id);
    sqlite.prepare('DELETE FROM sync_pull_context WHERE userId = 1').run();
    sqlite.prepare('UPDATE BetSlips SET cloudNotes = ? WHERE id = ?')
        .run('Unrelated one', oddsSlip.id);
    sqlite.prepare('UPDATE BetSlips SET odds = ? WHERE id = ?')
        .run('-110', oddsSlip.id);
    sqlite.prepare('UPDATE BetSlips SET cloudNotes = ? WHERE id = ?')
        .run('Unrelated two', oddsSlip.id);
    const oddsOperations = sqlite.prepare(`
        SELECT id, payloadJson FROM sync_outbox
        WHERE entityType = 'bet_slip' AND entityId = ? AND status = 'pending'
        ORDER BY sequence
    `).all(oddsSlip.cloudId);
    assert.equal(oddsOperations.length, 3);
    assert.deepEqual(oddsOperations.map((row) => JSON.parse(row.payloadJson).oddsChanged), [
        0, 1, 1,
    ]);
    const oddsPayloadSnapshots = oddsOperations.map((row) => row.payloadJson);
    failAfterCommitOnce = true;
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.failed, 3, JSON.stringify(response));
    const firstOddsRequest = calls.at(-1);
    assert.deepEqual(sqlite.prepare(`
        SELECT payloadJson FROM sync_outbox
        WHERE entityType = 'bet_slip' AND entityId = ? AND lastAttemptAt = (
          SELECT MAX(lastAttemptAt) FROM sync_outbox
          WHERE entityType = 'bet_slip' AND entityId = ?
        )
        ORDER BY sequence
    `).all(oddsSlip.cloudId, oddsSlip.cloudId).map((row) => row.payloadJson), oddsPayloadSnapshots);
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 3, JSON.stringify(response));
    assert.deepEqual(calls.at(-1), firstOddsRequest, 'lost-response odds retry must be byte-stable');
    assert.deepEqual(calls.at(-1).map((operation) => operation.payload.decimal_odds), [
        '2.400000', null, null,
    ]);
    assert.equal(sqlite.prepare(
        'SELECT cloudDecimalOdds FROM BetSlips WHERE id = ?'
    ).get(oddsSlip.id).cloudDecimalOdds, null);

    sqlite.prepare('UPDATE BetSlips SET cloudNotes = ? WHERE id = ?')
        .run('Unrelated after acknowledgement', oddsSlip.id);
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 1, JSON.stringify(response));
    assert.equal(calls.at(-1)[0].payload.decimal_odds, null);

    // Local result events map supported legacy outcomes; placement payout remains gross return.
    sqlite.prepare('INSERT INTO BetSlipsResults (betSlipId, result) VALUES (?, 1)').run(aggregateSlip.id);
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 1, JSON.stringify(response));
    const remoteSlip = cloudRows.get(`bet_slip:${aggregateSlip.cloudId}`);
    assert.equal(remoteSlip.payload.legacy_result, 1);
    assert.equal(remoteSlip.payload.status, 'won');
    assert.equal(remoteSlip.payload.payout, '20');

    // Result removal remains a normal upsert. Its marker is part of the same
    // aggregate request, not a separate ungrouped transport operation.
    sqlite.prepare('DELETE FROM BetSlipsResults WHERE betSlipId = ?').run(aggregateSlip.id);
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, calls.at(-1).length);

    // The full local deletion closure ships in one parent-last RPC even though
    // all local rows are gone before the network call.
    sqlite.exec('BEGIN IMMEDIATE');
    try {
        sqlite.prepare('DELETE FROM Legs WHERE id = ?').run(leg.id);
        sqlite.prepare('DELETE FROM ParticipantBets WHERE id = ?').run(participant.id);
        sqlite.prepare('DELETE FROM BetSlips WHERE id = ?').run(aggregateSlip.id);
        sqlite.exec('COMMIT');
    } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
    }
    const deleteCallStart = calls.length;
    response = await pushHistory(db, client, 1, CLOUD_A);
    assert.equal(response.acknowledged, 3, JSON.stringify(response));
    const deleteCalls = calls.slice(deleteCallStart);
    assert.equal(deleteCalls.length, 1);
    assert.deepEqual(deleteCalls[0].map((op) => op.entity_type), [
        'bet_leg', 'participant_bet', 'bet_slip',
    ]);
    assert.ok(deleteCalls[0].every((op) => op.action === 'delete'));
    assert.ok(deleteCalls[0].every((op) =>
        op.payload.bet_slip_cloud_id === aggregateSlip.cloudId
    ));
    assert.equal(cloudRows.get(`bet_leg:${leg.cloudId}`).deleted, true);
    assert.equal(cloudRows.get(`participant_bet:${participant.cloudId}`).deleted, true);
    assert.equal(cloudRows.get(`bet_slip:${aggregateSlip.cloudId}`).deleted, true);

    // Offline create-then-delete survives absent SQLite source rows and converges
    // through stable create/delete operations in sequence.
    const ephemeral = insertSlip(2, '2026-10-03T12:00:00Z');
    sqlite.prepare('DELETE FROM BetSlips WHERE id = ?').run(ephemeral.id);
    const ephemeralOps = sqlite.prepare(`
        SELECT id, action FROM sync_outbox
        WHERE entityType = 'bet_slip' AND entityId = ? ORDER BY sequence
    `).all(ephemeral.cloudId);
    assert.deepEqual(ephemeralOps.map((row) => row.action), ['upsert', 'delete']);
    const ephemeralCalls = calls.length;
    currentCloudUser = CLOUD_B;
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.acknowledged, 0);
    assert.equal(response.coalesced, 2);
    assert.equal(calls.length, ephemeralCalls);
    assert.equal(cloudRows.has(`bet_slip:${ephemeral.cloudId}`), false);
    currentCloudUser = CLOUD_A;

    // Aggregate-wide offline create/delete coalescing is also safe after every
    // source row has disappeared; no partial hierarchy is uploaded.
    const ephemeralHierarchy = insertSlip(2, '2026-10-03T18:00:00Z');
    sqlite.prepare(`
        INSERT INTO ParticipantBets (betSlipId, gameId, odds, sportSnapshot)
        VALUES (?, 'game-1', '-110', 'Basketball')
    `).run(ephemeralHierarchy.id);
    const ephemeralParticipant = sqlite.prepare(
        'SELECT * FROM ParticipantBets WHERE id = last_insert_rowid()'
    ).get();
    sqlite.prepare(`
        INSERT INTO Legs (
            participantBetId, betMarketId, betTypeId, marketTypeSnapshot,
            marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
            targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot,
            bookieIdSnapshot, betTypeSnapshot
        ) VALUES (?, 11, 12, 'Points', '20.5', '-110', 'over', 13, 'Player X', 'Player', 1, 'Player Points')
    `).run(ephemeralParticipant.id);
    const ephemeralLeg = sqlite.prepare('SELECT * FROM Legs WHERE id = last_insert_rowid()').get();
    sqlite.exec('BEGIN IMMEDIATE');
    try {
        sqlite.prepare('DELETE FROM Legs WHERE id = ?').run(ephemeralLeg.id);
        sqlite.prepare('DELETE FROM ParticipantBets WHERE id = ?').run(ephemeralParticipant.id);
        sqlite.prepare('DELETE FROM BetSlips WHERE id = ?').run(ephemeralHierarchy.id);
        sqlite.exec('COMMIT');
    } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
    }
    const hierarchyCoalesceCallCount = calls.length;
    currentCloudUser = CLOUD_B;
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.coalesced, 6);
    assert.equal(calls.length, hierarchyCoalesceCallCount);
    assert.equal(cloudRows.has(`bet_slip:${ephemeralHierarchy.cloudId}`), false);
    currentCloudUser = CLOUD_A;

    // Lost response: server receipt makes the exact immutable request replay safe.
    const retrySlip = insertSlip(2, '2026-10-04T12:00:00Z');
    sqlite.prepare(`
        INSERT INTO ParticipantBets
            (betSlipId, gameId, odds, sportSnapshot)
        VALUES (?, 'game-1', '-110', 'Basketball')
    `).run(retrySlip.id);
    const retryParticipant = sqlite.prepare(
        'SELECT * FROM ParticipantBets WHERE id = last_insert_rowid()'
    ).get();
    sqlite.prepare(`
        INSERT INTO Legs (
            participantBetId, betMarketId, betTypeId, marketTypeSnapshot,
            marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
            targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot,
            bookieIdSnapshot, betTypeSnapshot
        ) VALUES (?, 11, 12, 'Points', '20.5', '-110', 'over', 13, 'Player X', 'Player', 1, 'Player Points')
    `).run(retryParticipant.id);
    const retryLeg = sqlite.prepare('SELECT * FROM Legs WHERE id = last_insert_rowid()').get();
    const retryOperationRows = sqlite.prepare(`
        SELECT id, entityType, entityId, payloadJson FROM sync_outbox
        WHERE (entityType = 'bet_slip' AND entityId = ?)
           OR (entityType = 'participant_bet' AND entityId = ?)
           OR (entityType = 'bet_leg' AND entityId = ?)
        ORDER BY sequence
    `).all(retrySlip.cloudId, retryParticipant.cloudId, retryLeg.cloudId);
    assert.equal(retryOperationRows.length, 3);
    const retryOperationRow = retryOperationRows.find((row) => row.entityType === 'bet_slip');
    const retryOperation = retryOperationRow.id;
    for (const row of retryOperationRows) {
        const retryPayload = JSON.parse(row.payloadJson);
        if (row.entityType === 'bet_slip') {
            Object.assign(retryPayload, {
                cloudCurrencyCode: 'USD',
                cloudStake: '10.00',
                cloudPayout: '20.00',
                cloudDecimalOdds: null,
                oddsChanged: false,
            });
        } else if (row.entityType === 'participant_bet') {
            retryPayload.cloudDecimalOdds = null;
            retryPayload.oddsChanged = false;
        } else {
            retryPayload.cloudOddsAtPlacement = null;
            retryPayload.oddsChanged = false;
        }
        sqlite.prepare('UPDATE sync_outbox SET payloadJson = ? WHERE id = ?')
            .run(JSON.stringify(retryPayload), row.id);
    }
    failAfterCommitOnce = true;
    currentCloudUser = CLOUD_B;
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.failed, 3, JSON.stringify(response));
    assert.equal(statusFor(retryOperation).status, 'failed');
    const firstRequest = calls.at(-1);
    assert.equal(firstRequest.length, 3);
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.acknowledged, 3, JSON.stringify(response));
    assert.equal(statusFor(retryOperation).status, 'acked');
    const secondRequest = calls.at(-1);
    assert.deepEqual(secondRequest, firstRequest);
    assert.equal(cloudRows.get(`bet_slip:${retrySlip.cloudId}`).revision, 1);
    assert.equal(cloudRows.get(`participant_bet:${retryParticipant.cloudId}`).revision, 1);
    assert.equal(cloudRows.get(`bet_leg:${retryLeg.cloudId}`).revision, 1);
    currentCloudUser = CLOUD_A;

    // Independent slips are never packed together; the second slip's stale
    // revision is reported without touching its server row.
    const conflictFirst = insertSlip(3, '2026-10-05T12:00:00Z');
    const conflictSecond = insertSlip(3, '2026-10-06T12:00:00Z');
    const secondRemote = {
        entity_type: 'bet_slip',
        revision: 4,
        deleted: false,
        payload: { user_id: CLOUD_C, stake: 99 },
    };
    cloudRows.set(`bet_slip:${conflictSecond.cloudId}`, secondRemote);
    const conflictCallStart = calls.length;
    currentCloudUser = CLOUD_C;
    response = await pushHistory(db, client, 3, CLOUD_C);
    assert.equal(response.acknowledged, 1);
    assert.equal(response.failed, 1);
    assert.equal(response.conflicts.length, 1);
    assert.ok(response.conflicts[0].operationIds.includes(sqlite.prepare(`
        SELECT id FROM sync_outbox WHERE entityType = 'bet_slip' AND entityId = ?
        ORDER BY sequence LIMIT 1
    `).get(conflictSecond.cloudId).id));
    assert.equal(cloudRows.get(`bet_slip:${conflictFirst.cloudId}`).revision, 1);
    assert.equal(cloudRows.get(`bet_slip:${conflictSecond.cloudId}`).revision, 4);
    assert.equal(calls[conflictCallStart].length, 1);
    assert.equal(calls[conflictCallStart + 1].length, 1);
    assert.equal(statusFor(sqlite.prepare(`
        SELECT id FROM sync_outbox WHERE entityId = ? ORDER BY sequence LIMIT 1
    `).get(conflictSecond.cloudId).id).status, 'failed');
    sqlite.prepare(`
        UPDATE sync_outbox SET status = 'acked'
        WHERE ownerUserId = 3 AND entityId = ?
    `).run(conflictSecond.cloudId);

    // A stale leg revision rolls back earlier parent updates in the same
    // aggregate RPC; no singleton fallback is permitted.
    const atomicSlip = insertSlip(3, '2026-10-06T18:00:00Z');
    sqlite.prepare(`
        INSERT INTO ParticipantBets (betSlipId, gameId, odds, sportSnapshot)
        VALUES (?, 'game-1', '-110', 'Basketball')
    `).run(atomicSlip.id);
    const atomicParticipant = sqlite.prepare(
        'SELECT * FROM ParticipantBets WHERE id = last_insert_rowid()'
    ).get();
    sqlite.prepare(`
        INSERT INTO Legs (
            participantBetId, betMarketId, betTypeId, marketTypeSnapshot,
            marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
            targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot,
            bookieIdSnapshot, betTypeSnapshot
        ) VALUES (?, 11, 12, 'Points', '20.5', '-110', 'over', 13, 'Player X', 'Player', 1, 'Player Points')
    `).run(atomicParticipant.id);
    const atomicLeg = sqlite.prepare('SELECT * FROM Legs WHERE id = last_insert_rowid()').get();
    currentCloudUser = CLOUD_C;
    response = await pushHistory(db, client, 3, CLOUD_C);
    assert.equal(response.acknowledged, 3);

    sqlite.prepare('UPDATE BetSlips SET odds = ? WHERE id = ?').run('-105', atomicSlip.id);
    sqlite.prepare('UPDATE ParticipantBets SET odds = ? WHERE id = ?')
        .run('-105', atomicParticipant.id);
    sqlite.prepare('UPDATE Legs SET marketValueSnapshot = ? WHERE id = ?')
        .run('21.5', atomicLeg.id);
    const remoteAtomicSlip = structuredClone(cloudRows.get(`bet_slip:${atomicSlip.cloudId}`));
    const remoteAtomicParticipant = structuredClone(
        cloudRows.get(`participant_bet:${atomicParticipant.cloudId}`)
    );
    cloudRows.get(`bet_leg:${atomicLeg.cloudId}`).revision = 4;
    const atomicCallStart = calls.length;
    response = await pushHistory(db, client, 3, CLOUD_C);
    assert.equal(response.failed, 3);
    assert.equal(response.conflicts.length, 1);
    assert.equal(calls.length, atomicCallStart + 1);
    assert.equal(calls[atomicCallStart].length, 3);
    assert.equal(cloudRows.get(`bet_slip:${atomicSlip.cloudId}`).revision, remoteAtomicSlip.revision);
    assert.deepEqual(cloudRows.get(`bet_slip:${atomicSlip.cloudId}`).payload, remoteAtomicSlip.payload);
    assert.equal(
        cloudRows.get(`participant_bet:${atomicParticipant.cloudId}`).revision,
        remoteAtomicParticipant.revision
    );
    assert.deepEqual(
        cloudRows.get(`participant_bet:${atomicParticipant.cloudId}`).payload,
        remoteAtomicParticipant.payload
    );
    currentCloudUser = CLOUD_A;

    // Session and local mapping may switch during an in-flight call. The server
    // dispatch owner is bound in payload; the stale response must not be acked.
    const switchingSlip = insertSlip(2, '2026-10-07T12:00:00Z');
    const switchingRow = sqlite.prepare(`
        SELECT id, payloadJson FROM sync_outbox WHERE entityId = ?
    `).get(switchingSlip.cloudId);
    const switchingOperation = switchingRow.id;
    const switchingPayload = JSON.parse(switchingRow.payloadJson);
    Object.assign(switchingPayload, {
        cloudCurrencyCode: 'USD',
        cloudStake: '10.00',
        cloudPayout: '20.00',
        cloudDecimalOdds: null,
        oddsChanged: false,
    });
    sqlite.prepare('UPDATE sync_outbox SET payloadJson = ? WHERE id = ?')
        .run(JSON.stringify(switchingPayload), switchingOperation);
    currentCloudUser = CLOUD_B;
    afterDispatch = async () => {
        sqlite.prepare('UPDATE Users SET cloudUserId = ? WHERE id = 2').run(CLOUD_OTHER);
        currentCloudUser = CLOUD_OTHER;
    };
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.acknowledged, 0);
    assert.equal(statusFor(switchingOperation).status, 'failed');
    assert.equal(cloudRows.get(`bet_slip:${switchingSlip.cloudId}`).payload.user_id, CLOUD_B);
    sqlite.prepare('UPDATE Users SET cloudUserId = ? WHERE id = 2').run(CLOUD_B);
    currentCloudUser = CLOUD_B;
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.acknowledged, 1);

    // Older deletion snapshots whose parents were already physically removed
    // cannot be assigned to an aggregate by guessing; report and hold them.
    const unrecoverableSlip = insertSlip(2, '2026-10-08T12:00:00Z');
    sqlite.prepare(`
        INSERT INTO ParticipantBets (betSlipId, gameId, odds, sportSnapshot)
        VALUES (?, 'game-1', '-110', 'Basketball')
    `).run(unrecoverableSlip.id);
    const unrecoverableParticipant = sqlite.prepare(
        'SELECT * FROM ParticipantBets WHERE id = last_insert_rowid()'
    ).get();
    sqlite.prepare(`
        INSERT INTO Legs (
            participantBetId, betMarketId, betTypeId, marketTypeSnapshot,
            marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
            targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot,
            bookieIdSnapshot, betTypeSnapshot
        ) VALUES (?, 11, 12, 'Points', '20.5', '-110', 'over', 13, 'Player X', 'Player', 1, 'Player Points')
    `).run(unrecoverableParticipant.id);
    const unrecoverableLeg = sqlite.prepare('SELECT * FROM Legs WHERE id = last_insert_rowid()').get();
    currentCloudUser = CLOUD_B;
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.acknowledged, 3);
    sqlite.exec('BEGIN IMMEDIATE');
    try {
        sqlite.prepare('DELETE FROM Legs WHERE id = ?').run(unrecoverableLeg.id);
        sqlite.prepare('DELETE FROM ParticipantBets WHERE id = ?').run(unrecoverableParticipant.id);
        sqlite.prepare('DELETE FROM BetSlips WHERE id = ?').run(unrecoverableSlip.id);
        sqlite.exec('COMMIT');
    } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
    }
    const legacyDeleteOps = sqlite.prepare(`
        SELECT id, entityType, payloadJson FROM sync_outbox
        WHERE entityId IN (?, ?, ?) AND status = 'pending'
    `).all(unrecoverableSlip.cloudId, unrecoverableParticipant.cloudId, unrecoverableLeg.cloudId);
    for (const row of legacyDeleteOps) {
        const payload = JSON.parse(row.payloadJson);
        delete payload.betSlipCloudId;
        delete payload.parentCloudId;
        sqlite.prepare('UPDATE sync_outbox SET payloadJson = ? WHERE id = ?')
            .run(JSON.stringify(payload), row.id);
    }
    const unrecoverableCallCount = calls.length;
    response = await pushHistory(db, client, 2, CLOUD_B);
    assert.equal(response.acknowledged, 0);
    assert.equal(calls.length, unrecoverableCallCount);
    assert.ok(response.blocked.some((item) =>
        /ancestry|parent rows|group|aggregate/i.test(item.reason)
    ));

    console.log('Phase 4 push offline/replay/order/conflict/isolation checks passed.');
    }
} finally {
    sqlite.close();
    rmSync(directory, { recursive: true, force: true });
}
