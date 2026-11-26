const SYNC_SCHEMA_VERSION = 2;

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
    const columns = ['cloudId', ...(table === 'BetSlips' ? ['userId'] : []), ...fields];
    const payloadNew = makePayload('NEW', columns);
    const payloadOld = makePayload('OLD', columns);

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
                json_set(${payloadNew}, '$.cloudId', cloudId), cloudRevision,
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            FROM ${table} WHERE id = NEW.id;
        END;

        CREATE TRIGGER IF NOT EXISTS sync_${table}_update
        AFTER UPDATE OF ${fields.join(', ')} ON ${table}
        BEGIN
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${newOwner}, '${type}', NEW.cloudId, 'upsert',
                ${payloadNew}, NEW.cloudRevision,
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
        END;

        CREATE TRIGGER IF NOT EXISTS sync_${table}_delete
        AFTER DELETE ON ${table}
        BEGIN
            INSERT INTO sync_outbox
                (id, ownerUserId, entityType, entityId, action, payloadJson, expectedRevision, createdAt)
            SELECT ${uuidSql}, ${oldOwner}, '${type}', OLD.cloudId, 'delete',
                ${payloadOld}, OLD.cloudRevision,
                strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
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
            WHERE ${parentJoin.split(' = ').map((part) => part.replace(/\br\./g, 'NEW.')).join(' = ')};
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
            WHERE ${parentJoin.split(' = ').map((part) => part.replace(/\br\./g, 'NEW.')).join(' = ')};
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
            WHERE ${parentJoin.split(' = ').map((part) => part.replace(/\br\./g, 'OLD.')).join(' = ')};
        END;
    `);
};

const seedExistingRows = async (db, entity) => {
    const owner = entity.owner(entity.alias);
    const payload = makePayload(entity.alias, ['cloudId', ...entity.fields]);
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
};
