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

// Function to get all bet slips for a given day
export const getTodaysBetSlips = async (db, day) => {
    // Parse the given day to create start and end timestamps in EST
    const startOfDayEST = new Date(`${day}T00:00:00-05:00`);
    const endOfDayEST = new Date(`${day}T23:59:59-05:00`);

    // Convert the start and end timestamps to UTC
    const startOfDayUTC = new Date(startOfDayEST.getTime() + (startOfDayEST.getTimezoneOffset() * 60000)).toISOString();
    const endOfDayUTC = new Date(endOfDayEST.getTime() + (endOfDayEST.getTimezoneOffset() * 60000)).toISOString();

    try {
        // Query the database to find all BetSlip objects within the start and end timestamps in UTC
        const betSlips = await db.getAllAsync(
            'SELECT * FROM BetSlips WHERE date >= ? AND date <= ?',
            [startOfDayUTC, endOfDayUTC]
        );
        return betSlips;
    } catch (error) {
        console.error('Error fetching today\'s bet slips:', error);
        throw error;
    }
};

// Function to get total betSlips for a user over the last 7 days
export const getLastWeekOfBetSlips = async (db, userId) => {
    try {
        const betSlipsLast7Days = await db.getAllAsync(`
            SELECT 
                bs.*,
                bsr.result AS result
            FROM 
                BetSlips bs
            LEFT JOIN
                BetSlipsResults bsr ON bs.id = bsr.betSlipId
            WHERE 
                bs.userId = ? AND 
                bs.date >= datetime('now', '-7 days') AND
                bsr.betSlipId IS NOT NULL
        `, [userId]);
        return betSlipsLast7Days;
    } catch (error) {
        console.error('Error fetching total bet slips over the last 7 days:', error);
        throw error;
    }
};

// Function to get all open bet slips for a user
export const getOpenBetSlips = async (db, userId) => {
    try {
        const openBetSlips = await db.getAllAsync(`
            SELECT 
                bs.id AS id,
                bs.formatId AS formatId,
                bf.formatName AS formatName,
                bs.date AS date,
                bs.odds AS odds,
                bs.betAmount AS betAmount,
                bs.winnings AS winnings,
                bs.userId AS userId,
                bs.bookieId AS bookieId,
                b.name AS bookieName
            FROM 
                BetSlips bs
            LEFT JOIN 
                BetSlipsResults bsr ON bs.id = bsr.betSlipId
            LEFT JOIN
                Bookies b ON bs.bookieId = b.id
            LEFT JOIN
                BetFormats bf ON bs.formatId = bf.id
            WHERE 
                bsr.betSlipId IS NULL AND bs.userId = ?
        `, [userId]);
        return openBetSlips;
    } catch (error) {
        console.error('Error querying open BetSlips:', error);
        throw error;
    }
};

// Function to get a bet slip
export const getBetSlip = async (db, betSlipId) => {
    try {
        const betSlip = await db.getAllAsync('SELECT * FROM BetSlips WHERE id = ?', [betSlipId]);
        return betSlip;
    } catch (error) {
        console.error('Error retrieving bet slip:', error);
        throw error;
    }
};

export const getBetSlipsByUserId = async (db, userId) => {
    try {
        const betSlips = await db.getAllAsync('SELECT * FROM BetSlips WHERE userId = ?', [userId]);
        return betSlips;
    } catch (error) {
        console.error('Error retrieving bet slips by user ID:', error);
        throw error;
    }
};

// Function to get total betSlips for a user
export const getTotalBetSlips = async (db, userId) => {
    try {
        const totalBetSlips = await db.getAllAsync('SELECT COUNT(*) as count FROM BetSlips WHERE userId = ?', [userId]);
        return totalBetSlips[0].count;
    } catch (error) {
        console.error('Error fetching total bet slips:', error);
        throw error;
    }
};

// Function to get total betSlips for a user and bookie over the last 7 days
export const getBetSlipsByBookieLast7Days = async (db, userId, bookieId) => {
    try {
        const betSlipsLast7Days = await db.getAllAsync(`
            SELECT 
                COUNT(*) as count 
            FROM 
                BetSlips 
            WHERE 
                userId = ? AND bookieId = ? AND date >= datetime('now', '-7 days')
        `, [userId, bookieId]);
        return betSlipsLast7Days[0].count;
    } catch (error) {
        console.error('Error fetching total bet slips over the last 7 days:', error);
        throw error;
    }
};

// Function to get total betSlips for a user over the last 7 days
export const getBetSlipsLast7Days = async (db, userId) => {
    try {
        const betSlipsLast7Days = await db.getAllAsync(`
            SELECT 
                COUNT(*) as count 
            FROM 
                BetSlips 
            WHERE 
                userId = ? AND date >= datetime('now', '-7 days')
        `, [userId]);
        return betSlipsLast7Days[0].count;
    } catch (error) {
        console.error('Error fetching total bet slips over the last 7 days:', error);
        throw error;
    }
};

// Function to get total betSlips for a user per bookie
export const getFavoriteBookie = async (db, userId) => {
    try {
        const favoriteBookie = await db.getAllAsync(`
            SELECT 
                COUNT(*) as count, 
                bs.bookieId, 
                b.name as name 
            FROM 
                BetSlips bs
            LEFT JOIN 
                Bookies b ON bs.bookieId = b.id
            WHERE 
                bs.userId = ?
            GROUP BY 
                bs.bookieId,
                b.name
            ORDER BY 
                count DESC
        `, [userId]);
        return favoriteBookie[0];
    } catch (error) {
        console.error('Error fetching total bet slips per bookie:', error);
        throw error;
    }
};

// Function to insert a bet slip
export const insertBetSlip = async (db, formatId, date, odds, betAmount, winnings, userId, bookieId) => {
    try {
        const result = await db.runAsync('INSERT INTO BetSlips (formatId, date, odds, betAmount, winnings, userId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?)', [formatId, date, odds, betAmount, winnings, userId, bookieId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting bet slip:', error);
        throw error;
    }
};

// Function to update a bet slip
export const updateBetSlip = async (db, betSlipId, formatId, date, odds, betAmount, winnings, userId, bookieId) => {
    try {
        await db.runAsync('UPDATE BetSlips SET formatId = ?, date = ?, odds = ?, betAmount = ?, winnings = ?, userId = ?, bookieId = ? WHERE id = ?', [formatId, date, odds, betAmount, winnings, userId, bookieId, betSlipId]);
    } catch (error) {
        console.error('Error updating bet slip:', error);
        throw error;
    }
};

// Function to delete a bet slip
export const deleteBetSlip = async (db, betSlipId, userId) => {
    try {
        await db.runAsync('DELETE FROM BetSlips WHERE id = ? AND userId = ?', [betSlipId, userId]);
    } catch (error) {
        console.error('Error deleting bet slip:', error);
        throw error;
    }
};

// Function to delete all bet slips for a user
export const deleteBetSlipsByUserId = async (db, userId) => {
    try {
        await db.runAsync('DELETE FROM BetSlips WHERE userId = ?', [userId]);
    } catch (error) {
        console.error('Error deleting bet slips by user ID:', error);
        throw error;
    }
}

// Function to delete all bet slips for a user
export const clearBetSlips = async (db, userId) => {
    try {
        await db.runAsync('DELETE FROM BetSlips WHERE userId = ?', [userId]);
    } catch (error) {
        console.error('Error clearing bet slips:', error);
        throw error;
    }
};