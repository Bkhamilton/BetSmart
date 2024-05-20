import * as SQLite from 'expo-sqlite';

// Function to get all games
export const getAllGames = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Games');
        return allRows;
    } catch (error) {
        console.error('Error in getAllGames:', error);
        throw error;
    }
};

// Function to get all games by date
export const getGamesByDate = async (db, date) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Games WHERE date = ?', [date]);
        return allRows;
    } catch (error) {
        console.error('Error in getGamesByDate:', error);
        throw error;
    }
};

// Function to get a game
export const getGame = async (db, gameId) => {
    try {
        const game = await db.getAsync('SELECT * FROM Games WHERE id = ?', [gameId]);
        return game;
    } catch (error) {
        console.error('Error in getGame:', error);
        throw error;
    }
};

// Function to insert a game
export const insertGame = async (db, gameId, seasonId, date, homeTeamId, awayTeamId) => {
    try {
        const result = await db.runAsync('INSERT INTO Games (gameId, seasonId, date, homeTeamId, awayTeamId) VALUES (?, ?, ?, ?, ?)', [gameId, seasonId, date, homeTeamId, awayTeamId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error in insertGame:', error);
        throw error;
    }
};

// Function to update a game
export const updateGame = async (db, gameId, seasonId, date, homeTeamId, awayTeamId) => {
    try {
        await db.runAsync('UPDATE Games SET seasonId = ?, date = ?, homeTeamId = ?, awayTeamId = ? WHERE id = ?', [seasonId, date, homeTeamId, awayTeamId, gameId]);
    } catch (error) {
        console.error('Error in updateGame:', error);
        throw error;
    }
};

// Function to delete a game
export const deleteGame = async (db, gameId) => {
    try {
        await db.runAsync('DELETE FROM Games WHERE id = ?', [gameId]);
    } catch (error) {
        console.error('Error in deleteGame:', error);
        throw error;
    }
};