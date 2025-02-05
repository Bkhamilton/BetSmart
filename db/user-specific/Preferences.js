import * as SQLite from 'expo-sqlite';

// Function to get a user's preferences
export const getPreferences = async (db, userId) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Preferences WHERE userId = ?', [userId]);
        const preferences = {};
        allRows.forEach(row => {
            preferences[row.preferenceName] = row.preferenceValue;
        });
        return preferences;
    } catch (error) {
        console.error('Error getting preferences:', error);
        throw error;
    }
};

// Function to insert a preference
export const insertPreference = async (db, userId, preferenceName, preferenceValue) => {
    try {
        const result = await db.runAsync('INSERT INTO Preferences (userId, preferenceName, preferenceValue) VALUES (?, ?, ?)', [userId, preferenceName, preferenceValue]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting preference:', error);
        throw error;
    }
};

// Function to update a preference
export const updatePreference = async (db, preferenceId, preferenceName, preferenceValue) => {
    try {
        await db.runAsync('UPDATE Preferences SET preferenceName = ?, preferenceValue = ? WHERE id = ?', [preferenceName, preferenceValue, preferenceId]);
        console.log("Preference updated");
    } catch (error) {
        console.error('Error updating preference:', error);
        throw error;
    }
};

// Function to delete a preference
export const deletePreference = async (db, preferenceId) => {
    try {
        await db.runAsync('DELETE FROM Preferences WHERE id = ?', [preferenceId]);
    } catch (error) {
        console.error('Error deleting preference:', error);
        throw error;
    }
};

// Function to clear all preferences for a user
export const clearUserPreferences = async (db, userId) => {
    try {
        await db.runAsync('DELETE FROM Preferences WHERE userId = ?', [userId]);
    } catch (error) {
        console.error('Error clearing user preferences:', error);
        throw error;
    }
}