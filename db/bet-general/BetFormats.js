import * as SQLite from 'expo-sqlite';

// Function to get all bet formats
export const getAllBetFormats = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BetFormats');
  return allRows;
};

// Function to get a bet format
export const getBetFormat = async (db, betFormatId) => {
  const betFormat = await db.getAsync('SELECT * FROM BetFormats WHERE id = ?', [betFormatId]);
  return betFormat;
};

// Function to insert a bet format
export const insertBetFormat = async (db, formatName, description) => {
  const result = await db.runAsync('INSERT INTO BetFormats (formatName, description) VALUES (?, ?)', [formatName, description]);
  return result.lastInsertRowId;
};

// Function to update a bet format
export const updateBetFormat = async (db, betFormatId, formatName, description) => {
  await db.runAsync('UPDATE BetFormats SET formatName = ?, description = ? WHERE id = ?', [formatName, description, betFormatId]);
};

// Function to delete a bet format
export const deleteBetFormat = async (db, betFormatId) => {
  await db.runAsync('DELETE FROM BetFormats WHERE id = ?', [betFormatId]);
};
