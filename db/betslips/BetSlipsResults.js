import * as SQLite from 'expo-sqlite';

// Function to get a bet slip result
export const getBetSlipResult = async (db, betSlipId) => {
    try {
        const result = await db.getAsync('SELECT * FROM BetSlipsResults WHERE betSlipId = ?', [betSlipId]);
        return result;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to insert a bet slip result
export const insertBetSlipResult = async (db, betSlipId, result) => {
    try {
        const res = await db.runAsync('INSERT INTO BetSlipsResults (betSlipId, result) VALUES (?, ?)', [betSlipId, result]);
        return res.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting bet slip result:', error);
        throw error;
    }
};

// Function to update a bet slip result
export const updateBetSlipResult = async (db, betSlipId, result) => {
    try {
        await db.runAsync('UPDATE BetSlipsResults SET result = ? WHERE betSlipId = ?', [result, betSlipId]);
        console.log("Bet slip result updated");
    } catch (error) {
        console.error('Error updating bet slip result:', error);
        throw error;
    }
};

// Function to delete a bet slip result
export const deleteBetSlipResult = async (db, betSlipId) => {
    try {
        await db.runAsync('DELETE FROM BetSlipsResults WHERE betSlipId = ?', [betSlipId]);
    } catch (error) {
        console.error('Error deleting bet slip result:', error);
        throw error;
    }
};
