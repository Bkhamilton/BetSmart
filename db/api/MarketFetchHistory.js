import * as SQLite from 'expo-sqlite';

// Function to get all fetch history
export const getAllMarketFetchHistory = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM MarketFetchHistory');
        return allRows;
    } catch (error) {
        console.error('Error getting all fetch history:', error);
        throw error;
    }
};

// Function to get fetch history by league
export const getMarketFetchHistoryByGame = async (db, market, gameId) => {
    try {
        const fetchHistory = await db.getAllAsync('SELECT * FROM MarketFetchHistory WHERE marketType = ? AND gameId = ?', [market, gameId]);
        return fetchHistory;
    } catch (error) {
        console.error('Error getting fetch history by league:', error);
        throw error;
    }
};

// Function to get last fetched by league
export const getLastMarketFetchedByGame = async (db, market, gameId) => {
    try {
        const marketFetchHistory = await db.getAllAsync('SELECT lastFetched FROM MarketFetchHistory WHERE gameId = ? AND marketType = ? ORDER BY lastFetched DESC LIMIT 1', [gameId, market]);
        return marketFetchHistory.length > 0 ? fetchHistory[0] : null;
    } catch (error) {
        console.error('Error getting fetch history by last fetched:', error);
        throw error;
    }
}


// Function to get fetch history by last fetched
export const getMarketFetchHistoryByLastFetched = async (db, market, lastFetched) => {
    try {
        const fetchHistory = await db.getAllAsync('SELECT * FROM MarketFetchHistory WHERE marketType = ? AND lastFetched = ?', [market, lastFetched]);
        return fetchHistory;
    } catch (error) {
        console.error('Error getting fetch history by last fetched:', error);
        throw error;
    }
};

// Function that takes a league name and lastFetched date and returns Boolean if the league has been fetched on that date
export const marketFetchedOnDate = async (db, market, gameId, lastFetched) => {
    try {
        const fetchHistory = await db.getAllAsync('SELECT * FROM MarketFetchHistory WHERE marketType = ? AND gameId = ? AND lastFetched = ?', [market, gameId, lastFetched]);
        return fetchHistory.length > 0;
    } catch (error) {
        console.error('Error getting fetch history by last fetched:', error);
        throw error;
    }
}

// Function to insert fetch history
export const insertMarketFetchHistory = async (db, gameId, marketType, lastFetched) => {
    try {
        const result = await db.runAsync('INSERT INTO MarketFetchHistory (gameId, marketType, lastFetched) VALUES (?, ?, ?)', [gameId, marketType, lastFetched]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting fetch history:', error);
        console.log('game:', gameId, 'lastFetched:', lastFetched);
        throw error;
    }
};

// Function to delete fetch history
export const deleteMarketFetchHistory = async (db, league) => {
    try {
        await db.runAsync('DELETE FROM MarketFetchHistory WHERE league = ?', [league]);
    } catch (error) {
        console.error('Error deleting fetch history:', error);
        throw error;
    }
};
