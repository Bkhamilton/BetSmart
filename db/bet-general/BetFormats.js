import * as SQLite from 'expo-sqlite';

// Function to get all bet formats
export const getAllBetFormats = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM BetFormats');
    return allRows;
  } catch (error) {
    console.error('Error getting all bet formats:', error);
    throw error;
  }
};

// Function to get a bet format
export const getBetFormat = async (db, betFormatId) => {
  try {
    const betFormat = await db.getAsync('SELECT * FROM BetFormats WHERE id = ?', [betFormatId]);
    return betFormat;
  } catch (error) {
    console.error('Error getting bet format:', error);
    throw error;
  }
};

// Function to insert a bet format
export const insertBetFormat = async (db, formatName, description) => {
  try {
    const result = await db.runAsync('INSERT INTO BetFormats (formatName, description) VALUES (?, ?)', [formatName, description]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting bet format:', error);
    throw error;
  }
};

// Function to update a bet format
export const updateBetFormat = async (db, betFormatId, formatName, description) => {
  try {
    await db.runAsync('UPDATE BetFormats SET formatName = ?, description = ? WHERE id = ?', [formatName, description, betFormatId]);
  } catch (error) {
    console.error('Error updating bet format:', error);
    throw error;
  }
};

// Function to delete a bet format
export const deleteBetFormat = async (db, betFormatId) => {
  try {
    await db.runAsync('DELETE FROM BetFormats WHERE id = ?', [betFormatId]);
  } catch (error) {
    console.error('Error deleting bet format:', error);
    throw error;
  }
};
