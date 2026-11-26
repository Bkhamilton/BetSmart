const STALE_ATTEMPT_MS = 5 * 60 * 1000;

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
