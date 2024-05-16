import * as SQLite from 'expo-sqlite';

// Function to get all legs
export const getAllLegs = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM Legs');
  return allRows;
};

// Function to get a leg
export const getLeg = async (db, legId) => {
  const leg = await db.getAsync('SELECT * FROM Legs WHERE id = ?', [legId]);
  return leg;
};

// Function to insert a leg
export const insertLeg = async (db, participantBetId, result) => {
  const result = await db.runAsync('INSERT INTO Legs (participantBetId, result) VALUES (?, ?)', [participantBetId, result]);
  return result.lastInsertRowId;
};

// Function to update a leg
export const updateLeg = async (db, legId, participantBetId, result) => {
  await db.runAsync('UPDATE Legs SET participantBetId = ?, result = ? WHERE id = ?', [participantBetId, result, legId]);
};

// Function to delete a leg
export const deleteLeg = async (db, legId) => {
  await db.runAsync('DELETE FROM Legs WHERE id = ?', [legId]);
};
