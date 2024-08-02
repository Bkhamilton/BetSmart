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
export const getGamesByDate = async (db, date, season) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Games WHERE DATE(date) = ? AND seasonId = ?', [date, season]);
        return allRows;
    } catch (error) {
        console.error('Error in getGamesByDate:', error);
        throw error;
    }
};

// Function to get all of today's games for a given seasonId
export const getTodaysGameswithNames = async (db, date, seasonId) => {
    try {
        const query = `
            SELECT 
                Games.id, 
                Games.gameId, 
                Games.seasonId, 
                Games.date, 
                Games.timestamp, 
                Teams.teamName as homeTeamName, 
                Teams.abbreviation as homeTeamAbv, 
                Teams2.teamName as awayTeamName, 
                Teams2.abbreviation as awayTeamAbv 
            FROM 
                Games 
            JOIN 
                Teams ON Games.homeTeamId = Teams.id 
            JOIN 
                Teams as Teams2 ON Games.awayTeamId = Teams2.id 
            WHERE 
                DATE(Games.date) = ? 
                AND Games.seasonId = ?
        `;

        const allRows = await db.getAllAsync(query, [date, seasonId]);
        return allRows;
    } catch (error) {
        console.error('Error in getTodaysGameswithNames:', error);
        throw error;
    }
}

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
export const insertGame = async (db, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) => {
    try {
        const result = await db.runAsync('INSERT INTO Games (gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) VALUES (?, ?, ?, ?, ?, ?)', [gameId, seasonId, date, timestamp, homeTeamId, awayTeamId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error in insertGame:', error);
        throw error;
    }
};

// Function to update a game
export const updateGame = async (db, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) => {
    try {
        await db.runAsync('UPDATE Games SET seasonId = ?, date = ?, timestamp = ?, homeTeamId = ?, awayTeamId = ? WHERE id = ?', [seasonId, date, timestamp, homeTeamId, awayTeamId, gameId]);
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