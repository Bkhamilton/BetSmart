import * as SQLite from 'expo-sqlite';

// Function to get all players
export const getAllPlayers = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Players');
        return allRows;
    } catch (error) {
        console.error('Error in getAllPlayers:', error);
        throw error;
    }
};

// Function to get player logo from player name
export const getPlayerLogo = async (db, playerName) => {
    try {
        const player = await db.getAllAsync('SELECT image FROM Players WHERE name = ?', [playerName]);
        return player[0];
    } catch (error) {
        console.error('Error in getPlayerLogo:', error);
        throw error;
    }
}

// Function to get a player by ID
export const getPlayer = async (db, playerId) => {
    try {
        const player = await db.getAllAsync('SELECT * FROM Players WHERE id = ?', [playerId]);
        return player[0];
    } catch (error) {
        console.error('Error in getPlayer:', error);
        throw error;
    }
};

// Function to get all players for a team
export const getPlayersByTeam = async (db, teamId) => {
    try {
        const players = await db.getAllAsync('SELECT * FROM Players WHERE teamId = ?', [teamId]);
        return players;
    } catch (error) {
        console.error('Error in getPlayersByTeam:', error);
        throw error;
    }
};

// Function to get all players for a team by team name
export const getPlayersByTeamName = async (db, teamName) => {
    try {
        const players = await db.getAllAsync('SELECT * FROM Players WHERE teamId = (SELECT id FROM Teams WHERE teamName = ?)', [teamName]);
        return players;
    } catch (error) {
        console.error('Error in getPlayersByTeamName:', error);
        throw error;
    }
}

// Function to insert a player
export const insertPlayer = async (db, name, position, number, image, teamId) => {
    try {
        const result = await db.runAsync('INSERT INTO Players (name, position, number, image, teamId) VALUES (?, ?, ?, ?, ?)', [name, position, number, image, teamId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error in insertPlayer:', error);
        throw error;
    }
};

// Function to update a player
export const updatePlayer = async (db, playerId, name, position, number, image, teamId) => {
    try {
        const result = await db.runAsync('UPDATE Players SET name = ?, position = ?, number = ?, image = ?, teamId = ? WHERE id = ?', [name, position, number, image, teamId, playerId]);
        return result.changes;
    } catch (error) {
        console.error('Error in updatePlayer:', error);
        throw error;
    }
};

// Function to update a player's team
export const updatePlayerTeam = async (db, playerId, teamId) => {
    try {
        const result = await db.runAsync('UPDATE Players SET teamId = ? WHERE id = ?', [teamId, playerId]);
        return result.changes;
    } catch (error) {
        console.error('Error in updatePlayerTeam:', error);
        throw error;
    }
};

// Function to delete a player
export const deletePlayer = async (db, playerId) => {
    try {
        await db.runAsync('DELETE FROM Players WHERE id = ?', [playerId]);
    } catch (error) {
        console.error('Error in deletePlayer:', error);
        throw error;
    }
};
