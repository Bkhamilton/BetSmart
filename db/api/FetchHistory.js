import * as SQLite from 'expo-sqlite';

// Function to get all fetch history
export const getAllFetchHistory = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM FetchHistory');
        return allRows;
    } catch (error) {
        console.error('Error getting all fetch history:', error);
        throw error;
    }
};

// Function to get fetch history by league
export const getFetchHistoryByLeague = async (db, league) => {
    try {
        const fetchHistory = await db.getAllAsync('SELECT * FROM FetchHistory WHERE league = ?', [league]);
        return fetchHistory;
    } catch (error) {
        console.error('Error getting fetch history by league:', error);
        throw error;
    }
};

// Function to get fetch history by last fetched
export const getFetchHistoryByLastFetched = async (db, league, lastFetched) => {
    try {
        const fetchHistory = await db.getAllAsync('SELECT * FROM FetchHistory WHERE league = ? AND lastFetched = ?', [league, lastFetched]);
        return fetchHistory;
    } catch (error) {
        console.error('Error getting fetch history by last fetched:', error);
        throw error;
    }
};

// Function to get last fetched by league
export const getLastFetchedByLeague = async (db, league) => {
    try {
        const fetchHistory = await db.getAllAsync('SELECT lastFetched FROM FetchHistory WHERE league = ? ORDER BY lastFetched DESC LIMIT 1', [league]);
        return fetchHistory.length > 0 ? fetchHistory[0] : null;
    } catch (error) {
        console.error('Error getting fetch history by last fetched:', error);
        throw error;
    }
}

// Function to insert fetch history
export const insertFetchHistory = async (db, league, lastFetched) => {
    try {
        const result = await db.runAsync('INSERT INTO FetchHistory (league, lastFetched) VALUES (?, ?)', [league, lastFetched]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting fetch history:', error);
        throw error;
    }
};

// Function to update fetch history
export const updateFetchHistory = async (db, league, lastFetched) => {
    try {
        await db.runAsync('UPDATE FetchHistory SET lastFetched = ? WHERE league = ?', [lastFetched, league]);
    } catch (error) {
        console.error('Error updating fetch history:', error);
        throw error;
    }
};

// Function to delete fetch history
export const deleteFetchHistory = async (db, league) => {
    try {
        await db.runAsync('DELETE FROM FetchHistory WHERE league = ?', [league]);
    } catch (error) {
        console.error('Error deleting fetch history:', error);
        throw error;
    }
};
