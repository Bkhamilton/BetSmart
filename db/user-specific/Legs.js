import * as SQLite from 'expo-sqlite';

// Function to get all legs
export const getAllLegs = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM Legs');
    return allRows;
  } catch (error) {
    console.error('Error getting all legs:', error);
    throw error;
  }
};

// Function to get a leg
export const getLeg = async (db, legId) => {
  try {
    const leg = await db.getAsync('SELECT * FROM Legs WHERE id = ?', [legId]);
    return leg;
  } catch (error) {
    console.error('Error getting leg:', error);
    throw error;
  }
};

// Function to insert a leg
export const insertLeg = async (db, participantBetId, result) => {
  try {
    const resultDB = await db.runAsync('INSERT INTO Legs (participantBetId, result) VALUES (?, ?)', [participantBetId, result]);
    return resultDB.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting leg:', error);
    throw error;
  }
};

// Function to update a leg
export const updateLeg = async (db, legId, participantBetId, result) => {
  try {
    await db.runAsync('UPDATE Legs SET participantBetId = ?, result = ? WHERE id = ?', [participantBetId, result, legId]);
  } catch (error) {
    console.error('Error updating leg:', error);
    throw error;
  }
};

// Function to delete a leg
export const deleteLeg = async (db, legId) => {
  try {
    await db.runAsync('DELETE FROM Legs WHERE id = ?', [legId]);
  } catch (error) {
    console.error('Error deleting leg:', error);
    throw error;
  }
};
