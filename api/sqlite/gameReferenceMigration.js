const HISTORY_SCHEMA_VERSION = 5;

const quoteIdentifier = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;

const getGameIdForeignKey = async (db, tableName) => {
    const rows = await db.getAllAsync(`PRAGMA foreign_key_list(${quoteIdentifier(tableName)})`);
    const groups = new Map();
    for (const row of rows) {
        const group = groups.get(row.id) || [];
        group.push(row);
        groups.set(row.id, group);
    }
    return [...groups.values()].find((group) => group.length === 1
        && String(group[0].table).toLowerCase() === 'games'
        && String(group[0].from).toLowerCase() === 'gameid'
        && String(group[0].to).toLowerCase() === 'gameid') || null;
};

const replaceTableName = (createSql, oldName, newName) => {
    const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tableToken = `(?:"${escaped}"|\\[${escaped}\\]|\\x60${escaped}\\x60|${escaped})`;
    const header = new RegExp(
        `^(\\s*CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?)(?:${tableToken})(?=\\s*\\()`,
        'i'
    );
    if (!header.test(createSql)) {
        throw new Error(`Could not safely parse the existing ${oldName} table definition.`);
    }
    return createSql.replace(header, `$1${quoteIdentifier(newName)}`);
};

const removeInvalidGameIdForeignKey = (createSql, tableName) => {
    const token = (name) => `(?:"${name}"|\\[${name}\\]|\\x60${name}\\x60|${name})`;
    const invalidReference = new RegExp(
        `,\\s*(?:CONSTRAINT\\s+(?:${token('[A-Za-z0-9_]+' )})\\s+)?` +
        `FOREIGN\\s+KEY\\s*\\(\\s*${token('gameId')}\\s*\\)\\s*` +
        `REFERENCES\\s*${token('Games')}\\s*\\(\\s*${token('gameId')}\\s*\\)`,
        'ig'
    );
    const matches = createSql.match(invalidReference) || [];
    if (matches.length !== 1) {
        throw new Error(`Could not uniquely locate the invalid Games(gameId) foreign key in ${tableName}. No migration changes were committed.`);
    }
    return createSql.replace(invalidReference, '');
};

const tableColumns = async (db, tableName) => {
    const rows = await db.getAllAsync(`PRAGMA table_info(${quoteIdentifier(tableName)})`);
    if (rows.length === 0) throw new Error(`The ${tableName} table has no readable columns.`);
    return rows.map((row) => row.name);
};

const getSchemaObjects = async (db) => {
    const views = await db.getAllAsync(`
        SELECT name, sql
        FROM sqlite_master
        WHERE type = 'view' AND sql IS NOT NULL
    `);
    const indexesByTable = new Map();
    const triggersByTable = new Map();
    for (const row of await db.getAllAsync(`
        SELECT name, tbl_name, sql, type
        FROM sqlite_master
        WHERE type IN ('index', 'trigger') AND sql IS NOT NULL
    `)) {
        const map = row.type === 'index' ? indexesByTable : triggersByTable;
        const objects = map.get(row.tbl_name) || [];
        objects.push(row);
        map.set(row.tbl_name, objects);
    }
    const viewTriggers = views.flatMap((view) => triggersByTable.get(view.name) || []);
    return { views, indexesByTable, triggersByTable, viewTriggers };
};

const rebuildTableWithoutBadReference = async (db, tableName, schemaObjects) => {
    const source = await db.getFirstAsync(
        "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?",
        [tableName]
    );
    if (!source?.sql) throw new Error(`Cannot migrate ${tableName}: its original table definition is unavailable.`);

    const temporaryName = `${tableName}_game_reference_v5`;
    const temporaryTable = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE name = ?",
        [temporaryName]
    );
    if (temporaryTable) {
        throw new Error(`Cannot migrate ${tableName}: temporary table ${temporaryName} already exists. Inspect the database before retrying.`);
    }

    const columns = await tableColumns(db, tableName);
    const quotedColumns = columns.map(quoteIdentifier).join(', ');
    const createSql = removeInvalidGameIdForeignKey(
        replaceTableName(source.sql, tableName, temporaryName),
        tableName
    );
    const sequence = await db.getFirstAsync(
        'SELECT seq FROM sqlite_sequence WHERE name = ?',
        [tableName]
    );

    await db.execAsync(createSql);
    await db.execAsync(`
        INSERT INTO ${quoteIdentifier(temporaryName)} (${quotedColumns})
        SELECT ${quotedColumns} FROM ${quoteIdentifier(tableName)}
    `);
    await db.execAsync(`DROP TABLE ${quoteIdentifier(tableName)}`);
    await db.execAsync(`ALTER TABLE ${quoteIdentifier(temporaryName)} RENAME TO ${quoteIdentifier(tableName)}`);

    const maxId = await db.getFirstAsync(
        `SELECT MAX(${quoteIdentifier(columns.find((column) => column.toLowerCase() === 'id') || 'rowid')}) AS maxId
         FROM ${quoteIdentifier(tableName)}`
    );
    const preservedSequence = Math.max(Number(sequence?.seq || 0), Number(maxId?.maxId || 0));
    if (preservedSequence > 0) {
        await db.runAsync('DELETE FROM sqlite_sequence WHERE name = ?', [tableName]);
        await db.runAsync(
            'INSERT INTO sqlite_sequence (name, seq) VALUES (?, ?)',
            [tableName, preservedSequence]
        );
    }

    for (const index of schemaObjects.indexesByTable.get(tableName) || []) {
        await db.execAsync(index.sql);
    }
    for (const trigger of schemaObjects.triggersByTable.get(tableName) || []) {
        await db.execAsync(trigger.sql);
    }
};

/**
 * Remove single-column foreign keys to Games(gameId), which is not a UNIQUE
 * parent key. Run after createTables/migrateSyncSchema. The global SQLite
 * user_version is shared with sync migrations, so completion is determined
 * from the actual foreign-key schema rather than a version-number shortcut.
 * Game IDs remain unchanged; writes no longer pretend that one provider
 * gameId identifies exactly one local Games row.
 */
export const migrateGameReferenceConstraints = async (db) => {
    if (!db || typeof db.getFirstAsync !== 'function'
        || typeof db.getAllAsync !== 'function'
        || typeof db.runAsync !== 'function'
        || typeof db.execAsync !== 'function'
        || typeof db.withTransactionAsync !== 'function') {
        throw new Error('A transaction-capable SQLite database is required for the game-reference migration.');
    }

    const versionRow = await db.getFirstAsync('PRAGMA user_version');
    const version = Number(versionRow?.user_version ?? 0);
    if (version < HISTORY_SCHEMA_VERSION) {
        throw new Error('Run createTables and sync schema migrations before the game-reference migration.');
    }
    const foreignKeysRow = await db.getFirstAsync('PRAGMA foreign_keys');
    const foreignKeysWereEnabled = Number(foreignKeysRow?.foreign_keys ?? 0) === 1;
    const schemaObjects = await getSchemaObjects(db);
    const tables = await db.getAllAsync(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
    `);
    const changedTables = [];
    for (const table of tables) {
        if (table.name.toLowerCase() === 'games') continue;
        const invalidReference = await getGameIdForeignKey(db, table.name);
        if (invalidReference) changedTables.push(table.name);
    }
    if (changedTables.length === 0) {
        return { applied: false, changedTables: [] };
    }

    await db.execAsync('PRAGMA foreign_keys = OFF');
    try {
        const foreignKeysNow = await db.getFirstAsync('PRAGMA foreign_keys');
        if (foreignKeysWereEnabled && Number(foreignKeysNow?.foreign_keys ?? 1) !== 0) {
            throw new Error('SQLite did not disable foreign-key checks before the table rebuild; no migration changes were applied.');
        }
        await db.withTransactionAsync(async () => {
            for (const view of schemaObjects.views) {
                await db.execAsync(`DROP VIEW IF EXISTS ${quoteIdentifier(view.name)}`);
            }
            for (const tableName of changedTables) {
                await rebuildTableWithoutBadReference(db, tableName, schemaObjects);
            }
            for (const view of schemaObjects.views) await db.execAsync(view.sql);
            for (const trigger of schemaObjects.viewTriggers) await db.execAsync(trigger.sql);
        });
    } finally {
        if (foreignKeysWereEnabled) await db.execAsync('PRAGMA foreign_keys = ON');
    }

    return { applied: true, changedTables };
};
