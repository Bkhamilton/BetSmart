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
export const deleteBetSlip = async (db, betSlipId) => {
    try {
        await db.runAsync('DELETE FROM BetSlips WHERE id = ?', [betSlipId]);
    } catch (error) {
        console.error('Error deleting bet slip:', error);
        throw error;
    }
};
