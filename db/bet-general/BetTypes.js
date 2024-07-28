import * as SQLite from 'expo-sqlite';

// Function to get all bet types
export const getAllBetTypes = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM BetTypes');
    return allRows;
  } catch (error) {
    console.error('Error in getAllBetTypes:', error);
    throw error;
  }
};

// Function to get a bet type
export const getBetType = async (db, betType) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM BetTypes WHERE betType = ?', [betType]);
    return result[0];
  } catch (error) {
    console.error('Error in getBetType:', error);
    throw error;
  }
};

// Function to insert a bet type
export const insertBetType = async (db, betType, description) => {
  try {
    const result = await db.runAsync('INSERT INTO BetTypes (betType, description) VALUES (?, ?)', [betType, description]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error in insertBetType:', error);
    throw error;
  }
};

// Function to update a bet type
export const updateBetType = async (db, betTypeId, betType, description) => {
  try {
    await db.runAsync('UPDATE BetTypes SET betType = ?, description = ? WHERE id = ?', [betType, description, betTypeId]);
  } catch (error) {
    console.error('Error in updateBetType:', error);
    throw error;
  }
};

// Function to delete a bet type
export const deleteBetType = async (db, betTypeId) => {
  try {
    await db.runAsync('DELETE FROM BetTypes WHERE id = ?', [betTypeId]);
  } catch (error) {
    console.error('Error in deleteBetType:', error);
    throw error;
  }
};
