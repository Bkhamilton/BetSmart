import * as SQLite from 'expo-sqlite';

// Function to get all user sessions
export const getAllUserSessions = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM UserSessions');
        return allRows;
    } catch (error) {
        console.error('Error getting all user sessions:', error);
        throw error;
    }
};

// Function to get a user session
export const getUserSession = async (db, userSessionId) => {
    try {
        const userSession = await db.getAllAsync('SELECT * FROM UserSessions WHERE id = ?', [userSessionId]);
        return userSession;
    } catch (error) {
        console.error('Error getting user session:', error);
        throw error;
    }
};

// Function to return the active user session
export const getActiveUserSession = async (db, userId) => {
    try {
        const userSession = await db.getAllAsync('SELECT * FROM UserSessions WHERE userId = ? AND isActive = 1', [userId]);
        return userSession;
    } catch (error) {
        console.error('Error getting active user session:', error);
        throw error;
    }
};

// Function to get the most recently active user session
export const getMostRecentActiveUserSession = async (db) => {
    try {
        const userSession = await db.getAllAsync('SELECT * FROM UserSessions WHERE isActive = 1 ORDER BY loginTimestamp DESC LIMIT 1');
        return userSession[0];
    } catch (error) {
        console.error('Error getting most recently active user session:', error);
        throw error;
    }
};

// Function to insert a user session
export const insertUserSession = async (db, userId, loginTimestamp) => {
    try {
        const result = await db.runAsync('INSERT INTO UserSessions (userId, loginTimestamp) VALUES (?, ?)', [userId, loginTimestamp]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting user session:', error);
        throw error;
    }
};

// Function to update a user session
export const updateUserSession = async (db, userSessionId, userId, loginTimestamp, logoutTimestamp, isActive) => {
    try {
        await db.runAsync('UPDATE UserSessions SET userId = ?, loginTimestamp = ?, logoutTimestamp = ?, isActive = ? WHERE id = ?', [userId, loginTimestamp, logoutTimestamp, isActive, userSessionId]);
    } catch (error) {
        console.error('Error updating user session:', error);
        throw error;
    }
};

// Function to delete a user session
export const deleteUserSession = async (db, userSessionId) => {
    try {
        await db.runAsync('DELETE FROM UserSessions WHERE id = ?', [userSessionId]);
    } catch (error) {
        console.error('Error deleting user session:', error);
        throw error;
    }
};
