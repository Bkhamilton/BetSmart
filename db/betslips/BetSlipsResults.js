import * as SQLite from 'expo-sqlite';
import { fillBetSlips } from '@/contexts/BetContext/betSlipHelpers';

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

// Function to get all settled betslips for a specific user
export const getSettledBetSlips = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT
                B.id,
                B.formatId,
                BF.formatName AS formatName,
                B.winnings,
                B.betAmount,
                B.date,
                B.formatId,
                B.bookieId,
                BK.name AS bookieName,
                B.userId,
                R.result
            FROM
                BetSlips B
            LEFT JOIN
                BetSlipsResults R ON B.id = R.betSlipId
            LEFT JOIN
                Bookies BK ON B.bookieId = BK.id
            LEFT JOIN
                BetFormats BF ON B.formatId = BF.id
            WHERE
                B.userId = ? AND R.result IS NOT NULL
            ORDER BY
                B.date DESC
            LIMIT 100`, [userId]);
        const filledSlips = await fillBetSlips(db, result);
        return filledSlips;    
    } catch (error) {
        console.error('Error getting bet slip results:', error);
        throw error;
    }
};

// Function to return the winningest betslip (highest winnings) for a specific user
export const getWinningestBetSlip = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                B.id, 
                B.winnings, 
                B.betAmount, 
                B.date, 
                B.formatId, 
                B.bookieId, 
                B.userId, 
                R.result
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND R.result = 1
            ORDER BY 
                B.winnings DESC
            LIMIT 1`, [userId]);
        const winSlip = result[0];
        const filledSlip = await fillBetSlips(db, [winSlip]);
        return filledSlip[0];
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get the winningest betslip (highest winnings) for a specific user in the last 7 days
export const getWinningestBetSlipLast7Days = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                B.id, 
                B.winnings, 
                B.betAmount, 
                B.odds,
                B.date, 
                B.formatId, 
                B.bookieId, 
                Bo.name as bookieName,
                B.userId, 
                R.result
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            LEFT JOIN
                Bookies Bo ON B.bookieId = Bo.id
            WHERE 
                B.userId = ? AND R.result = 1 AND B.date >= date('now', '-7 days')
            ORDER BY 
                B.winnings DESC
            LIMIT 1`, [userId]);
        const winSlip = result[0];
        const filledSlip = await fillBetSlips(db, [winSlip]);
        return filledSlip[0];
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to return count of true and false betSlipResults for a specific user
export const getBetSlipResultsCount = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(R.result) as count, R.result 
            FROM 
                BetSlipsResults R
            LEFT JOIN 
                BetSlips B ON R.betSlipId = B.id
            WHERE 
                B.userId = ?
            GROUP BY 
                R.result`, [userId]);
        return result;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to return count of true betSlipResults for a specific user and bookie
export const getBetSlipResultsCountByBookie = async (db, userId, bookieId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(R.result) as count 
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND B.bookieId = ? AND R.result = 1`, [userId, bookieId]);
        return result[0].count;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to return count of true betSlipResults for a specific user and bookie over the last 7 days
export const getWonBetSlipCountByBookieLast7Days = async (db, userId, bookieId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(R.result) as count
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND B.bookieId = ? AND R.result = 1 AND B.date >= date('now', '-7 days')`, [userId, bookieId]);
        return result[0].count;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to return count of true betSlipResults for a specific user over the last 7 days
export const getWonBetSlipCountLast7Days = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(R.result) as count
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND R.result = 1 AND B.date >= date('now', '-7 days')`, [userId]);
        return result[0].count;
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

// Function to get total profit from bet slips for a specific user and bookie over the last 7 days
export const getProfitByBookieLast7Days = async (db, userId, bookieId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COALESCE(
                    (SELECT SUM(B.winnings) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND B.bookieId = ? AND B.date >= date('now', '-7 days') AND R.result = 1), 0) 
                - 
                COALESCE(
                    (SELECT SUM(B.betAmount) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND B.bookieId = ? AND B.date >= date('now', '-7 days') AND R.result = 0), 0) 
                AS totalProfit
            `, [userId, bookieId, userId, bookieId]);
        return result[0].totalProfit;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get total profit from bet slips for a specific user across all bookies over the last 7 days
export const getProfitLast7Days = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COALESCE(
                    (SELECT SUM(B.winnings) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND B.date >= date('now', '-7 days') AND R.result = 1), 0) 
                - 
                COALESCE(
                    (SELECT SUM(B.betAmount) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND B.date >= date('now', '-7 days') AND R.result = 0), 0) 
                AS totalProfit
            `, [userId, userId]);
        return result[0].totalProfit;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get total profit from bet slips for a specific user
export const getTotalProfit = async (db, userId) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COALESCE(
                    (SELECT SUM(B.winnings) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND R.result = 1), 0) 
                - 
                COALESCE(
                    (SELECT SUM(B.betAmount) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND R.result = 0), 0) 
                AS totalProfit
            `, [userId, userId]);
        return result[0].totalProfit;
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

// Function to delete bet slip results by betSlipIds
export const deleteBetSlipResultsByBetSlipIds = async (db, betSlipIds) => {
    try {
        const placeholders = betSlipIds.map(() => '?').join(',');
        await db.runAsync(`DELETE FROM BetSlipsResults WHERE betSlipId IN (${placeholders})`, betSlipIds);
    } catch (error) {
        console.error('Error deleting bet slip results by betSlipIds:', error);
        throw error;
    }
};

// Function to clear all bet slip results for a specific user
export const clearBetSlipResults = async (db, userId) => {
    try {
        await db.runAsync('DELETE FROM BetSlipsResults WHERE betSlipId IN (SELECT id FROM BetSlips WHERE userId = ?)', [userId]);
    } catch (error) {
        console.error('Error clearing bet slip results:', error);
        throw error;
    }
};