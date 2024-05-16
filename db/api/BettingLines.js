import * as SQLite from 'expo-sqlite';

// Function to get all betting lines
export const getAllBettingLines = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BettingLines');
  return allRows;
};

// Function to get a betting line
export const getBettingLine = async (db, bettingLineId) => {
  const bettingLine = await db.getAsync('SELECT * FROM BettingLines WHERE id = ?', [bettingLineId]);
  return bettingLine;
};

// Function to insert a betting line
export const insertBettingLine = async (db, betTargetId, betTypeId, betFormatId, odds) => {
  const result = await db.runAsync('INSERT INTO BettingLines (betTargetId, betTypeId, betFormatId, odds) VALUES (?, ?, ?, ?)', [betTargetId, betTypeId, betFormatId, odds]);
  return result.lastInsertRowId;
};

// Function to update a betting line
export const updateBettingLine = async (db, bettingLineId, betTargetId, betTypeId, betFormatId, odds) => {
  await db.runAsync('UPDATE BettingLines SET betTargetId = ?, betTypeId = ?, betFormatId = ?, odds = ? WHERE id = ?', [betTargetId, betTypeId, betFormatId, odds, bettingLineId]);
};

// Function to delete a betting line
export const deleteBettingLine = async (db, bettingLineId) => {
  await db.runAsync('DELETE FROM BettingLines WHERE id = ?', [bettingLineId]);
};
