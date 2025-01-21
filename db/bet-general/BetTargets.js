import * as SQLite from 'expo-sqlite';

// Function to get all bet targets
export const getAllBetTargets = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM BetTargets');
        return allRows;
    } catch (error) {
        console.error('Error getting all bet targets:', error);
        throw error;
    }
};

// Function to get all bet targets by type
export const getAllBetTargetsByType = async (db, targetType) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM BetTargets WHERE targetType = ?', [targetType]);
        return allRows;
    } catch (error) {
        console.error('Error getting all bet targets by type:', error);
        throw error;
    }
};

// Function to get a bet target
export const getBetTarget = async (db, betTargetId) => {
    try {
        const betTarget = await db.getAllAsync('SELECT * FROM BetTargets WHERE id = ?', [betTargetId]);
        return betTarget[0];
    } catch (error) {
        console.error('Error getting bet target:', error);
        throw error;
    }
};

// Function to get all bet targets by gameId
export const getBetTargetsByGameId = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM BetTargets WHERE gameId = ?', [gameId]);
        return allRows;
    } catch (error) {
        console.error('Error getting all bet targets by gameId:', error);
        throw error;
    }
};

// Function to get bet target name
export const getBetTargetName = async (db, betTargetId) => {
    try {
        const betTarget = await db.getAllAsync('SELECT targetName FROM BetTargets WHERE id = ?', [betTargetId]);
        return betTarget[0].targetName;
    } catch (error) {
        console.error('Error getting bet target:', error);
        throw error;
    }
}

// Function to get bet target ID by name
export const getBetTargetId = async (db, targetName) => {
    try {
        const betTarget = await db.getAllAsync('SELECT * FROM BetTargets WHERE targetName = ?', [targetName]);
        return betTarget[0];
    } catch (error) {
        console.error('Error getting bet target ID by name:', error);
        throw error;
    }
};

export const getBetTargetIdByName = async (db, targetName) => {
    try {
        const betTarget = await db.getAllAsync('SELECT id FROM BetTargets WHERE targetName = ?', [targetName]);
        return betTarget[0].id;
    } catch (error) {
        console.error('Error getting bet target ID by name:', error);
        throw error;
    }
};

// Function to get Bet Target ID by gameId
export const getBetTargetIdByGameId = async (db, gameId) => {
    try {
        const betTarget = await db.getAllAsync('SELECT * FROM BetTargets WHERE gameId = ?', [gameId]);
        return betTarget[0];
    } catch (error) {
        console.error('Error getting bet target ID by gameId:', error);
        throw error;
    }
};

// Function to insert a bet target
export const insertBetTarget = async (db, targetType, targetName, teamId, gameId) => {
    try {
        const result = await db.runAsync('INSERT INTO BetTargets (targetType, targetName, teamId, gameId) VALUES (?, ?, ?, ?)', [targetType, targetName, teamId, gameId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting bet target:', error);
        throw error;
    }
};

// Function to insert a bet target with ID
export const insertFullBetTarget = async (db, id, targetType, targetName, teamId, gameId) => {
    try {
        const result = await db.runAsync('INSERT INTO BetTargets (id, targetType, targetName, teamId, gameId) VALUES (?, ?, ?, ?, ?)', [id, targetType, targetName, teamId, gameId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting full bet target:', error);
        throw error;
    }
};

// Function to update a bet target
export const updateBetTarget = async (db, betTargetId, targetType, targetName, teamId, gameId) => {
    try {
        await db.runAsync('UPDATE BetTargets SET targetType = ?, targetName = ?, teamId = ?, gameId = ? WHERE id = ?', [targetType, targetName, teamId, gameId, betTargetId]);
    } catch (error) {
        console.error('Error updating bet target:', error);
        throw error;
    }
};

// Function to update a bet target targetName by id
export const updateBetTargetName = async (db, betTargetId, targetName) => {
    try {
        await db.runAsync('UPDATE BetTargets SET targetName = ? WHERE id = ?', [targetName, betTargetId]);
    } catch (error) {
        console.error('Error updating bet target name:', error);
        throw error;
    }
};

// Function to delete a bet target
export const deleteBetTarget = async (db, betTargetId) => {
    try {
        await db.runAsync('DELETE FROM BetTargets WHERE id = ?', [betTargetId]);
    } catch (error) {
        console.error('Error deleting bet target:', error);
        throw error;
    }
};

// Function to clear all bet targets
export const clearBetTargets = async (db) => {
    try {
        await db.runAsync('DELETE FROM BetTargets');
    } catch (error) {
        console.error('Error clearing bet targets:', error);
        throw error;
    }
};
