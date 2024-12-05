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

// Function to get all upcoming games
export const getAllUpcomingGames = async (db) => {
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Games WHERE DATE(date) >= ?', [date]);
        return allRows;
    } catch (error) {
        console.error('Error in getAllUpcomingGames:', error);
        throw error;
    }
}

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
export const getGamesForResults = async (db, date, leagueName) => {
    try {
        const query = `
            SELECT 
                Games.id, 
                Games.gameId, 
                Games.seasonId,
                Leagues.leagueName, 
                Games.date, 
                Games.timestamp,
                Teams.id as homeTeamId,
                Teams.teamName as homeTeamName,
                Teams2.id as awayTeamId, 
                Teams2.teamName as awayTeamName 
            FROM 
                Games 
            JOIN 
                Teams ON Games.homeTeamId = Teams.id 
            JOIN 
                Teams as Teams2 ON Games.awayTeamId = Teams2.id 
            JOIN
                Seasons ON Games.seasonId = Seasons.id
            JOIN
                Leagues ON Seasons.leagueId = Leagues.id
            WHERE 
                DATE(Games.date) = ? 
                AND Leagues.leagueName = ?
        `;

        const allRows = await db.getAllAsync(query, [date, leagueName]);
        return allRows;
    } catch (error) {
        console.error('Error in getTodaysGameswithNames:', error);
        throw error;
    }
}

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

// Function to get all upcoming games for a given seasonId
export const getUpcomingGames = async (db, seasonId) => {
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
                DATE(Games.date) >= DATE('now') 
                AND Games.seasonId = ?
        `;

        const allRows = await db.getAllAsync(query, [seasonId]);
        return allRows;
    } catch (error) {
        console.error('Error in getUpcomingGames:', error);
        throw error;
    }
}

// Function to get a game
export const getGame = async (db, gameId) => {
    try {
        const game = await db.getAllAsync('SELECT * FROM Games WHERE id = ?', [gameId]);
        return game;
    } catch (error) {
        console.error('Error in getGame:', error);
        throw error;
    }
};

export const getGameByTeams = async (db, homeTeamId, awayTeamId, timestamp) => {
    try {
        const game = await db.getAllAsync('SELECT * FROM Games WHERE homeTeamId = ? AND awayTeamId = ? AND timestamp = ?', [homeTeamId, awayTeamId, timestamp]);
        return game[0];
    } catch (error) {
        console.error('Error in getGameByTeams:', error);
        throw error;
    }
}

export const getGameByGameId = async (db, gameId) => {
    try {
        const game = await db.getAllAsync('SELECT * FROM Games WHERE gameId = ?', [gameId]);
        return game[0];
    } catch (error) {
        console.error('Error in getGameByGameId:', error);
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

export const insertFullGame = async (db, id, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) => {
    try {
        const result = await db.runAsync('INSERT INTO Games (id, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error in insertFullGame:', error);
        throw error;
    }
}

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

// Function to clear all games
export const clearGames = async (db) => {
    try {
        await db.runAsync('DELETE FROM Games');
    } catch (error) {
        console.error('Error in clearGames:', error);
        throw error;
    }
}