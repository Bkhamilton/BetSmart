import * as SQLite from 'expo-sqlite';

// Function to get all users
export const getAllUsers = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM users');
  return allRows;
};

// Function to get a user
export const getUser = async (db, username) => {
  const user = await db.getAsync('SELECT * FROM users WHERE Username = ?', [username]);
  return user;
};

// Function to insert a user
export const insertUser = async (db, name, username, password) => {
  const result = await db.runAsync('INSERT INTO users (Name, Username, Password) VALUES (?, ?, ?)', [name, username, password]);
  return result.lastInsertRowId;
};

// Function to update a user
export const updateUser = async (db, id, name, username, password) => {
  await db.runAsync('UPDATE users SET Name = ?, Username = ?, Password = ? WHERE Id = ?', [name, username, password, id]);
};

// Function to delete a user
export const deleteUser = async (db, id) => {
  await db.runAsync('DELETE FROM users WHERE Id = ?', [id]);
};
