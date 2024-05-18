import * as SQLite from 'expo-sqlite';

// Function to get all bet slips
export const getAllBetSlips = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM BetSlips');
        return allRows;
    } catch (error) {
        console.error('Error retrieving all bet slips:', error);
        throw error;
    }
};

// Function to get a bet slip
export const getBetSlip = async (db, betSlipId) => {
    try {
        const betSlip = await db.getAsync('SELECT * FROM BetSlips WHERE id = ?', [betSlipId]);
        return betSlip;
    } catch (error) {
        console.error('Error retrieving bet slip:', error);
        throw error;
    }
};

// Function to insert a bet slip
export const insertBetSlip = async (db, participantBetId, result) => {
    try {
        const resultDB = await db.runAsync('INSERT INTO BetSlips (participantBetId, result) VALUES (?, ?)', [participantBetId, result]);
        return resultDB.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting bet slip:', error);
        throw error;
    }
};

// Function to update a bet slip
export const updateBetSlip = async (db, betSlipId, participantBetId, result) => {
    try {
        await db.runAsync('UPDATE BetSlips SET participantBetId = ?, result = ? WHERE id = ?', [participantBetId, result, betSlipId]);
    } catch (error) {
        console.error('Error updating bet slip:', error);
        throw error;
    }
};

// Function to delete a bet slip
export const deleteBetSlip = async (db, betSlipId) => {
    try {
        await db.runAsync('DELETE FROM BetSlips WHERE id = ?', [betSlipId]);
    } catch (error) {
        console.error('Error deleting bet slip:', error);
        throw error;
    }
};
