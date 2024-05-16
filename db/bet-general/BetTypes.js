import * as SQLite from 'expo-sqlite';

// Function to get all bet types
export const getAllBetTypes = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BetTypes');
  return allRows;
};

// Function to get a bet type
export const getBetType = async (db, betTypeId) => {
  const betType = await db.getAsync('SELECT * FROM BetTypes WHERE id = ?', [betTypeId]);
  return betType;
};

// Function to insert a bet type
export const insertBetType = async (db, betType, description) => {
  const result = await db.runAsync('INSERT INTO BetTypes (betType, description) VALUES (?, ?)', [betType, description]);
  return result.lastInsertRowId;
};

// Function to update a bet type
export const updateBetType = async (db, betTypeId, betType, description) => {
  await db.runAsync('UPDATE BetTypes SET betType = ?, description = ? WHERE id = ?', [betType, description, betTypeId]);
};

// Function to delete a bet type
export const deleteBetType = async (db, betTypeId) => {
  await db.runAsync('DELETE FROM BetTypes WHERE id = ?', [betTypeId]);
};
