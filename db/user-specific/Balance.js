import * as SQLite from 'expo-sqlite';

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
