import * as SQLite from 'expo-sqlite';

// Function to get all league props
export const getAllLeagueProps = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM LeagueProps');
        return allRows;
    } catch (error) {
        console.error('Error in getAllLeagueProps:', error);
        throw error;
    }
};

// Function to get a league prop
export const getLeagueProp = async (db, leaguePropId) => {
    try {
        const leagueProp = await db.getAllAsync('SELECT * FROM LeagueProps WHERE id = ?', [leaguePropId]);
        return leagueProp;
    } catch (error) {
        console.error('Error in getLeagueProp:', error);
        throw error;
    }
};

// Function to get all league props for a league
export const getLeaguePropsForLeague = async (db, leagueId) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM LeagueProps WHERE leagueId = ?', [leagueId]);
        return allRows;
    } catch (error) {
        console.error('Error in getAllLeaguePropsForLeague:', error);
        throw error;
    }
};

// Function to get a league prop by name
export const getLeaguePropByName = async (db, leagueId, propName) => {
    try {
        const leagueProp = await db.getAsync('SELECT * FROM LeagueProps WHERE leagueId = ? AND propName = ?', [leagueId, propName]);
        return leagueProp;
    } catch (error) {
        console.error('Error in getLeaguePropByName:', error);
        throw error;
    }
};

// Function to insert a league prop
export const insertLeagueProp = async (db, leagueId, propName) => {
    try {
        const result = await db.runAsync('INSERT INTO LeagueProps (leagueId, propName) VALUES (?, ?)', [leagueId, propName]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error in insertLeagueProp:', error);
        throw error;
    }
};

// Function to update a league prop
export const updateLeagueProp = async (db, leaguePropId, propName) => {
    try {
        await db.runAsync('UPDATE LeagueProps SET propName = ? WHERE id = ?', [propName, leaguePropId]);
    } catch (error) {
        console.error('Error in updateLeagueProp:', error);
        throw error;
    }
};

// Function to delete a league prop
export const deleteLeagueProp = async (db, leaguePropId) => {
    try {
        await db.runAsync('DELETE FROM LeagueProps WHERE id = ?', [leaguePropId]);
    } catch (error) {
        console.error('Error in deleteLeagueProp:', error);
        throw error;
    }
};
