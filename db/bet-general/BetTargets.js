import * as SQLite from 'expo-sqlite';

// Function to get all bet targets
export const getAllBetTargets = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM BetTargets');
    return allRows;
  } catch (error) {
    console.error('Error getting all bet targets:', error);
    throw error;
  }
};

// Function to get a bet target
export const getBetTarget = async (db, betTargetId) => {
  try {
    const betTarget = await db.getAllAsync('SELECT * FROM BetTargets WHERE id = ?', [betTargetId]);
    return betTarget;
  } catch (error) {
    console.error('Error getting bet target:', error);
    throw error;
  }
};

// Function to get bet target ID by name
export const getBetTargetId = async (db, targetName) => {
  try {
    const betTarget = await db.getAllAsync('SELECT * FROM BetTargets WHERE targetName = ?', [targetName]);
    return betTarget[0];
  } catch (error) {
    console.error('Error getting bet target ID by name:', error);
    throw error;
  }
};

// Function to insert a bet target
export const insertBetTarget = async (db, targetType, targetName, teamId) => {
  try {
    const result = await db.runAsync('INSERT INTO BetTargets (targetType, targetName, teamId) VALUES (?, ?, ?)', [targetType, targetName, teamId]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting bet target:', error);
    throw error;
  }
};

// Function to update a bet target
export const updateBetTarget = async (db, betTargetId, targetType, targetName, teamId) => {
  try {
    await db.runAsync('UPDATE BetTargets SET targetType = ?, targetName = ?, teamId = ? WHERE id = ?', [targetType, targetName, teamId, betTargetId]);
  } catch (error) {
    console.error('Error updating bet target:', error);
    throw error;
  }
};

// Function to delete a bet target
export const deleteBetTarget = async (db, betTargetId) => {
  try {
    await db.runAsync('DELETE FROM BetTargets WHERE id = ?', [betTargetId]);
  } catch (error) {
    console.error('Error deleting bet target:', error);
    throw error;
  }
};
