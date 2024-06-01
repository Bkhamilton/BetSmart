import * as SQLite from 'expo-sqlite';

// Function to get a user's balance
export const getBalance = async (db, userId) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM Balance WHERE userID = ?', [userId]);
    return allRows;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

// Function to get a user's balance
export const getBalanceByUser = async (db, userId) => {
  try {
    const allRows = await db.getAllAsync('SELECT Balance.*, Bookies.name as bookieName FROM Balance JOIN Bookies ON Balance.bookieId = Bookies.id WHERE Balance.userID = ?', [userId]);
    return allRows;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

// Function to insert a balance
export const insertBalance = async (db, bookieId, balance, userId) => {
  try {
    const result = await db.runAsync('INSERT INTO Balance (bookieId, balance, userID) VALUES (?, ?, ?)', [bookieId, balance, userId]);
    console.log(result);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting balance:', error);
    throw error;
  }
};

// Function to update a balance
export const updateBalance = async (db, bookieId, balance, userId) => {
  try {
    await db.runAsync('UPDATE Balance SET balance = ? WHERE bookieId = ? AND userID = ?', [balance, bookieId, userId]);
    console.log("Balance updated");
  } catch (error) {
    console.error('Error updating balance:', error);
    throw error;
  }
};

// Function to delete a balance
export const deleteBalance = async (db, bookieId, userId) => {
  try {
    await db.runAsync('DELETE FROM Balance WHERE Bookie = ? AND UserID = ?', [bookie, userId]);
  } catch (error) {
    console.error('Error deleting balance:', error);
    throw error;
  }
};
