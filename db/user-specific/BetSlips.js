import * as SQLite from 'expo-sqlite';

// Function to get all bet slips
export const getAllBetSlips = async (db) => {
    const allRows = await db.getAllAsync('SELECT * FROM BetSlips');
    return allRows;
};

// Function to get a bet slip
export const getBetSlip = async (db, betSlipId) => {
    const betSlip = await db.getAsync('SELECT * FROM BetSlips WHERE id = ?', [betSlipId]);
    return betSlip;
};

// Function to insert a bet slip
export const insertBetSlip = async (db, participantBetId, result) => {
    const resultDB = await db.runAsync('INSERT INTO BetSlips (participantBetId, result) VALUES (?, ?)', [participantBetId, result]);
    return resultDB.lastInsertRowId;
};

// Function to update a bet slip
export const updateBetSlip = async (db, betSlipId, participantBetId, result) => {
    await db.runAsync('UPDATE BetSlips SET participantBetId = ?, result = ? WHERE id = ?', [participantBetId, result, betSlipId]);
};

// Function to delete a bet slip
export const deleteBetSlip = async (db, betSlipId) => {
    await db.runAsync('DELETE FROM BetSlips WHERE id = ?', [betSlipId]);
};
