const STALE_ATTEMPT_MS = 5 * 60 * 1000;
const MAX_AGGREGATE_OPERATIONS = 500;
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const requireChangedRow = (result, message) => {
    if (result.changes !== 1) throw new Error(message);
};

export const claimPendingSyncOperations = async (db, userId, limit = 50, now = new Date()) => {
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
        throw new Error('Sync operation limit must be an integer between 1 and 500.');
    }

    const nowIso = now.toISOString();
    const staleBefore = new Date(now.getTime() - STALE_ATTEMPT_MS).toISOString();
    let rows = [];

    await db.withTransactionAsync(async () => {
        rows = await db.getAllAsync(`
            SELECT *
            FROM sync_outbox
            WHERE ownerUserId = ?
              AND (
                status = 'pending'
                OR (status = 'failed' AND (nextAttemptAt IS NULL OR nextAttemptAt <= ?))
                OR (status = 'in_flight' AND lastAttemptAt <= ?)
              )
              AND NOT EXISTS (
                SELECT 1
                FROM sync_outbox AS earlier
                WHERE earlier.ownerUserId = sync_outbox.ownerUserId
                  AND earlier.entityType = sync_outbox.entityType
                  AND earlier.entityId = sync_outbox.entityId
                  AND earlier.status != 'acked'
                  AND earlier.sequence < sync_outbox.sequence
              )
            ORDER BY sequence
            LIMIT ?
        `, [userId, nowIso, staleBefore, limit]);

        for (const row of rows) {
            await db.runAsync(`
                UPDATE sync_outbox
                SET status = 'in_flight',
                    attempts = attempts + 1,
                    lastAttemptAt = ?,
                    lastError = NULL
                WHERE id = ? AND ownerUserId = ?
            `, [nowIso, row.id, userId]);
        }
    });

    return rows.map((row) => ({
        ...row,
        attempts: row.attempts + 1,
        status: 'in_flight',
        lastAttemptAt: nowIso,
        payload: JSON.parse(row.payloadJson),
    }));
};

const aggregateIdFor = (row, payload) => {
    if (row.entityType === 'bet_slip') return row.entityId;
    return payload?.betSlipCloudId ?? null;
};

const isCloudId = (value) => typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const localKey = (value) => {
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (typeof value === 'string' && !/^[1-9]\d*$/.test(value)) return null;
    const result = Number(value);
    return Number.isSafeInteger(result) && result > 0 ? result : null;
};

const legacyAncestry = async (txDb, row, payload, userId) => {
    let rootId = isCloudId(payload.betSlipCloudId) ? payload.betSlipCloudId : null;
    let parentId = isCloudId(payload.parentCloudId) ? payload.parentCloudId : null;
    let resolvedRoot = null;
    let resolvedParent = null;

    if (row.entityType === 'bet_slip') {
        resolvedRoot = row.entityId;
    } else if (row.entityType === 'participant_bet') {
        const localSlipId = localKey(payload.betSlipId);
        if (localSlipId != null) {
            const slip = await txDb.getFirstAsync(`
                SELECT cloudId
                FROM BetSlips
                WHERE id = ? AND userId = ?
            `, [localSlipId, userId]);
            if (isCloudId(slip?.cloudId)) resolvedRoot = slip.cloudId;
        }
        if (!resolvedRoot && isCloudId(row.entityId)) {
            const participant = await txDb.getFirstAsync(`
                SELECT slip.cloudId AS betSlipCloudId
                FROM ParticipantBets AS participant
                JOIN BetSlips AS slip ON slip.id = participant.betSlipId
                WHERE participant.cloudId = ? AND slip.userId = ?
            `, [row.entityId, userId]);
            if (isCloudId(participant?.betSlipCloudId)) resolvedRoot = participant.betSlipCloudId;
        }
        if (!resolvedRoot && parentId) resolvedRoot = parentId;
        if (!resolvedParent && resolvedRoot) resolvedParent = resolvedRoot;
    } else if (row.entityType === 'bet_leg') {
        const localParticipantId = localKey(payload.participantBetId);
        if (localParticipantId != null) {
            const participant = await txDb.getFirstAsync(`
                SELECT participant.cloudId AS parentCloudId,
                       slip.cloudId AS betSlipCloudId
                FROM ParticipantBets AS participant
                JOIN BetSlips AS slip ON slip.id = participant.betSlipId
                WHERE participant.id = ? AND slip.userId = ?
            `, [localParticipantId, userId]);
            if (isCloudId(participant?.parentCloudId)) resolvedParent = participant.parentCloudId;
            if (isCloudId(participant?.betSlipCloudId)) resolvedRoot = participant.betSlipCloudId;
        }
        if ((!resolvedParent || !resolvedRoot) && isCloudId(row.entityId)) {
            const leg = await txDb.getFirstAsync(`
                SELECT participant.cloudId AS parentCloudId,
                       slip.cloudId AS betSlipCloudId
                FROM Legs AS leg
                JOIN ParticipantBets AS participant ON participant.id = leg.participantBetId
                JOIN BetSlips AS slip ON slip.id = participant.betSlipId
                WHERE leg.cloudId = ? AND slip.userId = ?
            `, [row.entityId, userId]);
            if (isCloudId(leg?.parentCloudId)) resolvedParent ??= leg.parentCloudId;
            if (isCloudId(leg?.betSlipCloudId)) resolvedRoot ??= leg.betSlipCloudId;
        }
        if ((!resolvedParent || !resolvedRoot) && parentId) {
            const participant = await txDb.getFirstAsync(`
                SELECT participant.cloudId AS parentCloudId,
                       slip.cloudId AS betSlipCloudId
                FROM ParticipantBets AS participant
                JOIN BetSlips AS slip ON slip.id = participant.betSlipId
                WHERE participant.cloudId = ? AND slip.userId = ?
            `, [parentId, userId]);
            if (isCloudId(participant?.parentCloudId)) resolvedParent ??= participant.parentCloudId;
            if (isCloudId(participant?.betSlipCloudId)) resolvedRoot ??= participant.betSlipCloudId;
        }
    } else {
        return { rootId, parentId, reason: `Unsupported legacy entity type '${row.entityType}'.` };
    }

    if (rootId && resolvedRoot && rootId !== resolvedRoot) {
        return { rootId, parentId, reason: 'Captured aggregate marker disagrees with preserved local ancestry.' };
    }
    if (parentId && resolvedParent && parentId !== resolvedParent) {
        return { rootId: rootId ?? resolvedRoot, parentId, reason: 'Captured parent marker disagrees with preserved local ancestry.' };
    }
    rootId ??= resolvedRoot;
    parentId ??= resolvedParent;

    if (!isCloudId(rootId)) {
        return { rootId: null, parentId, reason: 'Aggregate ancestry is unavailable from the immutable payload and preserved parent rows.' };
    }
    if (row.entityType !== 'bet_slip' && !isCloudId(parentId)) {
        return { rootId, parentId: null, reason: 'Direct-parent ancestry is unavailable from the immutable payload and preserved parent rows.' };
    }
    return { rootId, parentId, reason: null };
};

/**
 * Backfill only never-attempted outbox rows. Once an operation has been
 * claimed, even a failed request may have reached the server, so its original
 * payload remains byte-for-byte immutable. The current row's preserved local
 * parent reference is the only allowed fallback; missing ancestry blocks sync.
 */
const hydrateAggregateRows = async (txDb, userId, rows) => {
    const blockers = [];
    const hydrated = [];
    for (const row of rows) {
        let payload;
        try {
            payload = JSON.parse(row.payloadJson);
        } catch (error) {
            throw new Error(`Sync operation ${row.id} has invalid stored JSON: ${error.message}`);
        }
        if (row.status === 'acked') {
            hydrated.push({ ...row, payload, aggregateId: aggregateIdFor(row, payload) });
            continue;
        }

        const currentRoot = row.entityType === 'bet_slip'
            ? row.entityId
            : isCloudId(payload.betSlipCloudId) ? payload.betSlipCloudId : null;
        const currentParent = isCloudId(payload.parentCloudId) ? payload.parentCloudId : null;
        const rootMissing = !isCloudId(currentRoot);
        const parentMissing = row.entityType !== 'bet_slip' && !isCloudId(currentParent);
        let rootId = currentRoot;
        let parentId = currentParent;
        let resolutionError = null;

        if (rootMissing || parentMissing) {
            const ancestry = await legacyAncestry(txDb, row, payload, userId);
            rootId = ancestry.rootId;
            parentId = ancestry.parentId;
            resolutionError = ancestry.reason;
        }

        const markerChanges = {};
        if (!own(payload, 'betSlipCloudId') || !isCloudId(payload.betSlipCloudId)) {
            if (isCloudId(rootId)) markerChanges.betSlipCloudId = rootId;
        }
        if (row.entityType !== 'bet_slip'
            && (!own(payload, 'parentCloudId') || !isCloudId(payload.parentCloudId))) {
            if (isCloudId(parentId)) markerChanges.parentCloudId = parentId;
        }
        if (Object.keys(markerChanges).length > 0
            && row.attempts === 0
            && row.status === 'pending') {
            payload = { ...payload, ...markerChanges };
            const update = await txDb.runAsync(`
                UPDATE sync_outbox
                SET payloadJson = ?
                WHERE id = ? AND ownerUserId = ? AND status = 'pending' AND attempts = 0
            `, [JSON.stringify(payload), row.id, userId]);
            if (update.changes !== 1) {
                throw new Error(`Legacy sync operation ${row.id} changed during ancestry backfill.`);
            }
        } else if (Object.keys(markerChanges).length > 0) {
            resolutionError = 'Ancestry is recoverable, but this operation was attempted; immutable retry payload cannot be changed.';
        }

        const aggregateId = isCloudId(rootId) ? rootId : null;
        if (resolutionError || !aggregateId) {
            blockers.push({
                operationId: row.id,
                entityType: row.entityType,
                aggregateId,
                reason: resolutionError ?? 'Missing immutable aggregate ancestry.',
            });
        }
        hydrated.push({ ...row, payload, aggregateId });
    }
    return { rows: hydrated, blockers };
};

const operationIsDue = (row, nowIso, staleBefore) => (
    row.status === 'pending'
    || (row.status === 'failed' && (row.nextAttemptAt == null || row.nextAttemptAt <= nowIso))
    || (row.status === 'in_flight' && row.lastAttemptAt != null && row.lastAttemptAt <= staleBefore)
);

/**
 * Claims the current per-entity head operations for exactly one complete
 * bet-slip aggregate. An aggregate is never truncated to fit the batch limit.
 * Child grouping comes only from immutable trigger-captured betSlipCloudId.
 */
export const claimPendingSyncAggregate = async (
    db,
    userId,
    limit = MAX_AGGREGATE_OPERATIONS,
    now = new Date()
) => {
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_AGGREGATE_OPERATIONS) {
        throw new Error('Sync aggregate limit must be an integer between 1 and 500.');
    }

    const nowIso = now.toISOString();
    const staleBefore = new Date(now.getTime() - STALE_ATTEMPT_MS).toISOString();
    let claimed = { aggregateId: null, operations: [], blocked: [] };

    if (typeof db.withExclusiveTransactionAsync !== 'function') {
        throw new Error('Exclusive SQLite transactions are required to claim sync aggregates safely.');
    }

    await db.withExclusiveTransactionAsync(async (txDb) => {
        const rows = await txDb.getAllAsync(`
            SELECT *
            FROM sync_outbox
            WHERE ownerUserId = ?
            ORDER BY sequence
        `, [userId]);

        const hydrated = await hydrateAggregateRows(txDb, userId, rows);
        const groups = new Map();
        const blocked = [...hydrated.blockers];
        for (const row of hydrated.rows) {
            const aggregateId = row.aggregateId;
            if (typeof aggregateId !== 'string' || aggregateId.length === 0) {
                if (row.status === 'acked') continue;
                continue;
            }
            if (!groups.has(aggregateId)) groups.set(aggregateId, []);
            groups.get(aggregateId).push(row);
        }

        // An operation whose aggregate root is genuinely unrecoverable could
        // belong to any slip; do not send another aggregate partially.
        if (blocked.some((item) => !item.aggregateId)) {
            claimed.blocked = blocked;
            return;
        }

        const eligible = [];
        for (const [aggregateId, aggregateRows] of groups) {
            if (blocked.some((item) => item.aggregateId === aggregateId)) continue;
            const unresolved = aggregateRows.filter((row) => row.status !== 'acked');
            const attempted = unresolved.filter((row) =>
                ['in_flight', 'failed'].includes(row.status) && row.lastAttemptAt != null
            );
            let operations;
            if (attempted.length > 0) {
                const batchMarkers = new Set(attempted.map((row) => row.lastAttemptAt));
                if (batchMarkers.size !== 1) {
                    blocked.push({
                        aggregateId,
                        reason: 'Unacknowledged operations have multiple retry batch markers; refusing a partial aggregate replay.',
                    });
                    continue;
                }
                const marker = attempted[0].lastAttemptAt;
                const previouslyAcked = aggregateRows.some((row) =>
                    row.status === 'acked' && row.lastAttemptAt === marker
                );
                if (previouslyAcked) {
                    blocked.push({
                        aggregateId,
                        reason: 'A prior aggregate attempt was only partially acknowledged; manual reconciliation is required.',
                    });
                    continue;
                }
                operations = unresolved.filter((row) => row.lastAttemptAt === marker);
            } else {
                if (unresolved.some((row) => row.status === 'failed' || row.status === 'in_flight')) {
                    blocked.push({
                        aggregateId,
                        reason: 'An unacknowledged operation has no stable retry marker; refusing to rebuild its request.',
                    });
                    continue;
                }
                operations = unresolved;
            }
            operations.sort((left, right) => left.sequence - right.sequence);
            if (operations.length > limit) {
                blocked.push({
                    aggregateId,
                    reason: `Aggregate has ${operations.length} current entity operations; the atomic RPC limit is ${limit}.`,
                });
                continue;
            }
            if (!operations.every((operation) => operationIsDue(operation, nowIso, staleBefore))) {
                continue;
            }
            const previousMarkers = aggregateRows
                .map((row) => row.lastAttemptAt)
                .filter(Boolean)
                .map((marker) => Date.parse(marker))
                .filter(Number.isFinite);
            const claimTimestamp = new Date(Math.max(
                now.getTime(),
                previousMarkers.length ? Math.max(...previousMarkers) + 1 : now.getTime()
            )).toISOString();
            eligible.push({
                aggregateId,
                sequence: operations[0]?.sequence ?? Number.MAX_SAFE_INTEGER,
                operations,
                claimTimestamp,
            });
        }

        eligible.sort((left, right) => left.sequence - right.sequence);
        const next = eligible[0];
        if (!next) {
            claimed.blocked = blocked;
            return;
        }

        for (const row of next.operations) {
            const update = await txDb.runAsync(`
                UPDATE sync_outbox
                SET status = 'in_flight',
                    attempts = attempts + 1,
                    lastAttemptAt = ?,
                    lastError = NULL
                WHERE id = ? AND ownerUserId = ? AND status = ?
            `, [next.claimTimestamp, row.id, userId, row.status]);
            if (update.changes !== 1) {
                throw new Error(`Sync operation ${row.id} changed while its aggregate was being claimed.`);
            }
        }

        claimed = {
            aggregateId: next.aggregateId,
            operations: next.operations.map((row) => ({
                ...row,
                attempts: row.attempts + 1,
                previousAttempts: row.attempts,
                status: 'in_flight',
                lastAttemptAt: next.claimTimestamp,
                payload: row.payload,
            })),
            blocked,
        };
    });

    return claimed;
};

export const coalesceUnsentSyncAggregates = async (db, userId, now = new Date()) => {
    if (typeof db.withExclusiveTransactionAsync !== 'function') {
        throw new Error('Exclusive SQLite transactions are required to coalesce sync aggregates safely.');
    }
    let result = { coalesced: 0, blocked: [] };
    await db.withExclusiveTransactionAsync(async (txDb) => {
        const rows = await txDb.getAllAsync(`
            SELECT *
            FROM sync_outbox
            WHERE ownerUserId = ?
            ORDER BY sequence
        `, [userId]);
        const hydrated = await hydrateAggregateRows(txDb, userId, rows);
        const groups = new Map();
        for (const row of hydrated.rows) {
            const aggregateId = row.aggregateId;
            if (typeof aggregateId !== 'string' || aggregateId.length === 0) continue;
            if (!groups.has(aggregateId)) groups.set(aggregateId, []);
            groups.get(aggregateId).push(row);
        }

        for (const [aggregateId, aggregateRows] of groups) {
            const unacked = aggregateRows.filter((row) => row.status !== 'acked');
            if (unacked.length === 0
                || !unacked.every((row) =>
                    row.status === 'pending'
                    && row.attempts === 0
                    && row.expectedRevision === 0
                )) continue;

            const perEntity = new Map();
            for (const row of unacked) {
                const key = `${row.entityType}:${row.entityId}`;
                if (!perEntity.has(key)) perEntity.set(key, new Set());
                perEntity.get(key).add(row.action);
            }
            if (![...perEntity.values()].every((actions) => actions.has('upsert') && actions.has('delete'))) {
                continue;
            }
            const slipGroup = perEntity.get(`bet_slip:${aggregateId}`);
            if (!slipGroup?.has('upsert') || !slipGroup.has('delete')) continue;

            const timestamp = now.toISOString();
            const update = await txDb.runAsync(`
                UPDATE sync_outbox
                SET status = 'acked',
                    acknowledgedAt = ?,
                    lastError = 'Coalesced: complete aggregate was created and deleted before first upload.',
                    nextAttemptAt = NULL
                WHERE ownerUserId = ? AND status = 'pending'
                  AND attempts = 0 AND expectedRevision = 0
                  AND sequence IN (${unacked.map(() => '?').join(',')})
            `, [timestamp, userId, ...unacked.map((row) => row.sequence)]);
            if (update.changes !== unacked.length) {
                throw new Error(`Offline aggregate ${aggregateId} changed while coalescing.`);
            }
            result.coalesced += update.changes;
        }

        // Legacy child operations without an immutable aggregate key are not
        // coalesced; the claimant will surface them as unavailable.
        result.blocked = hydrated.blockers;
    });
    return result;
};

export const acknowledgeSyncAggregate = async (
    db,
    userId,
    cloudUserId,
    acknowledgements,
    acknowledgedAt = new Date()
) => {
    if (!Array.isArray(acknowledgements) || acknowledgements.length === 0) {
        throw new Error('At least one aggregate acknowledgement is required.');
    }
    if (typeof db.withExclusiveTransactionAsync !== 'function') {
        throw new Error('Exclusive SQLite transactions are required to acknowledge sync aggregates safely.');
    }

    await db.withExclusiveTransactionAsync(async (txDb) => {
        const localUser = await txDb.getFirstAsync(
            'SELECT cloudUserId FROM Users WHERE id = ?',
            [userId]
        );
        if (!localUser || localUser.cloudUserId !== cloudUserId) {
            throw new Error('The local-to-cloud account mapping changed before aggregate acknowledgement.');
        }

        const operationIds = acknowledgements.map((item) => item.operationId);
        if (new Set(operationIds).size !== operationIds.length) {
            throw new Error('Aggregate acknowledgement contains duplicate operation IDs.');
        }
        const placeholders = operationIds.map(() => '?').join(', ');
        const operations = await txDb.getAllAsync(`
            SELECT id, entityType, entityId, payloadJson
            FROM sync_outbox
            WHERE ownerUserId = ? AND status = 'in_flight'
              AND id IN (${placeholders})
        `, [userId, ...operationIds]);
        if (operations.length !== acknowledgements.length) {
            throw new Error('The claimed aggregate changed before it could be acknowledged.');
        }

        const revisions = new Map();
        for (const acknowledgement of acknowledgements) {
            const operation = operations.find((row) => row.id === acknowledgement.operationId);
            if (!operation
                || operation.entityType !== acknowledgement.entityType
                || operation.entityId !== acknowledgement.entityId
                || !Number.isSafeInteger(acknowledgement.revision)
                || acknowledgement.revision < 1) {
                throw new Error(`Invalid aggregate acknowledgement for ${acknowledgement.operationId}.`);
            }
            await updateLocalRevision(txDb, operation, userId, acknowledgement.revision);
            const entityKey = `${operation.entityType}:${operation.entityId}`;
            revisions.set(entityKey, Math.max(
                revisions.get(entityKey) ?? 0,
                acknowledgement.revision
            ));
        }

        const timestamp = acknowledgedAt.toISOString();
        for (const acknowledgement of acknowledgements) {
            const update = await txDb.runAsync(`
                UPDATE sync_outbox
                SET status = 'acked',
                    acknowledgedAt = ?,
                    lastError = NULL,
                    nextAttemptAt = NULL
                WHERE id = ? AND ownerUserId = ? AND status = 'in_flight'
            `, [timestamp, acknowledgement.operationId, userId]);
            requireChangedRow(update, 'A claimed aggregate operation could not be acknowledged.');
        }
        for (const [entityKey, revision] of revisions) {
            const separator = entityKey.indexOf(':');
            const entityType = entityKey.slice(0, separator);
            const entityId = entityKey.slice(separator + 1);
            await txDb.runAsync(`
                UPDATE sync_outbox
                SET expectedRevision = ?
                WHERE ownerUserId = ? AND entityType = ? AND entityId = ? AND status = 'pending'
            `, [revision, userId, entityType, entityId]);
        }

        const oddsInvalidated = operations.filter((operation) => {
            const payload = JSON.parse(operation.payloadJson);
            return payload.oddsChanged === true || payload.oddsChanged === 1;
        });
        if (oddsInvalidated.length > 0) {
            const suppression = await txDb.runAsync(
                'INSERT OR IGNORE INTO sync_pull_context (userId) VALUES (?)',
                [userId]
            );
            try {
                for (const operation of oddsInvalidated) {
                    if (operation.entityType === 'bet_slip') {
                        await txDb.runAsync(
                            'UPDATE BetSlips SET cloudDecimalOdds = NULL WHERE cloudId = ? AND userId = ?',
                            [operation.entityId, userId]
                        );
                    } else if (operation.entityType === 'participant_bet') {
                        await txDb.runAsync(`
                            UPDATE ParticipantBets
                            SET cloudDecimalOdds = NULL
                            WHERE cloudId = ? AND EXISTS (
                                SELECT 1 FROM BetSlips
                                WHERE BetSlips.id = ParticipantBets.betSlipId
                                  AND BetSlips.userId = ?
                            )
                        `, [operation.entityId, userId]);
                    } else if (operation.entityType === 'bet_leg') {
                        await txDb.runAsync(`
                            UPDATE Legs
                            SET cloudOddsAtPlacement = NULL
                            WHERE cloudId = ? AND EXISTS (
                                SELECT 1 FROM ParticipantBets
                                JOIN BetSlips ON BetSlips.id = ParticipantBets.betSlipId
                                WHERE ParticipantBets.id = Legs.participantBetId
                                  AND BetSlips.userId = ?
                            )
                        `, [operation.entityId, userId]);
                    }
                }
            } finally {
                if (suppression.changes === 1) {
                    await txDb.runAsync('DELETE FROM sync_pull_context WHERE userId = ?', [userId]);
                }
            }
        }
    });
};

export const failSyncAggregate = async (db, userId, operationIds, error, nextAttemptAt = null) => {
    if (!Array.isArray(operationIds) || operationIds.length === 0) return;
    if (typeof db.withExclusiveTransactionAsync !== 'function') {
        throw new Error('Exclusive SQLite transactions are required to fail sync aggregates safely.');
    }
    const message = (error instanceof Error ? error.message : String(error)).slice(0, 1000);
    await db.withExclusiveTransactionAsync(async (txDb) => {
        const uniqueIds = [...new Set(operationIds)];
        const placeholders = uniqueIds.map(() => '?').join(', ');
        const update = await txDb.runAsync(`
            UPDATE sync_outbox
            SET status = 'failed', lastError = ?, nextAttemptAt = ?
            WHERE ownerUserId = ? AND status = 'in_flight' AND id IN (${placeholders})
        `, [message, nextAttemptAt, userId, ...uniqueIds]);
        requireChangedRow(
            { changes: update.changes === uniqueIds.length ? 1 : 0 },
            'The entire claimed aggregate could not be marked as failed.'
        );
    });
};

export const markSyncOperationFailed = async (db, userId, operationId, error, nextAttemptAt = null) => {
    const message = error instanceof Error ? error.message : String(error);
    const result = await db.runAsync(`
        UPDATE sync_outbox
        SET status = 'failed',
            lastError = ?,
            nextAttemptAt = ?
        WHERE id = ? AND ownerUserId = ? AND status = 'in_flight'
    `, [message.slice(0, 1000), nextAttemptAt, operationId, userId]);
    requireChangedRow(result, 'The claimed sync operation could not be marked as failed.');
};

const updateLocalRevision = async (db, operation, userId, serverRevision) => {
    if (operation.entityType === 'bet_slip') {
        await db.runAsync(
            'UPDATE BetSlips SET cloudRevision = MAX(cloudRevision, ?) WHERE cloudId = ? AND userId = ?',
            [serverRevision, operation.entityId, userId]
        );
    } else if (operation.entityType === 'participant_bet') {
        await db.runAsync(`
            UPDATE ParticipantBets
            SET cloudRevision = MAX(cloudRevision, ?)
            WHERE cloudId = ? AND EXISTS (
                SELECT 1 FROM BetSlips
                WHERE BetSlips.id = ParticipantBets.betSlipId AND BetSlips.userId = ?
            )
        `, [serverRevision, operation.entityId, userId]);
    } else if (operation.entityType === 'bet_leg') {
        await db.runAsync(`
            UPDATE Legs
            SET cloudRevision = MAX(cloudRevision, ?)
            WHERE cloudId = ? AND EXISTS (
                SELECT 1 FROM ParticipantBets
                JOIN BetSlips ON BetSlips.id = ParticipantBets.betSlipId
                WHERE ParticipantBets.id = Legs.participantBetId AND BetSlips.userId = ?
            )
        `, [serverRevision, operation.entityId, userId]);
    } else {
        throw new Error(`Unsupported sync entity type: ${operation.entityType}`);
    }
};

export const acknowledgeSyncOperation = async (
    db,
    userId,
    operationId,
    serverRevision,
    acknowledgedAt = new Date()
) => {
    if (!Number.isSafeInteger(serverRevision) || serverRevision < 1) {
        throw new Error('Server revision must be a positive safe integer.');
    }

    await db.withTransactionAsync(async () => {
        const operation = await db.getFirstAsync(`
            SELECT entityType, entityId
            FROM sync_outbox
            WHERE id = ? AND ownerUserId = ? AND status = 'in_flight'
        `, [operationId, userId]);
        if (!operation) {
            throw new Error('The claimed sync operation could not be acknowledged.');
        }

        await updateLocalRevision(db, operation, userId, serverRevision);
        const result = await db.runAsync(`
            UPDATE sync_outbox
            SET status = 'acked',
                acknowledgedAt = ?,
                lastError = NULL,
                nextAttemptAt = NULL
            WHERE id = ? AND ownerUserId = ? AND status = 'in_flight'
        `, [acknowledgedAt.toISOString(), operationId, userId]);
        requireChangedRow(result, 'The claimed sync operation could not be acknowledged.');

        await db.runAsync(`
            UPDATE sync_outbox
            SET expectedRevision = ?
            WHERE ownerUserId = ? AND entityType = ? AND entityId = ? AND status = 'pending'
        `, [serverRevision, userId, operation.entityType, operation.entityId]);
    });
};

export const getUserSyncState = async (db, userId) => {
    return db.getFirstAsync('SELECT * FROM user_sync_state WHERE userId = ?', [userId]);
};

export const saveUserPullCursor = async (db, userId, cursor, pulledAt = new Date()) => {
    const timestamp = pulledAt.toISOString();
    await db.runAsync(`
        INSERT INTO user_sync_state (userId, pullCursor, lastPulledAt, updatedAt)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(userId) DO UPDATE SET
            pullCursor = excluded.pullCursor,
            lastPulledAt = excluded.lastPulledAt,
            updatedAt = excluded.updatedAt
    `, [userId, cursor, timestamp, timestamp]);
};
