import * as SQLite from 'expo-sqlite';

// Function to get all games
export const getAllGames = async (db) => {
    const allRows = await db.getAllAsync('SELECT * FROM Games');
    return allRows;
};

// Function to get a game
export const getGame = async (db, gameId) => {
    const game = await db.getAsync('SELECT * FROM Games WHERE id = ?', [gameId]);
    return game;
};

// Function to insert a game
export const insertGame = async (db, gameId, seasonId, date, homeTeamId, awayTeamId) => {
    const result = await db.runAsync('INSERT INTO Games (gameId, seasonId, date, homeTeamId, awayTeamId) VALUES (?, ?, ?, ?, ?)', [gameId, seasonId, date, homeTeamId, awayTeamId]);
    return result.lastInsertRowId;
};

// Function to update a game
export const updateGame = async (db, gameId, seasonId, date, homeTeamId, awayTeamId) => {
    await db.runAsync('UPDATE Games SET seasonId = ?, date = ?, homeTeamId = ?, awayTeamId = ? WHERE id = ?', [seasonId, date, homeTeamId, awayTeamId, gameId]);
};

// Function to delete a game
export const deleteGame = async (db, gameId) => {
    await db.runAsync('DELETE FROM Games WHERE id = ?', [gameId]);
};