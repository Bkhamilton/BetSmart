import * as SQLite from 'expo-sqlite';

// Function to get all users
export const getAllUsers = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Users');
        return allRows;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

// Function to get a user by uysername and password
export const getUser = async (db, username, password) => {
    try {
        const user = await db.getAllAsync('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password]);
        return user[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

// Function to get a user by ID
export const getUserById = async (db, id) => {
    try {
        const user = await db.getAllAsync('SELECT * FROM Users WHERE id = ?', [id]);
        return user[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

// Function to insert a user
export const insertUser = async (db, name, email, username, password) => {
    try {
        const result = await db.runAsync('INSERT INTO Users (name, email, username, password) VALUES (?, ?, ?, ?)', [name, email, username, password]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
};

// Function to update a user
export const updateUser = async (db, id, name, email, username, password) => {
    try {
        await db.runAsync('UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE id = ?', [name, email, username, password, id]);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Function to update user info using user object
export const updateUserInfo = async (db, user) => {
    try {
        await db.runAsync('UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?', [user.name, user.username, user.email, user.id]);
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
}

// Function to update a user's password
export const updateUserPassword = async (db, id, password) => {
    try {
        await db.runAsync('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
    }
};

// Function to delete a user
export const deleteUser = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
