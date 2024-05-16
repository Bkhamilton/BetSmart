import * as SQLite from 'expo-sqlite';

// Function to get all bet targets
export const getAllBetTargets = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BetTargets');
  return allRows;
};

// Function to get a bet target
export const getBetTarget = async (db, betTargetId) => {
  const betTarget = await db.getAsync('SELECT * FROM BetTargets WHERE id = ?', [betTargetId]);
  return betTarget;
};

// Function to insert a bet target
export const insertBetTarget = async (db, targetType, targetName, teamId) => {
  const result = await db.runAsync('INSERT INTO BetTargets (targetType, targetName, teamId) VALUES (?, ?, ?)', [targetType, targetName, teamId]);
  return result.lastInsertRowId;
};

// Function to update a bet target
export const updateBetTarget = async (db, betTargetId, targetType, targetName, teamId) => {
  await db.runAsync('UPDATE BetTargets SET targetType = ?, targetName = ?, teamId = ? WHERE id = ?', [targetType, targetName, teamId, betTargetId]);
};

// Function to delete a bet target
export const deleteBetTarget = async (db, betTargetId) => {
  await db.runAsync('DELETE FROM BetTargets WHERE id = ?', [betTargetId]);
};
