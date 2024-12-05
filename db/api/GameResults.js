import * as SQLite from 'expo-sqlite';

// Function to get all game results
export const getAllGameResults = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM GameResults');
        return allRows;
    } catch (error) {
        console.error('Error getting all game results:', error);
    }
};

// Function to get game results by gameId
export const getGameResultsByGameId = async (db, gameId) => {
    try {
        const gameResults = await db.getAllAsync('SELECT * FROM GameResults WHERE gameId = ?', [gameId]);
        return gameResults;
    } catch (error) {
        console.error('Error getting game results by gameId:', error);
    }
};

// Function to get a game result by id
export const getGameResultById = async (db, id) => {
    try {
        const gameResult = await db.getAllAsync('SELECT * FROM GameResults WHERE id = ?', [id]);
        return gameResult[0];
    } catch (error) {
        console.error('Error getting a game result by id:', error);
    }
};

// Function to insert a game result
export const insertGameResult = async (db, gameId, homeScore, awayScore, winner) => {
    try {
        const result = await db.runAsync('INSERT INTO GameResults (gameId, homeScore, awayScore, winner) VALUES (?, ?, ?, ?)', [gameId, homeScore, awayScore, winner]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting a game result:', error);
    }
};

// Function to insert a full game result
export const insertFullGameResult = async (db, id, gameId, homeScore, awayScore, winner) => {
    try {
        const result = await db.runAsync('INSERT INTO GameResults (id, gameId, homeScore, awayScore, winner) VALUES (?, ?, ?, ?, ?)', [id, gameId, homeScore, awayScore, winner]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting a game result:', error);
    }
}

// Function to update a game result
export const updateGameResult = async (db, id, gameId, homeScore, awayScore, winner) => {
    try {
        await db.runAsync('UPDATE GameResults SET gameId = ?, homeScore = ?, awayScore = ?, winner = ? WHERE id = ?', [gameId, homeScore, awayScore, winner, id]);
    } catch (error) {
        console.error('Error updating a game result:', error);
    }
};

// Function to delete a game result
export const deleteGameResult = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM GameResults WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting a game result:', error);
    }
};
