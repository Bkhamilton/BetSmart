import { recreateHistoryInsightViews } from './historyInsightViews.js';

const SYNC_SCHEMA_VERSION = 2;
const PULL_SCHEMA_VERSION = 3;
const SNAPSHOT_SCHEMA_VERSION = 7;

const uuidSql = `lower(
    hex(randomblob(4)) || '-' ||
    hex(randomblob(2)) || '-4' ||
    substr(hex(randomblob(2)), 2) || '-' ||
    substr('89ab', abs(random()) % 4 + 1, 1) ||
    substr(hex(randomblob(2)), 2) || '-' ||
    hex(randomblob(6))
)`;

const entities = [
    {
        table: 'BetSlips',
        type: 'bet_slip',
        alias: 'bs',
        owner: (row) => `${row}.userId`,
        query: 'FROM BetSlips bs',
        fields: ['formatId', 'date', 'odds', 'betAmount', 'winnings', 'bookieId'],
    },
    {
        table: 'ParticipantBets',
        type: 'participant_bet',
        alias: 'pb',
        owner: (row) => `(SELECT userId FROM BetSlips WHERE id = ${row}.betSlipId)`,
        query: 'FROM ParticipantBets pb JOIN BetSlips bs ON bs.id = pb.betSlipId',
        fields: ['betSlipId', 'gameId', 'odds', 'sportSnapshot', 'homeTeamSnapshot', 'awayTeamSnapshot'],
    },
    {
        table: 'Legs',
        type: 'bet_leg',
        alias: 'l',
        owner: (row) => `(SELECT bs.userId FROM BetSlips bs JOIN ParticipantBets pb ON pb.betSlipId = bs.id WHERE pb.id = ${row}.participantBetId)`,
        query: 'FROM Legs l JOIN ParticipantBets pb ON pb.id = l.participantBetId JOIN BetSlips bs ON bs.id = pb.betSlipId',
        fields: [
            'participantBetId',
            'betMarketId',
            'betTypeId',
            'marketTypeSnapshot',
            'marketValueSnapshot',
            'oddsSnapshot',
            'overUnderSnapshot',
            'targetIdSnapshot',
            'targetNameSnapshot',
            'targetTypeSnapshot',
            'bookieIdSnapshot',
            'betTypeSnapshot',
        ],
    },
];

const resultEntities = [
    {
        table: 'BetSlipsResults',
        resultType: 'bet_slip',
        parentTable: 'BetSlips',
        parentAlias: 'bs',
        parentJoin: 'bs.id = r.betSlipId',
    },
    {
        table: 'ParticipantBetsResults',
        resultType: 'participant_bet',
        parentTable: 'ParticipantBets',
        parentAlias: 'pb',
        parentJoin: 'pb.id = r.participantBetId',
        ownerJoin: 'JOIN BetSlips bs ON bs.id = pb.betSlipId',
    },
    {
        table: 'LegsResults',
        resultType: 'bet_leg',
        parentTable: 'Legs',
        parentAlias: 'l',
        parentJoin: 'l.id = r.legId',
        ownerJoin: 'JOIN ParticipantBets pb ON pb.id = l.participantBetId JOIN BetSlips bs ON bs.id = pb.betSlipId',
    },
];

const makePayload = (alias, columns) => {
    const pairs = columns.flatMap((column) => [`'${column}'`, `${alias}.${column}`]);
    return `json_object(${pairs.join(', ')})`;
};
const addAncestry = (entity, row, payload) => {
    let slip;
    let parent;
    if (entity.type === 'bet_slip') {
        slip = `${row}.cloudId`;
        parent = 'NULL';
    } else if (entity.type === 'participant_bet') {
        slip = `(SELECT cloudId FROM BetSlips WHERE id = ${row}.betSlipId)`;
        parent = slip;
    } else {
        slip = `(SELECT bs.cloudId FROM BetSlips bs JOIN ParticipantBets pb ON pb.betSlipId = bs.id WHERE pb.id = ${row}.participantBetId)`;
        parent = `(SELECT cloudId FROM ParticipantBets WHERE id = ${row}.participantBetId)`;
    }
    return `json_set(${payload}, '$.betSlipCloudId', ${slip}, '$.parentCloudId', ${parent})`;
};

const addColumns = async (db, table, columnDefinitions) => {
    const columns = await db.getAllAsync(`PRAGMA table_info(${table})`);
    const existing = new Set(columns.map((column) => column.name));
    for (const [name, definition] of columnDefinitions) {
        if (!existing.has(name)) {
            await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
        }
    }
};

const createEntityTriggers = async (db, entity) => {
    const { table, type, fields } = entity;
    const newOwner = entity.owner('NEW');
    const oldOwner = entity.owner('OLD');
    const oddsColumn = table === 'Legs' ? 'oddsSnapshot' : 'odds';
    const columns = ['cloudId', ...(table === 'BetSlips' ? ['userId'] : []), ...fields];
    const payloadNew = addAncestry(entity, 'NEW', makePayload('NEW', columns));
    const payloadOld = addAncestry(entity, 'OLD', makePayload('OLD', columns));
    const insertBasePayload = table === 'BetSlips'
        ? `json_set(${payloadNew}, '$.cloudId', cloudId, '$.betSlipCloudId', cloudId)`
        : `json_set(${payloadNew}, '$.cloudId', cloudId)`;
    const insertPayload = `json_set(${insertBasePayload}, '$.oddsChanged', 0)`;
    const pendingOddsChange = `EXISTS (
        SELECT 1
        FROM sync_outbox AS queued
        WHERE queued.ownerUserId = ${newOwner}
          AND queued.entityType = '${type}'
          AND queued.entityId = NEW.cloudId
          AND queued.status != 'acked'
          AND json_extract(queued.payloadJson, '$.oddsChanged') = 1
    )`;
    const updatePayload = `json_set(
        ${payloadNew},
        '$.oddsChanged',
        CASE WHEN NEW.${oddsColumn} IS NOT OLD.${oddsColumn}
                   OR ${pendingOddsChange}
             THEN 1 ELSE 0 END
    )`;

    await db.execAsync(`
        ${table === 'BetSlips' ? `
            CREATE TRIGGER IF NOT EXISTS sync_BetSlips_owner_immutable
            BEFORE UPDATE OF userId ON BetSlips
            WHEN NEW.userId IS NOT OLD.userId
            BEGIN
                SELECT RAISE(ABORT, 'Bet slip owner cannot be changed.');
            END;
        ` : ''}
        ${table === 'ParticipantBets' ? `
            CREATE TRIGGER IF NOT EXISTS sync_ParticipantBets_owner_immutable
            BEFORE UPDATE OF betSlipId ON ParticipantBets
            WHEN (SELECT userId FROM BetSlips WHERE id = OLD.betSlipId)
                 IS NOT (SELECT userId FROM BetSlips WHERE id = NEW.betSlipId)
            BEGIN
                SELECT RAISE(ABORT, 'Participant bet cannot be moved between accounts.');
            END;
        ` : ''}
        ${table === 'Legs' ? `
            CREATE TRIGGER IF NOT EXISTS sync_Legs_owner_immutable
            BEFORE UPDATE OF participantBetId ON Legs
            WHEN (SELECT bs.userId FROM BetSlips bs JOIN ParticipantBets pb ON pb.betSlipId = bs.id WHERE pb.id = OLD.participantBetId)
                 IS NOT (SELECT bs.userId FROM BetSlips bs JOIN ParticipantBets pb ON pb.betSlipId = bs.id WHERE pb.id = NEW.participantBetId)
            BEGIN
                SELECT RAISE(ABORT, 'Bet leg cannot be moved between accounts.');
            END;
        ` : ''}
        CREATE TRIGGER IF NOT EXISTS sync_${table}_insert
        AFTER INSERT ON ${table}
        BEGIN
            UPDATE ${table}
            SET cloudId = ${uuidSql}
            WHERE id = NEW.id AND cloudId IS NULL;
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${newOwner}, '${type}', cloudId, 'upsert',
                ${insertPayload}, cloudRevision,
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            FROM ${table}
            WHERE id = NEW.id
              AND NOT EXISTS (SELECT 1 FROM sync_pull_context WHERE userId = ${newOwner});
        END;

        CREATE TRIGGER IF NOT EXISTS sync_${table}_update
        AFTER UPDATE OF ${fields.join(', ')} ON ${table}
        BEGIN
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${newOwner}, '${type}', NEW.cloudId, 'upsert',
                ${updatePayload}, NEW.cloudRevision,
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHERE NOT EXISTS (SELECT 1 FROM sync_pull_context WHERE userId = ${newOwner});
        END;

        CREATE TRIGGER IF NOT EXISTS sync_${table}_delete
        AFTER DELETE ON ${table}
        BEGIN
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${oldOwner}, '${type}', OLD.cloudId, 'delete',
                ${payloadOld}, OLD.cloudRevision,
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHERE NOT EXISTS (SELECT 1 FROM sync_pull_context WHERE userId = ${oldOwner});
        END;
    `);
};

const createResultTriggers = async (db, entity) => {
    const { table, resultType, parentTable, parentAlias, parentJoin, ownerJoin } = entity;
    const joins = ownerJoin || '';
    const owner = 'bs.userId';
    const parentCloudId = `${parentAlias}.cloudId`;
    const expectedRevision = `${parentAlias}.cloudRevision`;
    const resultPayload = (row, deleted) => `json_object(
        'cloudId', ${parentCloudId},
        'betSlipCloudId', bs.cloudId,
        'parentCloudId', ${resultType === 'bet_slip' ? 'NULL' : resultType === 'participant_bet' ? 'bs.cloudId' : 'pb.cloudId'},
        'result', ${deleted ? 'NULL' : `${row}.result`},
        'resultAt', ${row}.timestamp,
        'resultDeleted', ${deleted ? '1' : '0'},
        'legacyResultId', ${row}.id
    )`;

    await db.execAsync(`
        CREATE TRIGGER IF NOT EXISTS sync_${table}_insert
        AFTER INSERT ON ${table}
        BEGIN
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${owner}, '${resultType}', ${parentCloudId}, 'upsert',
                ${resultPayload('NEW', false)}, ${expectedRevision},
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            FROM ${parentTable} ${parentAlias} ${joins}
            WHERE ${parentJoin.split(' = ').map((part) => part.replace(/\br\./g, 'NEW.')).join(' = ')}
              AND NOT EXISTS (SELECT 1 FROM sync_pull_context WHERE userId = ${owner});
        END;

        CREATE TRIGGER IF NOT EXISTS sync_${table}_update
        AFTER UPDATE ON ${table}
        BEGIN
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${owner}, '${resultType}', ${parentCloudId}, 'upsert',
                ${resultPayload('NEW', false)}, ${expectedRevision},
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            FROM ${parentTable} ${parentAlias} ${joins}
            WHERE ${parentJoin.split(' = ').map((part) => part.replace(/\br\./g, 'NEW.')).join(' = ')}
              AND NOT EXISTS (SELECT 1 FROM sync_pull_context WHERE userId = ${owner});
        END;

        CREATE TRIGGER IF NOT EXISTS sync_${table}_delete
        AFTER DELETE ON ${table}
        BEGIN
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${owner}, '${resultType}', ${parentCloudId}, 'upsert',
                ${resultPayload('OLD', true)}, ${expectedRevision},
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            FROM ${parentTable} ${parentAlias} ${joins}
            WHERE ${parentJoin.split(' = ').map((part) => part.replace(/\br\./g, 'OLD.')).join(' = ')}
              AND NOT EXISTS (SELECT 1 FROM sync_pull_context WHERE userId = ${owner});
        END;
    `);
};

const seedExistingRows = async (db, entity) => {
    const owner = entity.owner(entity.alias);
    const payload = `json_set(
        ${addAncestry(entity, entity.alias, makePayload(entity.alias, ['cloudId', ...entity.fields]))},
        '$.oddsChanged', 0
    )`;
    await db.execAsync(`
        INSERT INTO sync_outbox
            (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
        SELECT ${uuidSql}, ${owner}, '${entity.type}', ${entity.alias}.cloudId, 'upsert',
            ${payload}, ${entity.alias}.cloudRevision,
            strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        ${entity.query}
        WHERE ${entity.alias}.cloudId IS NOT NULL;
    `);
};

const backfillPendingOddsIntent = async (db) => {
    const rows = await db.getAllAsync(`
        SELECT sequence, id, ownerUserId, entityType, entityId, action,
               payloadJson, expectedRevision, attempts, status
        FROM sync_outbox
        ORDER BY sequence
    `);
    const latestOdds = new Map();
    const pendingInvalidation = new Map();

    for (const row of rows) {
        const sourceField = row.entityType === 'bet_leg'
            ? 'oddsSnapshot'
            : ['bet_slip', 'participant_bet'].includes(row.entityType) ? 'odds' : null;
        if (!sourceField || row.action !== 'upsert') continue;

        let payload;
        try {
            payload = JSON.parse(row.payloadJson);
        } catch (error) {
            throw new Error(`Cannot migrate odds intent for outbox operation ${row.id}: ${error.message}`);
        }
        if (!Object.prototype.hasOwnProperty.call(payload, sourceField)) continue;
        // Result writes share the parent entity ID but do not contain the
        // placement odds source field, so only entity snapshots reach here.
        const key = `${row.ownerUserId}:${row.entityType}:${row.entityId}`;
        const previous = latestOdds.get(key);
        const mayUpdate = row.status === 'pending' && row.attempts === 0;
        let changed = payload.oddsChanged === true || payload.oddsChanged === 1;
        let shouldWrite = Object.prototype.hasOwnProperty.call(payload, 'oddsChanged');

        if (!shouldWrite && mayUpdate) {
            if (pendingInvalidation.get(key) === true) {
                changed = true;
                shouldWrite = true;
            } else if (previous?.known) {
                changed = JSON.stringify(payload[sourceField]) !== JSON.stringify(previous.value);
                shouldWrite = true;
            } else if (row.expectedRevision === 0
                || (Object.prototype.hasOwnProperty.call(payload, 'cloudDecimalOdds')
                    && payload.cloudDecimalOdds == null)) {
                // A new local record has no remote decimal to preserve. For an
                // old synced row with a non-null remote decimal and no prior
                // odds snapshot, leave intent unknown so push can block safely.
                changed = false;
                shouldWrite = true;
            }
        }

        if (shouldWrite && mayUpdate
            && !Object.prototype.hasOwnProperty.call(payload, 'oddsChanged')) {
            payload.oddsChanged = changed ? 1 : 0;
            await db.runAsync(`
                UPDATE sync_outbox
                SET payloadJson = ?
                WHERE sequence = ? AND ownerUserId = ? AND status = 'pending' AND attempts = 0
            `, [JSON.stringify(payload), row.sequence, row.ownerUserId]);
        }

        if (row.status !== 'acked' && changed) pendingInvalidation.set(key, true);
        else if (row.status === 'acked') pendingInvalidation.set(key, false);
        latestOdds.set(key, { known: true, value: payload[sourceField] });
    }
};

export const migrateSyncSchema = async (db) => {
    const versionRow = await db.getFirstAsync('PRAGMA user_version');
    if ((versionRow?.user_version ?? 0) < SYNC_SCHEMA_VERSION) {
        await db.withTransactionAsync(async () => {
            for (const entity of entities) {
                const extraColumns = entity.table === 'ParticipantBets'
                    ? [
                        ['sportSnapshot', 'TEXT'],
                        ['homeTeamSnapshot', 'TEXT'],
                        ['awayTeamSnapshot', 'TEXT'],
                    ]
                    : entity.table === 'Legs'
                        ? [
                            ['marketTypeSnapshot', 'TEXT'],
                            ['marketValueSnapshot', 'TEXT'],
                            ['oddsSnapshot', 'TEXT'],
                            ['overUnderSnapshot', 'TEXT'],
                            ['targetIdSnapshot', 'INTEGER'],
                            ['targetNameSnapshot', 'TEXT'],
                            ['targetTypeSnapshot', 'TEXT'],
                            ['bookieIdSnapshot', 'INTEGER'],
                            ['betTypeSnapshot', 'TEXT'],
                        ]
                        : [];
                await addColumns(db, entity.table, [
                    ['cloudId', 'TEXT'],
                    ['cloudRevision', 'INTEGER NOT NULL DEFAULT 0'],
                    ...extraColumns,
                ]);
            }

            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS sync_outbox (
                    sequence INTEGER PRIMARY KEY AUTOINCREMENT,
                    id TEXT NOT NULL UNIQUE,
                    ownerUserId INTEGER NOT NULL REFERENCES Users(id),
                    entityType TEXT NOT NULL,
                    entityId TEXT NOT NULL,
                    action TEXT NOT NULL CHECK(action IN ('upsert', 'delete')),
                    payloadJson TEXT NOT NULL,
                    expectedRevision INTEGER NOT NULL DEFAULT 0,
                    createdAt TEXT NOT NULL,
                    attempts INTEGER NOT NULL DEFAULT 0,
                    lastAttemptAt TEXT,
                    nextAttemptAt TEXT,
                    lastError TEXT,
                    status TEXT NOT NULL DEFAULT 'pending'
                        CHECK(status IN ('pending', 'in_flight', 'failed', 'acked')),
                    acknowledgedAt TEXT
                );
                CREATE INDEX IF NOT EXISTS idx_sync_outbox_due
                    ON sync_outbox(ownerUserId, status, nextAttemptAt, createdAt);
                CREATE INDEX IF NOT EXISTS idx_sync_outbox_entity
                    ON sync_outbox(ownerUserId, entityType, entityId);
                CREATE TABLE IF NOT EXISTS user_sync_state (
                    userId INTEGER PRIMARY KEY REFERENCES Users(id),
                    pullCursor TEXT,
                    lastPulledAt TEXT,
                    lastPushedAt TEXT,
                    updatedAt TEXT NOT NULL
                );
            `);

            for (const entity of entities) {
                await db.execAsync(`
                    UPDATE ${entity.table}
                    SET cloudId = ${uuidSql}
                    WHERE cloudId IS NULL OR cloudId = '';
                `);
                await db.execAsync(`
                    CREATE UNIQUE INDEX IF NOT EXISTS idx_${entity.table}_cloud_id
                        ON ${entity.table}(cloudId)
                        WHERE cloudId IS NOT NULL;
                `);
                await seedExistingRows(db, entity);
                await createEntityTriggers(db, entity);
            }

            for (const entity of resultEntities) {
                await createResultTriggers(db, entity);
            }

            await db.execAsync(`PRAGMA user_version = ${SYNC_SCHEMA_VERSION}`);
        });
    } else {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS sync_outbox (
                sequence INTEGER PRIMARY KEY AUTOINCREMENT,
                id TEXT NOT NULL UNIQUE,
                ownerUserId INTEGER NOT NULL REFERENCES Users(id),
                entityType TEXT NOT NULL,
                entityId TEXT NOT NULL,
                action TEXT NOT NULL CHECK(action IN ('upsert', 'delete')),
                payloadJson TEXT NOT NULL,
                expectedRevision INTEGER NOT NULL DEFAULT 0,
                createdAt TEXT NOT NULL,
                attempts INTEGER NOT NULL DEFAULT 0,
                lastAttemptAt TEXT,
                nextAttemptAt TEXT,
                lastError TEXT,
                status TEXT NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending', 'in_flight', 'failed', 'acked')),
                acknowledgedAt TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_sync_outbox_due
                ON sync_outbox(ownerUserId, status, nextAttemptAt, createdAt);
            CREATE INDEX IF NOT EXISTS idx_sync_outbox_entity
                ON sync_outbox(ownerUserId, entityType, entityId);
            CREATE TABLE IF NOT EXISTS user_sync_state (
                userId INTEGER PRIMARY KEY REFERENCES Users(id),
                pullCursor TEXT,
                lastPulledAt TEXT,
                lastPushedAt TEXT,
                updatedAt TEXT NOT NULL
            );
        `);
        for (const entity of entities) await createEntityTriggers(db, entity);
        for (const entity of resultEntities) await createResultTriggers(db, entity);
    }

    const pullVersionRow = await db.getFirstAsync('PRAGMA user_version');
    if ((pullVersionRow?.user_version ?? 0) < PULL_SCHEMA_VERSION) {
        // SQLite cannot relax NOT NULL constraints in place. Rebuild only the
        // three history tables, retaining all local IDs/data and their existing
        // integer references. New cloud references are stored separately.
        await db.execAsync('PRAGMA foreign_keys = OFF');
        try {
            const existingViews = await db.getAllAsync(`
                SELECT name, sql
                FROM sqlite_master
                WHERE type = 'view' AND sql IS NOT NULL
            `);
            await db.withTransactionAsync(async () => {
                for (const view of existingViews) {
                    const quotedName = `"${view.name.replace(/"/g, '""')}"`;
                    await db.execAsync(`DROP VIEW IF EXISTS ${quotedName}`);
                }
                await db.execAsync(`
                    CREATE TABLE BetSlips_pull_v3 (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        formatId INTEGER,
                        date TEXT NOT NULL,
                        odds TEXT,
                        betAmount REAL NOT NULL,
                        winnings REAL,
                        userId INTEGER NOT NULL,
                        bookieId INTEGER,
                        cloudId TEXT,
                        cloudRevision INTEGER NOT NULL DEFAULT 0,
                        cloudStatus TEXT,
                        cloudCurrencyCode TEXT,
                        cloudNotes TEXT,
                        cloudDecimalOdds TEXT,
                        cloudBookieId TEXT,
                        bookieNameSnapshot TEXT,
                        formatNameSnapshot TEXT,
                        cloudSettledAt TEXT,
                        cloudStake TEXT,
                        cloudPayout TEXT,
                        cloudLegacyFormatId TEXT,
                        cloudLegacyBookieId TEXT,
                        cloudCreatedAt TEXT,
                        cloudUpdatedAt TEXT,
                        FOREIGN KEY (formatId) REFERENCES BetFormats(id),
                        FOREIGN KEY (userId) REFERENCES Users(id),
                        FOREIGN KEY (bookieId) REFERENCES Bookies(Id),
                        UNIQUE (formatId, date, odds, betAmount, winnings, userId, bookieId)
                    );
                    INSERT INTO BetSlips_pull_v3
                    (id, formatId, date, odds, betAmount, winnings, userId, bookieId, cloudId, cloudRevision)
                    SELECT id, formatId, date, odds, betAmount, winnings, userId, bookieId, cloudId, cloudRevision
                    FROM BetSlips;

                    CREATE TABLE ParticipantBets_pull_v3 (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        betSlipId INTEGER NOT NULL,
                        gameId TEXT,
                        odds TEXT,
                        cloudId TEXT,
                        cloudRevision INTEGER NOT NULL DEFAULT 0,
                        sportSnapshot TEXT,
                        homeTeamSnapshot TEXT,
                        awayTeamSnapshot TEXT,
                        cloudDecimalOdds TEXT,
                        cloudStatus TEXT,
                        cloudSettledAt TEXT,
                        cloudGameReferenceId TEXT,
                        gameDateSnapshot TEXT,
                        leagueSnapshot TEXT,
                        homeTeamAbbreviationSnapshot TEXT,
                        awayTeamAbbreviationSnapshot TEXT,
                        cloudCreatedAt TEXT,
                        cloudUpdatedAt TEXT,
                        FOREIGN KEY (betSlipId) REFERENCES BetSlips(id),
                        UNIQUE (betSlipId, gameId, odds)
                    );
                    INSERT INTO ParticipantBets_pull_v3
                    (id, betSlipId, gameId, odds, cloudId, cloudRevision,
                     sportSnapshot, homeTeamSnapshot, awayTeamSnapshot)
                    SELECT id, betSlipId, gameId, odds, cloudId, cloudRevision,
                           sportSnapshot, homeTeamSnapshot, awayTeamSnapshot
                    FROM ParticipantBets;

                    CREATE TABLE Legs_pull_v3 (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        participantBetId INTEGER NOT NULL,
                        betMarketId INTEGER,
                        betTypeId INTEGER,
                        cloudId TEXT,
                        cloudRevision INTEGER NOT NULL DEFAULT 0,
                        marketTypeSnapshot TEXT,
                        marketValueSnapshot TEXT,
                        oddsSnapshot TEXT,
                        overUnderSnapshot TEXT,
                        targetIdSnapshot INTEGER,
                        targetNameSnapshot TEXT,
                        targetTypeSnapshot TEXT,
                        bookieIdSnapshot INTEGER,
                        betTypeSnapshot TEXT,
                        cloudMarketReferenceId TEXT,
                        cloudSelectionDescription TEXT,
                        cloudOddsAtPlacement TEXT,
                        cloudStatus TEXT,
                        cloudSettledAt TEXT,
                        cloudLegacyMarketId TEXT,
                        cloudLegacyBetTypeId TEXT,
                        cloudLegacyTargetId TEXT,
                        cloudLegacyBookieReferenceId TEXT,
                        cloudCreatedAt TEXT,
                        cloudUpdatedAt TEXT,
                        FOREIGN KEY (participantBetId) REFERENCES ParticipantBets(id),
                        FOREIGN KEY (betMarketId) REFERENCES BetMarkets(id),
                        FOREIGN KEY (betTypeId) REFERENCES BetTypes(id),
                        UNIQUE (participantBetId, betMarketId)
                    );
                    INSERT INTO Legs_pull_v3
                    (id, participantBetId, betMarketId, betTypeId, cloudId, cloudRevision,
                     marketTypeSnapshot, marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
                     targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot, bookieIdSnapshot,
                     betTypeSnapshot)
                    SELECT id, participantBetId, betMarketId, betTypeId, cloudId, cloudRevision,
                           marketTypeSnapshot, marketValueSnapshot, oddsSnapshot, overUnderSnapshot,
                           targetIdSnapshot, targetNameSnapshot, targetTypeSnapshot, bookieIdSnapshot,
                           betTypeSnapshot
                    FROM Legs;

                    DROP TRIGGER IF EXISTS sync_BetSlips_insert;
                    DROP TRIGGER IF EXISTS sync_BetSlips_update;
                    DROP TRIGGER IF EXISTS sync_BetSlips_delete;
                    DROP TRIGGER IF EXISTS sync_ParticipantBets_insert;
                    DROP TRIGGER IF EXISTS sync_ParticipantBets_update;
                    DROP TRIGGER IF EXISTS sync_ParticipantBets_delete;
                    DROP TRIGGER IF EXISTS sync_Legs_insert;
                    DROP TRIGGER IF EXISTS sync_Legs_update;
                    DROP TRIGGER IF EXISTS sync_Legs_delete;
                    DROP TRIGGER IF EXISTS sync_BetSlips_owner_immutable;
                    DROP TRIGGER IF EXISTS sync_ParticipantBets_owner_immutable;
                    DROP TRIGGER IF EXISTS sync_Legs_owner_immutable;
                    DROP TRIGGER IF EXISTS sync_BetSlipsResults_insert;
                    DROP TRIGGER IF EXISTS sync_BetSlipsResults_update;
                    DROP TRIGGER IF EXISTS sync_BetSlipsResults_delete;
                    DROP TRIGGER IF EXISTS sync_ParticipantBetsResults_insert;
                    DROP TRIGGER IF EXISTS sync_ParticipantBetsResults_update;
                    DROP TRIGGER IF EXISTS sync_ParticipantBetsResults_delete;
                    DROP TRIGGER IF EXISTS sync_LegsResults_insert;
                    DROP TRIGGER IF EXISTS sync_LegsResults_update;
                    DROP TRIGGER IF EXISTS sync_LegsResults_delete;

                    DROP TABLE Legs;
                    DROP TABLE ParticipantBets;
                    DROP TABLE BetSlips;
                    ALTER TABLE BetSlips_pull_v3 RENAME TO BetSlips;
                    ALTER TABLE ParticipantBets_pull_v3 RENAME TO ParticipantBets;
                    ALTER TABLE Legs_pull_v3 RENAME TO Legs;

                    CREATE TABLE IF NOT EXISTS sync_pull_context (
                        userId INTEGER PRIMARY KEY REFERENCES Users(id)
                    );
                    CREATE TABLE IF NOT EXISTS sync_remote_tombstones (
                        ownerUserId INTEGER NOT NULL REFERENCES Users(id),
                        entityType TEXT NOT NULL,
                        entityId TEXT NOT NULL,
                        revision INTEGER NOT NULL,
                        deletedAt TEXT NOT NULL,
                        PRIMARY KEY (ownerUserId, entityType, entityId)
                    );
                    CREATE INDEX IF NOT EXISTS idx_sync_remote_tombstones_owner
                        ON sync_remote_tombstones(ownerUserId, entityType);
                `);
                await addColumns(db, 'BetSlips', [
                    ['cloudStatus', 'TEXT'],
                    ['cloudCurrencyCode', 'TEXT'],
                    ['cloudNotes', 'TEXT'],
                    ['cloudDecimalOdds', 'TEXT'],
                    ['cloudBookieId', 'TEXT'],
                    ['bookieNameSnapshot', 'TEXT'],
                    ['formatNameSnapshot', 'TEXT'],
                    ['cloudSettledAt', 'TEXT'],
                    ['cloudStake', 'TEXT'],
                    ['cloudPayout', 'TEXT'],
                    ['cloudLegacyFormatId', 'TEXT'],
                    ['cloudLegacyBookieId', 'TEXT'],
                    ['cloudCreatedAt', 'TEXT'],
                    ['cloudUpdatedAt', 'TEXT'],
                ]);
                await addColumns(db, 'ParticipantBets', [
                    ['cloudDecimalOdds', 'TEXT'],
                    ['cloudStatus', 'TEXT'],
                    ['cloudSettledAt', 'TEXT'],
                    ['cloudGameReferenceId', 'TEXT'],
                    ['gameDateSnapshot', 'TEXT'],
                    ['leagueSnapshot', 'TEXT'],
                    ['homeTeamAbbreviationSnapshot', 'TEXT'],
                    ['awayTeamAbbreviationSnapshot', 'TEXT'],
                    ['cloudCreatedAt', 'TEXT'],
                    ['cloudUpdatedAt', 'TEXT'],
                ]);
                await addColumns(db, 'Legs', [
                    ['cloudMarketReferenceId', 'TEXT'],
                    ['cloudSelectionDescription', 'TEXT'],
                    ['cloudOddsAtPlacement', 'TEXT'],
                    ['cloudStatus', 'TEXT'],
                    ['cloudSettledAt', 'TEXT'],
                    ['cloudLegacyMarketId', 'TEXT'],
                    ['cloudLegacyBetTypeId', 'TEXT'],
                    ['cloudLegacyTargetId', 'TEXT'],
                    ['cloudLegacyBookieReferenceId', 'TEXT'],
                    ['cloudCreatedAt', 'TEXT'],
                    ['cloudUpdatedAt', 'TEXT'],
                ]);

                for (const entity of entities) {
                    await db.execAsync(`CREATE UNIQUE INDEX IF NOT EXISTS idx_${entity.table}_cloud_id ON ${entity.table}(cloudId) WHERE cloudId IS NOT NULL`);
                }
                for (const entity of entities) await createEntityTriggers(db, entity);
                for (const entity of resultEntities) await createResultTriggers(db, entity);
                for (const view of existingViews) await db.execAsync(view.sql);
                await db.execAsync(`PRAGMA user_version = ${PULL_SCHEMA_VERSION}`);
            });
        } finally {
            await db.execAsync('PRAGMA foreign_keys = ON');
        }
    }

    const snapshotVersionRow = await db.getFirstAsync('PRAGMA user_version');
    if ((snapshotVersionRow?.user_version ?? 0) < SNAPSHOT_SCHEMA_VERSION) {
        await db.withTransactionAsync(async () => {
            const snapshotFields = {
                BetSlips: [
                    'formatNameSnapshot', 'bookieNameSnapshot', 'cloudCurrencyCode',
                    'cloudStake', 'cloudPayout', 'cloudLegacyFormatId', 'cloudLegacyBookieId',
                    'cloudDecimalOdds', 'cloudBookieId', 'cloudNotes',
                ],
                ParticipantBets: [
                    'gameDateSnapshot', 'leagueSnapshot',
                    'homeTeamAbbreviationSnapshot', 'awayTeamAbbreviationSnapshot',
                    'cloudGameReferenceId', 'cloudDecimalOdds',
                ],
                Legs: [
                    'cloudMarketReferenceId', 'cloudSelectionDescription', 'cloudOddsAtPlacement',
                    'cloudLineAtPlacement',
                    'cloudLegacyMarketId', 'cloudLegacyBetTypeId', 'cloudLegacyTargetId',
                    'cloudLegacyBookieReferenceId',
                ],
            };
            // Pull owns this independent exact-text copy of the remote line.
            // Add it only after the history-table rebuild so older table
            // rebuilds cannot drop it, and before recreating capture triggers.
            await addColumns(db, 'Legs', [['cloudLineAtPlacement', 'TEXT']]);
            for (const entity of entities) {
                await db.execAsync(`
                    DROP TRIGGER IF EXISTS sync_${entity.table}_insert;
                    DROP TRIGGER IF EXISTS sync_${entity.table}_update;
                    DROP TRIGGER IF EXISTS sync_${entity.table}_delete;
                `);
                await createEntityTriggers(db, {
                    ...entity,
                    fields: [...entity.fields, ...(snapshotFields[entity.table] || [])],
                });
            }
            for (const entity of resultEntities) {
                await db.execAsync(`
                    DROP TRIGGER IF EXISTS sync_${entity.table}_insert;
                    DROP TRIGGER IF EXISTS sync_${entity.table}_update;
                    DROP TRIGGER IF EXISTS sync_${entity.table}_delete;
                `);
                await createResultTriggers(db, entity);
            }
            await db.execAsync(`
                UPDATE sync_outbox
                SET payloadJson = json_set(payloadJson, '$.betSlipCloudId', entityId, '$.parentCloudId', NULL)
                WHERE entityType = 'bet_slip' AND status = 'pending' AND attempts = 0
                  AND json_extract(payloadJson, '$.betSlipCloudId') IS NULL;

                UPDATE sync_outbox
                SET payloadJson = json_set(payloadJson,
                    '$.betSlipCloudId', COALESCE(
                        (SELECT bs.cloudId FROM ParticipantBets pb JOIN BetSlips bs ON bs.id = pb.betSlipId
                         WHERE pb.cloudId = sync_outbox.entityId AND bs.userId = sync_outbox.ownerUserId),
                        (SELECT bs.cloudId FROM BetSlips bs
                         WHERE bs.id = json_extract(sync_outbox.payloadJson, '$.betSlipId')
                           AND bs.userId = sync_outbox.ownerUserId)
                    ),
                    '$.parentCloudId', COALESCE(
                        (SELECT bs.cloudId FROM ParticipantBets pb JOIN BetSlips bs ON bs.id = pb.betSlipId
                         WHERE pb.cloudId = sync_outbox.entityId AND bs.userId = sync_outbox.ownerUserId),
                        (SELECT bs.cloudId FROM BetSlips bs
                         WHERE bs.id = json_extract(sync_outbox.payloadJson, '$.betSlipId')
                           AND bs.userId = sync_outbox.ownerUserId)
                    )
                )
                WHERE entityType = 'participant_bet' AND status = 'pending' AND attempts = 0
                  AND json_extract(payloadJson, '$.betSlipCloudId') IS NULL;

                UPDATE sync_outbox
                SET payloadJson = json_set(payloadJson,
                    '$.betSlipCloudId', COALESCE(
                        (SELECT bs.cloudId FROM Legs l JOIN ParticipantBets pb ON pb.id = l.participantBetId
                         JOIN BetSlips bs ON bs.id = pb.betSlipId
                         WHERE l.cloudId = sync_outbox.entityId AND bs.userId = sync_outbox.ownerUserId),
                        (SELECT bs.cloudId FROM ParticipantBets pb JOIN BetSlips bs ON bs.id = pb.betSlipId
                         WHERE pb.id = json_extract(sync_outbox.payloadJson, '$.participantBetId')
                           AND bs.userId = sync_outbox.ownerUserId)
                    ),
                    '$.parentCloudId', COALESCE(
                        (SELECT pb.cloudId FROM Legs l JOIN ParticipantBets pb ON pb.id = l.participantBetId
                         JOIN BetSlips bs ON bs.id = pb.betSlipId
                         WHERE l.cloudId = sync_outbox.entityId AND bs.userId = sync_outbox.ownerUserId),
                        (SELECT pb.cloudId FROM ParticipantBets pb JOIN BetSlips bs ON bs.id = pb.betSlipId
                         WHERE pb.id = json_extract(sync_outbox.payloadJson, '$.participantBetId')
                           AND bs.userId = sync_outbox.ownerUserId)
                    )
                )
                WHERE entityType = 'bet_leg' AND status = 'pending' AND attempts = 0
                  AND json_extract(payloadJson, '$.betSlipCloudId') IS NULL;
            `);
            await backfillPendingOddsIntent(db);
            await recreateHistoryInsightViews(db);
            await db.execAsync(`PRAGMA user_version = ${SNAPSHOT_SCHEMA_VERSION}`);
        });
    }
};
