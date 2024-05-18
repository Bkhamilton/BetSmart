import * as SQLite from 'expo-sqlite';

// Function to get all bookies
export const getAllBookies = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Bookies');
        return allRows;
    } catch (error) {
        console.error('Error getting all bookies:', error);
    }
};

// Function to get a bookie
export const getBookies = async (db, userId) => {
    try {
        const bookie = await db.getAllAsync('SELECT * FROM Bookies WHERE userId = ?', [userId]);
        return bookie;
    } catch (error) {
        console.error('Error getting a bookie:', error);
    }
};

// Function to insert a bookie
export const insertBookie = async (db, name, description) => {
    try {
        const result = await db.runAsync('INSERT INTO Bookies (name, description) VALUES (?, ?)', [name, description]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting a bookie:', error);
    }
};

// Function to update a bookie
export const updateBookie = async (db, bookieId, name, description) => {
    try {
        await db.runAsync('UPDATE Bookies SET name = ?, description = ? WHERE id = ?', [name, description, bookieId]);
    } catch (error) {
        console.error('Error updating a bookie:', error);
    }
};

// Function to delete a bookie
export const deleteBookie = async (db, bookieId) => {
    try {
        await db.runAsync('DELETE FROM Bookies WHERE id = ?', [bookieId]);
    } catch (error) {
        console.error('Error deleting a bookie:', error);
    }
};