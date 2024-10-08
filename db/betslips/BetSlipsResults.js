import * as SQLite from 'expo-sqlite';

// Function to get a bet slip result
export const getBetSlipResult = async (db, betSlipId) => {
    try {
        const result = await db.getAllAsync('SELECT * FROM BetSlipsResults WHERE betSlipId = ?', [betSlipId]);
        return result;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to return count of true and false betSlipResults
export const getBetSlipResultsCount = async (db) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(result) as count, result 
            FROM 
                BetSlipsResults 
            GROUP BY 
                result`);
        return result;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get total winnings from bet slips that are true for a specific user
export const getBetSlipResultsWinnings = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                SUM(B.winnings) as totalWinnings
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                R.result = 1 AND B.userId = ?`, [userId]);
        return result;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get total betAmount from betSlips for a specific user
export const getBetSlipResultsBetAmount = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                SUM(B.betAmount) as totalBetAmount
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ?`, [userId]);
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
