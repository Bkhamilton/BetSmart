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

// Function to get all Legs for a given array of participantBetIds
export const getAllValidLegs = async (db, participantBetIds) => {
  try {
    const idString = participantBetIds.join(', ');
    const allRows = await db.getAllAsync('SELECT * FROM Legs WHERE participantBetId IN (?)', [idString]);
    return allRows;
  } catch (error) {
    console.error('Error getting all legs for participant bets:', error);
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
export const insertLeg = async (db, participantBetId, betMarketId, betTypeId) => {
  try {
    const resultDB = await db.runAsync('INSERT INTO Legs (participantBetId, betMarketId, betTypeId) VALUES (?, ?, ?)', [participantBetId, betMarketId, betTypeId]);
    return resultDB.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting leg:', error);
    throw error;
  }
};

// Function to update a leg
export const updateLeg = async (db, legId, participantBetId, betMarketId, betTypeId) => {
  try {
    await db.runAsync('UPDATE Legs SET participantBetId = ?, betMarketId = ?, betTypeId = ? WHERE id = ?', [participantBetId, betMarketId, betTypeId, legId]);
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
