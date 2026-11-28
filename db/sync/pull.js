const PAGE_SIZE = 100;
const ENTITY_TABLES = Object.freeze({
    bet_slip: 'BetSlips',
    participant_bet: 'ParticipantBets',
    bet_leg: 'Legs',
});

const fail = (message) => {
    throw new Error(message);
};

const asCursor = (value) => {
    const cursor = value == null ? '0' : String(value);
    if (!/^\d+$/.test(cursor)) fail('The local sync cursor is invalid; repair the account sync state before retrying.');
    return cursor;
};

const asRevision = (value, label = 'Cloud revision') => {
    const revision = Number(value);
    if (!Number.isSafeInteger(revision) || revision < 1) {
        fail(`${label} is invalid; no history was applied.`);
    }
    return revision;
};

const validateAuthenticatedUser = async (client, cloudUserId) => {
    if (!client?.auth || typeof client.auth.getUser !== 'function') {
        fail('An authenticated Supabase client is required to restore history.');
    }
    const response = await client.auth.getUser();
    if (response?.error) fail(`Could not verify the active account before history restore: ${response.error.message}`);
    const authenticatedId = response?.data?.user?.id;
    if (!authenticatedId || authenticatedId !== cloudUserId) {
        fail('The active Supabase account changed or does not match this local account. Switch back to the matching account and retry.');
    }
};

const validatePage = (data, cloudUserId, cursor) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        fail('The history page response is malformed; the cursor was not advanced.');
    }
    if (data.cloud_user_id !== cloudUserId) {
        fail('The history page belongs to a different cloud account; no history was applied.');
    }
    if (!Array.isArray(data.changes) || data.changes.length > PAGE_SIZE) {
        fail('The history page has an invalid change list; the cursor was not advanced.');
    }

    let previous = BigInt(cursor);
    for (const change of data.changes) {
        if (!change || typeof change !== 'object'
            || !Object.prototype.hasOwnProperty.call(ENTITY_TABLES, change.entity_type)
            || typeof change.entity_id !== 'string'
            || typeof change.change_id !== 'string'
            || !/^\d+$/.test(change.change_id)) {
            fail('The history page contains an invalid change; the cursor was not advanced.');
        }
        const changeId = BigInt(change.change_id);
        if (changeId <= previous) {
            fail('The history page is not strictly ordered after the saved cursor; no history was applied.');
        }
        previous = changeId;
        asRevision(change.revision, 'Change-feed revision');
        if (change.deleted_at != null && typeof change.deleted_at !== 'string') {
            fail('The history page contains an invalid tombstone; the cursor was not advanced.');
        }
        if (change.deleted_at == null) {
            const record = change.record;
            if (!record || typeof record !== 'object' || Array.isArray(record)
                || record.id !== change.entity_id
                || record.user_id !== cloudUserId
                || asRevision(record.revision, 'Record revision') < Number(change.revision)) {
                fail('A live history change is missing its matching account-owned record snapshot; the cursor was not advanced.');
            }
            if (record.deleted_at != null && typeof record.deleted_at !== 'string') {
                fail('A history record contains an invalid deletion marker; the cursor was not advanced.');
            }
        }
    }
    return data.changes;
};

const assertLocalAccount = async (db, userId, cloudUserId) => {
    const row = await db.getFirstAsync(
        'SELECT id, cloudUserId FROM Users WHERE id = ?',
        [userId]
    );
    if (!row || row.cloudUserId !== cloudUserId) {
        fail('The local account no longer maps to the authenticated cloud account. Select the matching account and retry.');
    }
};

const ensureNoPendingEdits = async (db, userId, entityIds) => {
    const uniqueIds = [...new Set(entityIds.filter(Boolean))];
    if (uniqueIds.length === 0) return;
    const placeholders = uniqueIds.map(() => '?').join(', ');
    const pending = await db.getFirstAsync(`
        SELECT entityType, entityId
        FROM sync_outbox
        WHERE ownerUserId = ?
          AND status != 'acked'
          AND entityId IN (${placeholders})
        LIMIT 1
    `, [userId, ...uniqueIds]);
    if (pending) {
        fail(`Cannot restore ${pending.entityType} ${pending.entityId}: it has a pending local edit. Sync or resolve that edit before pulling again.`);
    }
};

const localOwnerIdsFor = async (db, userId, entityType, entityId) => {
    if (entityType === 'bet_slip') {
        const slip = await db.getFirstAsync(
            'SELECT id FROM BetSlips WHERE cloudId = ? AND userId = ?',
            [entityId, userId]
        );
        if (!slip) return [];
        const participants = await db.getAllAsync(
            'SELECT id, cloudId FROM ParticipantBets WHERE betSlipId = ?',
            [slip.id]
        );
        const ids = [entityId, ...participants.map((row) => row.cloudId)];
        for (const participant of participants) {
            const legs = await db.getAllAsync(
                'SELECT cloudId FROM Legs WHERE participantBetId = ?',
                [participant.id]
            );
            ids.push(...legs.map((row) => row.cloudId));
        }
        return ids;
    }
    if (entityType === 'participant_bet') {
        const participant = await db.getFirstAsync(`
            SELECT pb.id
            FROM ParticipantBets pb
            JOIN BetSlips bs ON bs.id = pb.betSlipId
            WHERE pb.cloudId = ? AND bs.userId = ?
        `, [entityId, userId]);
        if (!participant) return [];
        const legs = await db.getAllAsync(
            'SELECT cloudId FROM Legs WHERE participantBetId = ?',
            [participant.id]
        );
        return [entityId, ...legs.map((row) => row.cloudId)];
    }
    const leg = await db.getFirstAsync(`
        SELECT l.cloudId
        FROM Legs l
        JOIN ParticipantBets pb ON pb.id = l.participantBetId
        JOIN BetSlips bs ON bs.id = pb.betSlipId
        WHERE l.cloudId = ? AND bs.userId = ?
    `, [entityId, userId]);
    return leg ? [entityId] : [];
};

const rememberTombstone = async (db, userId, change) => {
    const revision = asRevision(change.record?.revision ?? change.revision, 'Tombstone revision');
    const deletedAt = change.deleted_at ?? change.record?.deleted_at;
    if (typeof deletedAt !== 'string') {
        fail(`Remote deletion for ${change.entity_type} ${change.entity_id} has no timestamp; the page was not applied.`);
    }
    const old = await db.getFirstAsync(`
        SELECT revision
        FROM sync_remote_tombstones
        WHERE ownerUserId = ? AND entityType = ? AND entityId = ?
    `, [userId, change.entity_type, change.entity_id]);
    if (old && Number(old.revision) >= revision) return false;

    const local = await findLocalEntity(db, userId, change.entity_type, change.entity_id);
    if (local && Number(local.cloudRevision) > revision) {
        fail(`Remote deletion for ${change.entity_type} ${change.entity_id} is older than its local revision. The history was not deleted; resolve the sync conflict first.`);
    }
    const relatedIds = await localOwnerIdsFor(db, userId, change.entity_type, change.entity_id);
    await ensureNoPendingEdits(db, userId, relatedIds);
    await deleteLocalEntity(db, userId, change.entity_type, change.entity_id);
    await db.runAsync(`
        INSERT INTO sync_remote_tombstones (ownerUserId, entityType, entityId, revision, deletedAt)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(ownerUserId, entityType, entityId) DO UPDATE SET
            revision = MAX(sync_remote_tombstones.revision, excluded.revision),
            deletedAt = excluded.deletedAt
    `, [userId, change.entity_type, change.entity_id, revision, deletedAt]);
    return true;
};

const findLocalEntity = async (db, userId, entityType, entityId) => {
    if (entityType === 'bet_slip') {
        return db.getFirstAsync(
            'SELECT id, cloudRevision FROM BetSlips WHERE cloudId = ? AND userId = ?',
            [entityId, userId]
        );
    }
    if (entityType === 'participant_bet') {
        return db.getFirstAsync(`
            SELECT pb.id, pb.cloudRevision
            FROM ParticipantBets pb
            JOIN BetSlips bs ON bs.id = pb.betSlipId
            WHERE pb.cloudId = ? AND bs.userId = ?
        `, [entityId, userId]);
    }
    return db.getFirstAsync(`
        SELECT l.id, l.cloudRevision
        FROM Legs l
        JOIN ParticipantBets pb ON pb.id = l.participantBetId
        JOIN BetSlips bs ON bs.id = pb.betSlipId
        WHERE l.cloudId = ? AND bs.userId = ?
    `, [entityId, userId]);
};

const deleteLocalEntity = async (db, userId, entityType, entityId) => {
    const local = await findLocalEntity(db, userId, entityType, entityId);
    if (!local) return;
    if (entityType === 'bet_slip') {
        const participants = await db.getAllAsync(
            'SELECT id FROM ParticipantBets WHERE betSlipId = ?',
            [local.id]
        );
        for (const participant of participants) {
            const legs = await db.getAllAsync(
                'SELECT id FROM Legs WHERE participantBetId = ?',
                [participant.id]
            );
            for (const leg of legs) {
                await db.runAsync('DELETE FROM LegsResults WHERE legId = ?', [leg.id]);
                await db.runAsync('DELETE FROM Legs WHERE id = ?', [leg.id]);
            }
            await db.runAsync('DELETE FROM ParticipantBetsResults WHERE participantBetId = ?', [participant.id]);
            await db.runAsync('DELETE FROM ParticipantBets WHERE id = ?', [participant.id]);
        }
        await db.runAsync('DELETE FROM BetSlipsResults WHERE betSlipId = ?', [local.id]);
        await db.runAsync('DELETE FROM BetSlips WHERE id = ? AND userId = ?', [local.id, userId]);
    } else if (entityType === 'participant_bet') {
        const legs = await db.getAllAsync(
            'SELECT id FROM Legs WHERE participantBetId = ?',
            [local.id]
        );
        for (const leg of legs) {
            await db.runAsync('DELETE FROM LegsResults WHERE legId = ?', [leg.id]);
            await db.runAsync('DELETE FROM Legs WHERE id = ?', [leg.id]);
        }
        await db.runAsync('DELETE FROM ParticipantBetsResults WHERE participantBetId = ?', [local.id]);
        await db.runAsync('DELETE FROM ParticipantBets WHERE id = ?', [local.id]);
    } else {
        await db.runAsync('DELETE FROM LegsResults WHERE legId = ?', [local.id]);
        await db.runAsync('DELETE FROM Legs WHERE id = ?', [local.id]);
    }
};

const stringOrNull = (value) => value == null ? null : String(value);

const decimalSnapshot = (value, field, required = false) => {
    if (value == null && !required) return null;
    if (typeof value !== 'string' || !/^-?\d+(?:\.\d+)?$/.test(value)) {
        fail(`Cloud ${field} must be returned as an exact decimal string; no page was applied.`);
    }
    return value;
};

const localNumber = (decimal, field) => {
    const number = Number(decimal);
    if (!Number.isFinite(number)) fail(`Cloud ${field} is not a valid local numeric value; no page was applied.`);
    return number;
};

const replaceResult = async (db, table, column, parentId, result, timestamp) => {
    await db.runAsync(`DELETE FROM ${table} WHERE ${column} = ?`, [parentId]);
    if (result == null) return;
    if (![1, 0, -1].includes(Number(result))) {
        fail(`Unsupported legacy settlement result in ${table}; the page was rolled back.`);
    }
    await db.runAsync(
        `INSERT INTO ${table} (${column}, result, timestamp) VALUES (?, ?, ?)`,
        [parentId, String(result), timestamp ?? null]
    );
};

const upsertSlip = async (db, userId, change) => {
    const row = change.record;
    const revision = asRevision(row.revision, 'Slip revision');
    const tombstone = await db.getFirstAsync(
        'SELECT revision FROM sync_remote_tombstones WHERE ownerUserId = ? AND entityType = ? AND entityId = ?',
        [userId, change.entity_type, change.entity_id]
    );
    if (tombstone) {
        if (Number(tombstone.revision) >= revision) return 'skipped';
        fail(`Cloud history attempted to restore deleted slip ${change.entity_id}. The tombstone was retained.`);
    }
    const existing = await findLocalEntity(db, userId, 'bet_slip', change.entity_id);
    await ensureNoPendingEdits(db, userId, [change.entity_id]);
    if (existing && Number(existing.cloudRevision) >= revision) return 'skipped';

    const formatName = row.bet_format ?? null;
    const format = formatName == null
        ? null
        : await db.getFirstAsync('SELECT id FROM BetFormats WHERE formatName = ?', [formatName]);
    if (row.placed_at == null || row.stake == null) {
        fail(`Cloud slip ${change.entity_id} is missing required placement or stake data; no page was applied.`);
    }
    const stake = decimalSnapshot(row.stake, 'stake', true);
    const payout = decimalSnapshot(row.payout, 'payout');
    const decimalOdds = decimalSnapshot(row.decimal_odds, 'decimal odds');
    const values = [
        format?.id ?? null,
        String(row.placed_at),
        row.odds_snapshot ?? null,
        localNumber(stake, 'stake'),
        payout == null ? null : localNumber(payout, 'payout'),
        userId,
        null, // bookieId is a local reference; never copy legacy_bookie_id.
        change.entity_id,
        revision,
        row.status ?? null,
        row.currency_code ?? null,
        row.notes ?? null,
        decimalOdds,
        row.user_bookie_id ?? null,
        row.bookie_display_name_snapshot ?? row.bookie_display_name ?? null,
        formatName,
        row.settled_at ?? null,
        stake,
        payout,
        stringOrNull(row.legacy_format_id),
        stringOrNull(row.legacy_bookie_id),
        row.created_at ?? null,
        row.updated_at ?? null,
    ];
    const columns = [
        'formatId', 'date', 'odds', 'betAmount', 'winnings', 'userId', 'bookieId', 'cloudId',
        'cloudRevision', 'cloudStatus', 'cloudCurrencyCode', 'cloudNotes', 'cloudDecimalOdds',
        'cloudBookieId', 'bookieNameSnapshot', 'formatNameSnapshot', 'cloudSettledAt', 'cloudStake',
        'cloudPayout', 'cloudLegacyFormatId', 'cloudLegacyBookieId', 'cloudCreatedAt', 'cloudUpdatedAt',
    ];
    if (existing) {
        await db.runAsync(`
            UPDATE BetSlips SET ${columns.map((column) => `${column} = ?`).join(', ')}
            WHERE id = ? AND userId = ?
        `, [...values, existing.id, userId]);
    } else {
        await db.runAsync(`INSERT INTO BetSlips (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`, values);
    }
    const local = existing ?? await findLocalEntity(db, userId, 'bet_slip', change.entity_id);
    await replaceResult(db, 'BetSlipsResults', 'betSlipId', local.id, row.legacy_result, row.legacy_result_at);
    return existing ? 'updated' : 'inserted';
};

const upsertParticipant = async (db, userId, change) => {
    const row = change.record;
    const revision = asRevision(row.revision, 'Participant revision');
    const tombstone = await db.getFirstAsync(
        'SELECT revision FROM sync_remote_tombstones WHERE ownerUserId = ? AND entityType = ? AND entityId = ?',
        [userId, change.entity_type, change.entity_id]
    );
    if (tombstone) {
        if (Number(tombstone.revision) >= revision) return 'skipped';
        fail(`Cloud history attempted to restore deleted participant ${change.entity_id}. The tombstone was retained.`);
    }
    const existing = await findLocalEntity(db, userId, 'participant_bet', change.entity_id);
    await ensureNoPendingEdits(db, userId, [change.entity_id]);
    if (existing && Number(existing.cloudRevision) >= revision) return 'skipped';

    const parent = await db.getFirstAsync(
        'SELECT id FROM BetSlips WHERE cloudId = ? AND userId = ?',
        [row.bet_slip_id, userId]
    );
    if (!parent) fail(`Cannot restore participant ${change.entity_id}: its parent slip is not present for this account. Retry from the beginning or inspect the cloud history.`);
    const gameReference = row.game_reference_id ?? null;
    const decimalOdds = decimalSnapshot(row.decimal_odds, 'participant decimal odds');
    const values = [
        parent.id,
        null, // gameId may not be a unique/available key in the local reference schema.
        row.odds_snapshot ?? null,
        change.entity_id,
        revision,
        row.sport_snapshot ?? null,
        row.home_team_snapshot ?? null,
        row.away_team_snapshot ?? null,
        decimalOdds,
        row.status ?? null,
        row.legacy_result_at ?? null,
        gameReference,
        row.game_date_snapshot ?? null,
        row.league_snapshot ?? null,
        row.home_team_abbreviation_snapshot ?? null,
        row.away_team_abbreviation_snapshot ?? null,
        row.created_at ?? null,
        row.updated_at ?? null,
    ];
    const columns = [
        'betSlipId', 'gameId', 'odds', 'cloudId', 'cloudRevision', 'sportSnapshot',
        'homeTeamSnapshot', 'awayTeamSnapshot', 'cloudDecimalOdds', 'cloudStatus',
        'cloudSettledAt', 'cloudGameReferenceId', 'gameDateSnapshot', 'leagueSnapshot',
        'homeTeamAbbreviationSnapshot', 'awayTeamAbbreviationSnapshot', 'cloudCreatedAt',
        'cloudUpdatedAt',
    ];
    if (existing) {
        await db.runAsync(`
            UPDATE ParticipantBets SET ${columns.map((column) => `${column} = ?`).join(', ')}
            WHERE id = ?
        `, [...values, existing.id]);
    } else {
        await db.runAsync(`INSERT INTO ParticipantBets (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`, values);
    }
    const local = existing ?? await findLocalEntity(db, userId, 'participant_bet', change.entity_id);
    await replaceResult(db, 'ParticipantBetsResults', 'participantBetId', local.id, row.legacy_result, row.legacy_result_at);
    return existing ? 'updated' : 'inserted';
};

const upsertLeg = async (db, userId, change) => {
    const row = change.record;
    const revision = asRevision(row.revision, 'Leg revision');
    const tombstone = await db.getFirstAsync(
        'SELECT revision FROM sync_remote_tombstones WHERE ownerUserId = ? AND entityType = ? AND entityId = ?',
        [userId, change.entity_type, change.entity_id]
    );
    if (tombstone) {
        if (Number(tombstone.revision) >= revision) return 'skipped';
        fail(`Cloud history attempted to restore deleted leg ${change.entity_id}. The tombstone was retained.`);
    }
    const existing = await findLocalEntity(db, userId, 'bet_leg', change.entity_id);
    await ensureNoPendingEdits(db, userId, [change.entity_id]);
    if (existing && Number(existing.cloudRevision) >= revision) return 'skipped';

    const parent = await db.getFirstAsync(`
        SELECT pb.id
        FROM ParticipantBets pb
        JOIN BetSlips bs ON bs.id = pb.betSlipId
        WHERE pb.cloudId = ? AND bs.userId = ?
    `, [row.participant_bet_id, userId]);
    if (!parent) fail(`Cannot restore leg ${change.entity_id}: its parent participant is not present for this account. Retry from the beginning or inspect the cloud history.`);
    const line = decimalSnapshot(row.line_at_placement, 'leg line');
    const decimalOdds = decimalSnapshot(row.odds_at_placement, 'leg decimal odds');
    const values = [
        parent.id,
        null, // market and bet-type IDs are device-local; never copy legacy reference IDs.
        null,
        change.entity_id,
        revision,
        row.market_type_snapshot ?? null,
        row.market_value_snapshot == null ? null : String(row.market_value_snapshot),
        row.odds_snapshot ?? null,
        row.over_under_snapshot ?? null,
        null,
        row.target_name_snapshot ?? null,
        row.target_type_snapshot ?? null,
        null,
        row.bet_type_snapshot ?? row.selection_description ?? null,
        row.market_reference_id ?? null,
        row.selection_description ?? null,
        decimalOdds,
        line,
        row.status ?? null,
        row.legacy_result_at ?? null,
        stringOrNull(row.legacy_market_id),
        stringOrNull(row.legacy_bet_type_id),
        stringOrNull(row.legacy_target_id),
        stringOrNull(row.bookie_reference_id),
        row.created_at ?? null,
        row.updated_at ?? null,
    ];
    const columns = [
        'participantBetId', 'betMarketId', 'betTypeId', 'cloudId', 'cloudRevision',
        'marketTypeSnapshot', 'marketValueSnapshot', 'oddsSnapshot', 'overUnderSnapshot',
        'targetIdSnapshot', 'targetNameSnapshot', 'targetTypeSnapshot', 'bookieIdSnapshot',
        'betTypeSnapshot', 'cloudMarketReferenceId', 'cloudSelectionDescription',
        'cloudOddsAtPlacement', 'cloudLineAtPlacement', 'cloudStatus', 'cloudSettledAt', 'cloudLegacyMarketId',
        'cloudLegacyBetTypeId', 'cloudLegacyTargetId', 'cloudLegacyBookieReferenceId',
        'cloudCreatedAt', 'cloudUpdatedAt',
    ];
    if (existing) {
        await db.runAsync(`
            UPDATE Legs SET ${columns.map((column) => `${column} = ?`).join(', ')}
            WHERE id = ?
        `, [...values, existing.id]);
    } else {
        await db.runAsync(`INSERT INTO Legs (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`, values);
    }
    const local = existing ?? await findLocalEntity(db, userId, 'bet_leg', change.entity_id);
    await replaceResult(db, 'LegsResults', 'legId', local.id, row.legacy_result, row.legacy_result_at);
    return existing ? 'updated' : 'inserted';
};

const applyChange = async (db, userId, change) => {
    if (change.deleted_at != null || change.record?.deleted_at != null) {
        return await rememberTombstone(db, userId, change) ? 'deleted' : 'skipped';
    }
    if (change.entity_type === 'bet_slip') return upsertSlip(db, userId, change);
    if (change.entity_type === 'participant_bet') return upsertParticipant(db, userId, change);
    return upsertLeg(db, userId, change);
};

const applyPage = async (db, userId, cloudUserId, cursor, changes) => {
    if (typeof db.withExclusiveTransactionAsync !== 'function') {
        fail('This SQLite driver does not provide exclusive transactions. History was not applied; upgrade the local database driver before retrying.');
    }
    let counts = { inserted: 0, updated: 0, deleted: 0, skipped: 0 };
    const nextCursor = changes[changes.length - 1].change_id;
    await db.withExclusiveTransactionAsync(async (txDb) => {
        await assertLocalAccount(txDb, userId, cloudUserId);
        const syncState = await txDb.getFirstAsync(
            'SELECT pullCursor FROM user_sync_state WHERE userId = ?',
            [userId]
        );
        if (asCursor(syncState?.pullCursor) !== cursor) {
            fail('The local pull cursor changed during synchronization. No page was applied; retry the pull.');
        }
        await txDb.runAsync('INSERT INTO sync_pull_context (userId) VALUES (?)', [userId]);
        for (const change of changes) {
            const outcome = await applyChange(txDb, userId, change);
            counts[outcome] += 1;
        }
        await txDb.runAsync('DELETE FROM sync_pull_context WHERE userId = ?', [userId]);
        const now = new Date().toISOString();
        await txDb.runAsync(`
            INSERT INTO user_sync_state (userId, pullCursor, lastPulledAt, updatedAt)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET
                pullCursor = excluded.pullCursor,
                lastPulledAt = excluded.lastPulledAt,
                updatedAt = excluded.updatedAt
        `, [userId, nextCursor, now, now]);
    });
    return { cursor: nextCursor, counts };
};

/**
 * Restore authenticated cloud history into one mapped local account.
 *
 * The remote RPC must return a single-snapshot page:
 * { cloud_user_id, changes: [{ change_id, entity_type, entity_id, revision,
 *   deleted_at, record }] }. A live record is the complete persisted cloud
 * row (including result/status snapshots); a tombstone has deleted_at set.
 */
export const pullHistory = async (db, client, userId, cloudUserId) => {
    if (!db || typeof db.getFirstAsync !== 'function' || typeof db.getAllAsync !== 'function'
        || typeof db.runAsync !== 'function') {
        fail('A valid SQLite database connection is required to restore history.');
    }
    if (!Number.isSafeInteger(userId) || userId < 1 || typeof cloudUserId !== 'string' || cloudUserId.length === 0) {
        fail('A valid local user ID and cloud account UUID are required to restore history.');
    }
    if (typeof client?.rpc !== 'function') {
        fail('An authenticated Supabase RPC client is required to restore history.');
    }
    await assertLocalAccount(db, userId, cloudUserId);
    await validateAuthenticatedUser(client, cloudUserId);
    const syncState = await db.getFirstAsync(
        'SELECT pullCursor FROM user_sync_state WHERE userId = ?',
        [userId]
    );
    let cursor = asCursor(syncState?.pullCursor);
    const result = {
        pages: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        skipped: 0,
        cursor,
        warnings: [],
    };
    const warningSet = new Set();

    while (true) {
        const response = await client.rpc('bs_get_sync_history_page', {
            p_expected_user_id: cloudUserId,
            p_after: cursor,
            p_limit: PAGE_SIZE,
        });
        if (response?.error) {
            fail(`Cloud history download failed; the saved cursor remains ${cursor}. ${response.error.message}`);
        }
        const changes = validatePage(response?.data, cloudUserId, cursor);
        if (changes.length === 0) break;
        for (const change of changes) {
            if (change.deleted_at != null || change.record?.deleted_at != null) continue;
            if (change.entity_type === 'participant_bet') {
                const row = change.record;
                if (!row.game_date_snapshot || !row.league_snapshot
                    || !row.home_team_abbreviation_snapshot || !row.away_team_abbreviation_snapshot) {
                    warningSet.add('Some participant records lack historical game date, league, or team-abbreviation snapshots. Pull does not infer these from current shared reference data.');
                }
            }
            if (change.entity_type === 'bet_slip'
                && (change.record.user_bookie_id || change.record.legacy_bookie_id)
                && !(change.record.bookie_display_name_snapshot || change.record.bookie_display_name)) {
                warningSet.add('Some slips lack an owned sportsbook display-name snapshot. The cloud sportsbook UUID is retained; legacy integer sportsbook IDs are not resolved locally.');
            }
        }

        await validateAuthenticatedUser(client, cloudUserId);
        await assertLocalAccount(db, userId, cloudUserId);
        const applied = await applyPage(db, userId, cloudUserId, cursor, changes);
        cursor = applied.cursor;
        result.cursor = cursor;
        result.pages += 1;
        for (const key of Object.keys(applied.counts)) result[key] += applied.counts[key];
        if (changes.length < PAGE_SIZE) break;
    }
    result.warnings = [...warningSet];
    return result;
};
