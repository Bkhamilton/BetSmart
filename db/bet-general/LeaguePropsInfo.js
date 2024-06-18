import * as SQLite from 'expo-sqlite';

// Function to get all league props info
export const getAllLeaguePropsInfo = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM LeaguePropsInfo');
        return allRows;
    } catch (error) {
        console.error('Error in getAllLeaguePropsInfo:', error);
        throw error;
    }
};

// Function to get all league prop info by propValue
export const getLeaguePropsInfoByPropValue = async (db, propValue) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM LeaguePropsInfo WHERE propValue = ?', [propValue]);
        return allRows;
    } catch (error) {
        console.error('Error in getAllLeaguePropsInfoByPropValue:', error);
        throw error;
    }
};

// Function to get a league prop info
export const getLeaguePropInfo = async (db, leagueId, propName) => {
    try {
        const leaguePropInfo = await db.getAllAsync('SELECT * FROM LeaguePropsInfo WHERE leagueId = ? AND propName = ?', [leagueId, propName]);
        return leaguePropInfo;
    } catch (error) {
        console.error('Error in getLeaguePropInfo:', error);
        throw error;
    }
};

// Function to insert a league prop info
export const insertLeaguePropInfo = async (db, leagueId, propName, propValue) => {
    try {
        const result = await db.runAsync('INSERT INTO LeaguePropsInfo (leagueId, propName, propValue) VALUES (?, ?, ?)', [leagueId, propName, propValue]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error in insertLeaguePropInfo:', error);
        throw error;
    }
};

// Function to update a league prop info
export const updateLeaguePropInfo = async (db, leaguePropInfoId, leagueId, propName, propValue) => {
    try {
        await db.runAsync('UPDATE LeaguePropsInfo SET leagueId = ?, propName = ?, propValue = ? WHERE id = ?', [leagueId, propName, propValue, leaguePropInfoId]);
    } catch (error) {
        console.error('Error in updateLeaguePropInfo:', error);
        throw error;
    }
};

// Function to delete a league prop info
export const deleteLeaguePropInfo = async (db, leaguePropInfoId) => {
    try {
        await db.runAsync('DELETE FROM LeaguePropsInfo WHERE id = ?', [leaguePropInfoId]);
    } catch (error) {
        console.error('Error in deleteLeaguePropInfo:', error);
        throw error;
    }
};

// Function to delete all league prop info with a specific propValue
export const deleteLeaguePropInfoByPropValue = async (db, propValue) => {
    try {
        await db.runAsync('DELETE FROM LeaguePropsInfo WHERE propValue = ?', [propValue]);
    } catch (error) {
        console.error('Error in deleteLeaguePropInfoByPropValue:', error);
        throw error;
    }
};