const hasLinePlacementColumn = async (db) => {
    const columns = await db.getAllAsync('PRAGMA table_info(Legs)');
    if (columns.length === 0) {
        throw new Error('Cannot add line placement snapshot: the Legs table is unavailable.');
    }
    return columns.some((column) => column.name.toLowerCase() === 'cloudlineatplacement');
};

/**
 * Add an independent exact-text destination for the remote line_at_placement.
 *
 * This is a single additive SQLite DDL statement, intentionally independent
 * of the FK table-rebuild migration and global user_version. It is safe to run
 * after sync schema initialization on the same connection and does not infer
 * or modify marketValueSnapshot.
 */
export const migrateLinePlacementSnapshot = async (db) => {
    if (!db || typeof db.getAllAsync !== 'function' || typeof db.execAsync !== 'function') {
        throw new Error('A valid SQLite database connection is required for the line-placement migration.');
    }
    if (await hasLinePlacementColumn(db)) return { applied: false };

    try {
        await db.execAsync('ALTER TABLE Legs ADD COLUMN cloudLineAtPlacement TEXT');
    } catch (error) {
        // Another initializer may have completed the same atomic ADD COLUMN.
        // Suppress only that exact successful-race outcome; surface all else.
        if (await hasLinePlacementColumn(db)) return { applied: false };
        throw new Error(`Could not add the independent line-placement snapshot column: ${error.message}`);
    }
    return { applied: true };
};
