import * as SQLite from 'expo-sqlite';

export const initializeDatabase = async (db) => {

};

// Function to create the database and tables
export const createTables = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Username TEXT NOT NULL, Password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS balance (Bookie TEXT PRIMARY KEY NOT NULL, Balance REAL NOT NULL, UserID INTEGER, FOREIGN KEY(UserID) REFERENCES users(Id));
  `);
};

// Function to get a user's balance
export const getBalance = async (db, userId) => {
  const allRows = await db.getAllAsync('SELECT * FROM balance WHERE UserID = ?', [userId]);
  return allRows;
};

// Function to insert a balance
export const insertBalance = async (db, bookie, balance, userId) => {
  const result = await db.runAsync('INSERT INTO balance (Bookie, Balance, UserID) VALUES (?, ?, ?)', [bookie, balance, userId]);
  console.log(result);
  return result.lastInsertRowId;
};

// Function to update a balance
export const updateBalance = async (db, bookie, balance, userId) => {
  await db.runAsync('UPDATE balance SET Balance = ? WHERE Bookie = ? AND UserID = ?', [balance, bookie, userId]);
  console.log("Balance updated");
};

// Function to delete a balance
export const deleteBalance = async (db, bookie, userId) => {
  await db.runAsync('DELETE FROM balance WHERE Bookie = ? AND UserID = ?', [bookie, userId]);
};

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