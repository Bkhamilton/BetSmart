const AUTH_SCHEMA_VERSION = 1;

const userTableSql = `
    CREATE TABLE Users_auth_v1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cloudUserId TEXT,
        name TEXT,
        email TEXT,
        username TEXT,
        lastSyncedAt TEXT
    );
`;

export const migrateAuthSchema = async (db) => {
    const versionRow = await db.getFirstAsync('PRAGMA user_version');
    if ((versionRow?.user_version ?? 0) >= AUTH_SCHEMA_VERSION) return;

    const columns = await db.getAllAsync('PRAGMA table_info(Users)');
    const columnNames = new Set(columns.map((column) => column.name));
    const needsRebuild = !columnNames.has('cloudUserId') || columnNames.has('password');

    if (needsRebuild) {
        const source = (columnName) => columnNames.has(columnName) ? columnName : 'NULL';

        await db.execAsync('PRAGMA foreign_keys = OFF');
        try {
            await db.withTransactionAsync(async () => {
                await db.execAsync(userTableSql);
                await db.runAsync(
                    `INSERT INTO Users_auth_v1 (id, cloudUserId, name, email, username, lastSyncedAt)
                     SELECT id, ${source('cloudUserId')}, ${source('name')}, ${source('email')},
                            ${source('username')}, ${source('lastSyncedAt')}
                     FROM Users`
                );
                await db.execAsync(`
                    DROP TABLE IF EXISTS UserSessions;
                    DROP TABLE Users;
                    ALTER TABLE Users_auth_v1 RENAME TO Users;
                `);
            });
        } finally {
            await db.execAsync('PRAGMA foreign_keys = ON');
        }
    } else {
        await db.execAsync('DROP TABLE IF EXISTS UserSessions');
    }

    await db.execAsync(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cloud_user_id
            ON Users(cloudUserId);
        PRAGMA user_version = ${AUTH_SCHEMA_VERSION};
    `);
};
