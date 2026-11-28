import {
    acknowledgeSyncAggregate,
    claimPendingSyncAggregate,
    coalesceUnsentSyncAggregates,
    failSyncAggregate,
} from './outbox.js';

const AGGREGATE_LIMIT = 500;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const asError = (error) => error instanceof Error
    ? error
    : new Error(typeof error === 'string' ? error : JSON.stringify(error));

const isConflict = (error) => {
    const code = error?.code ?? error?.cause?.code;
    return ['40001', '23503', '23514'].includes(code)
        || /sync revision conflict|live child|aggregate deletion|parent does not match/i
            .test(String(error?.message ?? error));
};

const warning = (operation, field, reason = 'snapshot was not captured in this outbox row') => ({
    operationId: operation.id,
    field,
    message: `${field}: ${reason}; restored value is unavailable and was not synthesized.`,
});

const requireUuid = (value, label) => {
    if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
        throw new Error(`Immutable ${label} is missing or is not a cloud UUID.`);
    }
    return value;
};

const checkedNumber = (value, label, { nullable = false } = {}) => {
    if (nullable && value == null) return null;
    if (value == null || typeof value === 'boolean') {
        throw new Error(`Outbox payload has a missing or invalid ${label}.`);
    }
    if (typeof value !== 'number' && typeof value !== 'string') {
        throw new Error(`Outbox payload has an invalid ${label}.`);
    }
    if (typeof value === 'string' && value.trim().length === 0) {
        throw new Error(`Outbox payload has a blank ${label}.`);
    }
    const result = Number(value);
    if (!Number.isFinite(result)) throw new Error(`Outbox payload has an invalid ${label}.`);
    return result;
};

const textValue = (value, label, { nullable = false } = {}) => {
    if (nullable && value == null) return null;
    if (typeof value !== 'string' || value.length === 0) {
        throw new Error(`Outbox payload has no ${label}.`);
    }
    return value;
};

const exactDecimal = (value, scale, label, { nullable = false, min = null } = {}) => {
    if (nullable && value == null) return null;
    if (typeof value !== 'string'
        || !new RegExp(`^-?\\d+(?:\\.\\d{1,${scale}})?$`).test(value)) {
        throw new Error(`${label} must be an exact decimal string with at most ${scale} fractional digits.`);
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || (min != null && numeric <= min)) {
        throw new Error(`${label} is outside the supported numeric range.`);
    }
    return value;
};

const moneyString = (value, field) => {
    const numeric = checkedNumber(value, field);
    if (numeric < 0) throw new Error(`${field} cannot be negative.`);
    const text = String(numeric);
    if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(text)) {
        throw new Error(`${field} edit is not representable at USD cents without rounding.`);
    }
    return text;
};

const cloudMoneyValue = (
    localValue,
    originalValue,
    currencyCode,
    field,
    { nullable = false } = {}
) => {
    if (localValue == null && originalValue == null && nullable) return null;
    if (localValue == null) {
        if (nullable) return null;
        throw new Error(`${field} is required.`);
    }
    const localNumber = checkedNumber(localValue, field);
    if (typeof originalValue === 'string') {
        const exactOriginal = exactDecimal(originalValue, 2, `Cloud ${field}`);
        if (Number(exactOriginal) === localNumber) return exactOriginal;
    } else if (originalValue != null) {
        throw new Error(`Cloud ${field} snapshot is not an exact decimal string.`);
    }
    if (currencyCode !== 'USD') {
        throw new Error(`Changed ${field} in ${currencyCode} is blocked; currency precision is not configured.`);
    }
    return moneyString(localValue, field);
};

const isResultOperation = (payload) => own(payload, 'resultDeleted')
    || own(payload, 'resultAt')
    || own(payload, 'legacyResultId');

const oddsChangeIntent = (stored) => {
    if (!own(stored, 'oddsChanged')) return false;
    if (stored.oddsChanged === true || stored.oddsChanged === 1) return true;
    if (stored.oddsChanged === false || stored.oddsChanged === 0) return false;
    throw new Error('Outbox payload has an invalid oddsChanged flag.');
};

const aggregateAndParentMarkers = (operation, stored, warnings) => {
    const resultOperation = isResultOperation(stored ?? {});
    let aggregateId = stored?.betSlipCloudId;
    if (operation.entityType === 'bet_slip') {
        if (aggregateId == null) {
            aggregateId = operation.entityId;
            warnings.push(warning(operation, 'betSlipCloudId', 'root identity was derived from immutable entityId'));
        }
        if (aggregateId !== operation.entityId) {
            throw new Error('Bet-slip operation entityId does not match betSlipCloudId.');
        }
    } else {
        aggregateId = requireUuid(aggregateId, 'betSlipCloudId');
    }

    let parentId = null;
    if (['participant_bet', 'bet_leg'].includes(operation.entityType) && !resultOperation) {
        parentId = requireUuid(stored?.parentCloudId, 'parentCloudId');
    } else if (resultOperation && stored?.parentCloudId != null) {
        parentId = requireUuid(stored.parentCloudId, 'parentCloudId');
    }

    return { aggregateId: requireUuid(aggregateId, 'betSlipCloudId'), parentId, resultOperation };
};

const missingSnapshot = (operation, stored, field, warnings, { requiredForSynced = false } = {}) => {
    if (own(stored, field)) return false;
    warnings.push(warning(operation, field));
    if (requiredForSynced && operation.expectedRevision > 0) {
        throw new Error(`Missing immutable ${field} on a previously synced outbox operation.`);
    }
    return true;
};

const resultPayload = (operation, stored, base) => {
    const deleted = stored.resultDeleted === true || stored.resultDeleted === 1;
    if (deleted) {
        return { ...base, legacy_result: null, legacy_result_at: null, status: 'pending' };
    }
    const result = checkedNumber(stored.result, 'settlement result');
    if (![-1, 0, 1].includes(result)) {
        throw new Error(`Unsupported stored result '${stored.result}'; expected -1, 0, or 1.`);
    }
    if (typeof stored.resultAt !== 'string' || Number.isNaN(Date.parse(stored.resultAt))) {
        throw new Error(`Result operation ${operation.id} has no valid immutable resultAt.`);
    }
    return {
        ...base,
        legacy_result: result,
        legacy_result_at: stored.resultAt,
        status: result === 1 ? 'won' : result === 0 ? 'lost' : 'push',
    };
};

const serializeOperation = (operation, cloudUserId, priorOddsInvalidated = false) => {
    const stored = operation.payload;
    const warnings = [];
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
        throw new Error(`Outbox operation ${operation.id} has an invalid immutable payload.`);
    }
    const { aggregateId, parentId, resultOperation } =
        aggregateAndParentMarkers(operation, stored, warnings);

    if (operation.previousAttempts > 0
        && operation.action === 'upsert'
        && !resultOperation) {
        const requiredV4Fields = operation.entityType === 'bet_slip'
            ? ['betSlipCloudId', 'cloudCurrencyCode', 'cloudStake', 'cloudPayout', 'cloudDecimalOdds', 'oddsChanged']
            : operation.entityType === 'participant_bet'
                ? ['betSlipCloudId', 'parentCloudId', 'cloudDecimalOdds', 'oddsChanged']
                : [
                    'betSlipCloudId', 'parentCloudId', 'cloudOddsAtPlacement',
                    'cloudLineAtPlacement', 'oddsChanged',
                ];
        const missing = requiredV4Fields.filter((field) => !own(stored, field));
        if (missing.length) {
            throw new Error(
                `Prior request may already have reached Supabase, but this older outbox row lacks ` +
                `${missing.join(', ')}; immutable replay cannot be proven.`
            );
        }
    }

    const base = {
        user_id: cloudUserId,
        bet_slip_cloud_id: aggregateId,
    };
    if (parentId) base.parent_cloud_id = parentId;

    if (operation.action === 'delete') {
        return { payload: base, warnings, oddsInvalidated: priorOddsInvalidated };
    }
    if (resultOperation) {
        return {
            payload: resultPayload(operation, stored, base),
            warnings,
            oddsInvalidated: priorOddsInvalidated,
        };
    }
    const oddsChanged = oddsChangeIntent(stored) || priorOddsInvalidated;

    if (operation.entityType === 'bet_slip') {
        for (const field of ['betAmount', 'winnings']) {
            if (!own(stored, field)) {
                throw new Error(`Outbox payload is incomplete: required source field '${field}' is missing.`);
            }
        }
        const required = ['formatNameSnapshot', 'bookieNameSnapshot', 'cloudCurrencyCode',
            'cloudStake', 'cloudPayout', 'cloudLegacyFormatId', 'cloudLegacyBookieId',
            'cloudDecimalOdds', 'cloudBookieId', 'cloudNotes', 'oddsChanged'];
        for (const field of required) missingSnapshot(operation, stored, field, warnings);
        if (oddsChanged && !own(stored, 'cloudDecimalOdds')) {
            throw new Error('Decimal odds snapshot is unavailable for an odds-changing bet; refusing to leave stale remote odds.');
        }
        if (operation.expectedRevision > 0 && !own(stored, 'oddsChanged')) {
            throw new Error('Odds-change intent is unavailable for this synced bet; refusing to overwrite its decimal odds.');
        }

        let currencyCode = stored.cloudCurrencyCode;
        if (currencyCode == null) {
            if (operation.expectedRevision > 0) {
                warnings.push(warning(
                    operation,
                    'cloudCurrencyCode',
                    'legacy local records are treated as the user-confirmed USD default'
                ));
            }
            currencyCode = 'USD';
        }
        if (typeof currencyCode !== 'string' || !/^[A-Z]{3}$/.test(currencyCode)) {
            throw new Error('Bet currency code is invalid.');
        }

        const payload = {
            ...base,
            stake: cloudMoneyValue(
                stored.betAmount, stored.cloudStake,
                currencyCode, 'stake'
            ),
            payout: cloudMoneyValue(
                stored.winnings, stored.cloudPayout,
                currencyCode, 'payout', { nullable: true }
            ),
            currency_code: currencyCode,
            placed_at: textValue(stored.date, 'placement timestamp'),
            odds_snapshot: textValue(stored.odds, 'odds snapshot'),
        };
        if (typeof stored.cloudStatus === 'string') {
            if (!['pending', 'won', 'lost', 'void', 'push', 'cashed_out', 'partial']
                .includes(stored.cloudStatus)) {
                throw new Error(`Unsupported stored bet status '${stored.cloudStatus}'.`);
            }
            payload.status = stored.cloudStatus;
        } else if (operation.expectedRevision === 0) {
            payload.status = 'pending';
        } else {
            warnings.push(warning(operation, 'cloudStatus'));
        }
        if (own(stored, 'formatNameSnapshot')) payload.bet_format = stored.formatNameSnapshot;
        if (own(stored, 'bookieNameSnapshot')) {
            payload.bookie_display_name_snapshot = stored.bookieNameSnapshot;
        }
        if (own(stored, 'cloudBookieId')) payload.user_bookie_id = stored.cloudBookieId;
        if (own(stored, 'cloudDecimalOdds')) {
            payload.decimal_odds = oddsChanged
                ? null
                : stored.cloudDecimalOdds == null
                    ? null
                    : exactDecimal(stored.cloudDecimalOdds, 6, 'Cloud decimal odds', { min: 1 });
        }
        if (own(stored, 'cloudNotes')) payload.notes = stored.cloudNotes;

        const legacyFormat = own(stored, 'cloudLegacyFormatId')
            ? stored.cloudLegacyFormatId
            : operation.expectedRevision === 0 ? stored.formatId : undefined;
        const legacyBookie = own(stored, 'cloudLegacyBookieId')
            ? stored.cloudLegacyBookieId
            : operation.expectedRevision === 0 ? stored.bookieId : undefined;
        if (legacyFormat !== undefined) payload.legacy_format_id = legacyFormat;
        if (legacyBookie !== undefined) payload.legacy_bookie_id = legacyBookie;
        if (own(stored, 'cloudSettledAt')) payload.settled_at = stored.cloudSettledAt;
        return { payload, warnings, oddsInvalidated: oddsChanged };
    }

    if (operation.entityType === 'participant_bet') {
        for (const field of [
            'gameDateSnapshot', 'leagueSnapshot', 'homeTeamAbbreviationSnapshot',
            'awayTeamAbbreviationSnapshot', 'cloudGameReferenceId', 'cloudDecimalOdds',
            'oddsChanged',
        ]) missingSnapshot(operation, stored, field, warnings);
        if (oddsChanged && !own(stored, 'cloudDecimalOdds')) {
            throw new Error('Decimal odds snapshot is unavailable for an odds-changing participant; refusing to leave stale remote odds.');
        }
        if (operation.expectedRevision > 0 && !own(stored, 'oddsChanged')) {
            throw new Error('Odds-change intent is unavailable for this synced participant; refusing to overwrite its decimal odds.');
        }
        const gameReference = stored.gameId ?? stored.cloudGameReferenceId;
        if (typeof gameReference !== 'string' || gameReference.length === 0) {
            throw new Error('Neither a local game reference nor an immutable cloud game reference is available.');
        }
        const payload = {
            ...base,
            parent_cloud_id: parentId,
            bet_slip_id: parentId,
            game_reference_id: gameReference,
            odds_snapshot: textValue(stored.odds, 'participant odds snapshot'),
        };
        if (own(stored, 'cloudDecimalOdds')) {
            payload.decimal_odds = oddsChanged
                ? null
                : stored.cloudDecimalOdds == null
                    ? null
                    : exactDecimal(stored.cloudDecimalOdds, 6, 'Cloud participant decimal odds', { min: 1 });
        }
        if (own(stored, 'sportSnapshot')) payload.sport_snapshot = stored.sportSnapshot;
        if (own(stored, 'homeTeamSnapshot')) payload.home_team_snapshot = stored.homeTeamSnapshot;
        if (own(stored, 'awayTeamSnapshot')) payload.away_team_snapshot = stored.awayTeamSnapshot;
        if (own(stored, 'gameDateSnapshot')) payload.game_date_snapshot = stored.gameDateSnapshot;
        if (own(stored, 'leagueSnapshot')) payload.league_snapshot = stored.leagueSnapshot;
        if (own(stored, 'homeTeamAbbreviationSnapshot')) {
            payload.home_team_abbreviation_snapshot = stored.homeTeamAbbreviationSnapshot;
        }
        if (own(stored, 'awayTeamAbbreviationSnapshot')) {
            payload.away_team_abbreviation_snapshot = stored.awayTeamAbbreviationSnapshot;
        }
        if (own(stored, 'cloudSettledAt')) payload.legacy_result_at = stored.cloudSettledAt;
        return { payload, warnings, oddsInvalidated: oddsChanged };
    }

    if (operation.entityType === 'bet_leg') {
        for (const field of [
            'cloudMarketReferenceId', 'cloudSelectionDescription', 'cloudOddsAtPlacement',
            'cloudLineAtPlacement',
            'cloudLegacyMarketId', 'cloudLegacyBetTypeId', 'cloudLegacyTargetId',
            'cloudLegacyBookieReferenceId', 'betTypeSnapshot', 'oddsChanged',
        ]) missingSnapshot(operation, stored, field, warnings, {
            requiredForSynced: field === 'cloudLineAtPlacement',
        });
        if (oddsChanged && !own(stored, 'cloudOddsAtPlacement')) {
            throw new Error('Placement odds snapshot is unavailable for an odds-changing leg; refusing to leave stale remote odds.');
        }
        if (operation.expectedRevision > 0 && !own(stored, 'oddsChanged')) {
            throw new Error('Odds-change intent is unavailable for this synced leg; refusing to overwrite its placement odds.');
        }

        const marketType = stored.marketTypeSnapshot ?? null;
        const marketValue = stored.marketValueSnapshot ?? null;
        const targetName = stored.targetNameSnapshot ?? null;
        const targetType = stored.targetTypeSnapshot ?? null;
        const overUnder = stored.overUnderSnapshot ?? null;
        const description = stored.cloudSelectionDescription
            ?? [targetName, marketType, marketValue, overUnder].filter(Boolean).join(' ');
        if (!description) {
            throw new Error('No immutable leg selection description is available.');
        }
        const payload = {
            ...base,
            parent_cloud_id: parentId,
            participant_bet_id: parentId,
            selection_description: description,
        };
        if (own(stored, 'cloudMarketReferenceId')) {
            payload.market_reference_id = stored.cloudMarketReferenceId;
        }
        if (own(stored, 'cloudOddsAtPlacement')) {
            payload.odds_at_placement = oddsChanged
                ? null
                : stored.cloudOddsAtPlacement == null
                    ? null
                    : exactDecimal(stored.cloudOddsAtPlacement, 6, 'Cloud leg odds at placement', { min: 1 });
        }
        if (own(stored, 'cloudLineAtPlacement')) {
            if (stored.cloudLineAtPlacement != null) {
                payload.line_at_placement = exactDecimal(
                    stored.cloudLineAtPlacement, 4, 'Cloud leg line'
                );
            } else if (operation.expectedRevision > 0) {
                // A restored null is an explicit cloud value. Do not infer a
                // line from marketValueSnapshot, which is an independent field.
                payload.line_at_placement = null;
            } else if (typeof marketValue === 'string' && /^-?\d+(?:\.\d+)?$/.test(marketValue)) {
                // For new local records only, the legacy market value is the
                // available source for an initial line value.
                payload.line_at_placement = exactDecimal(marketValue, 4, 'Leg line');
            } else {
                payload.line_at_placement = null;
            }
        } else if (operation.expectedRevision === 0
            && typeof marketValue === 'string'
            && /^-?\d+(?:\.\d+)?$/.test(marketValue)) {
            // Compatibility for never-synced legacy rows whose immutable
            // outbox snapshot predates the independent line column.
            payload.line_at_placement = exactDecimal(marketValue, 4, 'Leg line');
        }
        if (own(stored, 'oddsSnapshot')) payload.odds_snapshot = stored.oddsSnapshot;
        if (own(stored, 'marketTypeSnapshot')) payload.market_type_snapshot = marketType;
        if (own(stored, 'marketValueSnapshot')) payload.market_value_snapshot = marketValue;
        if (own(stored, 'overUnderSnapshot')) payload.over_under_snapshot = overUnder;
        if (own(stored, 'targetNameSnapshot')) payload.target_name_snapshot = targetName;
        if (own(stored, 'targetTypeSnapshot')) payload.target_type_snapshot = targetType;
        if (own(stored, 'betTypeSnapshot')) payload.bet_type_snapshot = stored.betTypeSnapshot;

        const legacyFields = [
            ['cloudLegacyMarketId', 'legacy_market_id', 'betMarketId'],
            ['cloudLegacyBetTypeId', 'legacy_bet_type_id', 'betTypeId'],
            ['cloudLegacyTargetId', 'legacy_target_id', 'targetIdSnapshot'],
            ['cloudLegacyBookieReferenceId', 'bookie_reference_id', 'bookieIdSnapshot'],
        ];
        for (const [snapshot, target, local] of legacyFields) {
            if (own(stored, snapshot)) {
                payload[target] = stored[snapshot];
            } else if (operation.expectedRevision === 0 && stored[local] != null) {
                // Legacy columns are provenance only; they are never used as
                // a local FK or as a cloud primary/foreign-key reference.
                payload[target] = stored[local];
            }
        }
        if (own(stored, 'cloudStatus')) payload.status = stored.cloudStatus;
        if (own(stored, 'cloudSettledAt')) payload.legacy_result_at = stored.cloudSettledAt;
        return { payload, warnings, oddsInvalidated: oddsChanged };
    }

    throw new Error(`Unsupported sync entity type '${operation.entityType}'.`);
};

const getMappedCloudUser = async (db, userId, cloudUserId) => {
    const row = await db.getFirstAsync('SELECT cloudUserId FROM Users WHERE id = ?', [userId]);
    if (!row || row.cloudUserId !== cloudUserId) {
        throw new Error('Local account mapping does not match cloudUserId; history was not acknowledged.');
    }
};

const requireCurrentSession = async (client, cloudUserId) => {
    if (typeof client?.auth?.getSession !== 'function') {
        throw new Error('Supabase authentication is unavailable; sign in before pushing history.');
    }
    const { data, error } = await client.auth.getSession();
    if (error) throw new Error(`Could not verify the active Supabase session: ${error.message}`);
    if (data?.session?.user?.id !== cloudUserId) {
        throw new Error('The active Supabase account changed; select the matching account and retry.');
    }
};

const compareAggregateOrder = (left, right) => {
    const rank = { bet_slip: 0, participant_bet: 1, bet_leg: 2 };
    const leftDelete = left.action === 'delete';
    const rightDelete = right.action === 'delete';
    if (leftDelete !== rightDelete) return leftDelete ? 1 : -1;
    const direction = leftDelete ? -1 : 1;
    return direction * ((rank[left.entityType] ?? 9) - (rank[right.entityType] ?? 9))
        || left.sequence - right.sequence;
};

const buildRequests = (operations, serialized) => {
    const revisionCounts = new Map();
    const baseRevisions = new Map();
    return operations.map((operation, index) => {
        const key = `${operation.entityType}:${operation.entityId}`;
        if (!baseRevisions.has(key)) baseRevisions.set(key, operation.expectedRevision);
        if (baseRevisions.get(key) !== operation.expectedRevision) {
            throw new Error(`Entity ${key} has mixed queued revisions; refusing a partial/reordered aggregate.`);
        }
        const offset = revisionCounts.get(key) ?? 0;
        revisionCounts.set(key, offset + 1);
        return {
            operation_id: operation.id,
            entity_type: operation.entityType,
            entity_id: operation.entityId,
            action: operation.action,
            expected_revision: operation.expectedRevision + offset,
            payload: serialized[index].payload,
        };
    });
};

const validateResponses = (operations, responses) => {
    if (!Array.isArray(responses) || responses.length !== operations.length) {
        throw new Error('Supabase returned an incomplete aggregate acknowledgement.');
    }
    const revisionOffsets = new Map();
    return responses.map((response, index) => {
        const operation = operations[index];
        const key = `${operation.entityType}:${operation.entityId}`;
        const offset = revisionOffsets.get(key) ?? 0;
        revisionOffsets.set(key, offset + 1);
        const expectedRevision = operation.expectedRevision + offset + 1;
        if (response?.operation_id !== operation.id
            || response?.entity_type !== operation.entityType
            || response?.entity_id !== operation.entityId
            || !Number.isSafeInteger(response?.revision)
            || response.revision !== expectedRevision) {
            throw new Error(`Invalid Supabase acknowledgement for operation ${operation.id}.`);
        }
        return {
            operationId: operation.id,
            entityType: operation.entityType,
            entityId: operation.entityId,
            revision: response.revision,
        };
    });
};

const dedupeBlocked = (items, seen) => {
    const unique = [];
    for (const item of items) {
        const key = `${item.operationId ?? item.aggregateId ?? ''}:${item.reason}`;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(item);
    }
    return unique;
};

/**
 * Pushes every currently unacknowledged operation for one bet slip in a single
 * Phase 4 RPC. Retries reuse the exact claimed operation membership and stable
 * IDs, while expected revisions advance deterministically per entity.
 */
export const pushHistory = async (db, client, userId, cloudUserId) => {
    if (!db || userId == null || typeof cloudUserId !== 'string' || !cloudUserId) {
        throw new Error('A local database, local user ID, and cloud user ID are required.');
    }
    if (typeof client?.rpc !== 'function') {
        throw new Error('Supabase is not configured; history remains safely stored in SQLite.');
    }
    if (typeof db.withExclusiveTransactionAsync !== 'function') {
        throw new Error('The SQLite driver must support exclusive transactions for atomic sync.');
    }

    await getMappedCloudUser(db, userId, cloudUserId);
    await requireCurrentSession(client, cloudUserId);
    const result = {
        claimed: 0,
        acknowledged: 0,
        failed: 0,
        conflicts: [],
        blocked: [],
        warnings: [],
        acknowledgedOperationIds: [],
        coalesced: 0,
    };
    const blockedSeen = new Set();
    const warningSeen = new Set();

    while (true) {
        const coalesced = await coalesceUnsentSyncAggregates(db, userId);
        result.coalesced += coalesced.coalesced;
        result.blocked.push(...dedupeBlocked(coalesced.blocked, blockedSeen));

        const claim = await claimPendingSyncAggregate(db, userId, AGGREGATE_LIMIT);
        result.blocked.push(...dedupeBlocked(claim.blocked, blockedSeen));
        if (claim.operations.length === 0) break;
        result.claimed += claim.operations.length;

        const operations = [...claim.operations].sort(compareAggregateOrder);
        let serialized;
        try {
            const oddsInvalidatedByEntity = new Map();
            serialized = operations.map((operation) => {
                const key = `${operation.entityType}:${operation.entityId}`;
                const item = serializeOperation(
                    operation,
                    cloudUserId,
                    oddsInvalidatedByEntity.get(key) ?? false
                );
                oddsInvalidatedByEntity.set(key, item.oddsInvalidated);
                return item;
            });
            const warnings = serialized.flatMap((item) => item.warnings);
            for (const item of warnings) {
                const key = `${item.operationId}:${item.field}`;
                if (!warningSeen.has(key)) {
                    warningSeen.add(key);
                    result.warnings.push(item);
                }
            }
        } catch (error) {
            await failSyncAggregate(
                db, userId, operations.map((operation) => operation.id), asError(error)
            );
            result.failed += operations.length;
            result.blocked.push({
                aggregateId: claim.aggregateId,
                operationIds: operations.map((operation) => operation.id),
                reason: asError(error).message,
            });
            break;
        }

        let requests;
        try {
            requests = buildRequests(operations, serialized);
        } catch (error) {
            await failSyncAggregate(
                db, userId, operations.map((operation) => operation.id), asError(error)
            );
            result.failed += operations.length;
            result.blocked.push({
                aggregateId: claim.aggregateId,
                operationIds: operations.map((operation) => operation.id),
                reason: asError(error).message,
            });
            break;
        }

        try {
            await getMappedCloudUser(db, userId, cloudUserId);
            await requireCurrentSession(client, cloudUserId);
            const { data, error } = await client.rpc('bs_apply_sync_batch', {
                p_operations: requests,
            });
            if (error) throw asError(error);
            const acknowledgements = validateResponses(operations, data);

            await getMappedCloudUser(db, userId, cloudUserId);
            await requireCurrentSession(client, cloudUserId);
            await acknowledgeSyncAggregate(db, userId, cloudUserId, acknowledgements);
            result.acknowledged += acknowledgements.length;
            result.acknowledgedOperationIds.push(...acknowledgements.map((item) => item.operationId));
        } catch (error) {
            await failSyncAggregate(
                db, userId, operations.map((operation) => operation.id), asError(error)
            );
            result.failed += operations.length;
            if (isConflict(error)) {
                result.conflicts.push({
                    aggregateId: claim.aggregateId,
                    operationIds: operations.map((operation) => operation.id),
                    message: asError(error).message,
                });
            } else {
                result.blocked.push({
                    aggregateId: claim.aggregateId,
                    operationIds: operations.map((operation) => operation.id),
                    reason: asError(error).message,
                });
            }
            break;
        }
    }

    return result;
};
