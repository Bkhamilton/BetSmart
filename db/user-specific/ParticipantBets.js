import * as SQLite from 'expo-sqlite';

// Function to get all participant bets
export const getAllParticipantBets = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM ParticipantBets');
    return allRows;
  } catch (error) {
    console.error('Error getting all participant bets:', error);
    throw error;
  }
};

// Function to get a participant bet
export const getParticipantBet = async (db, participantBetId) => {
  try {
    const participantBet = await db.getAsync('SELECT * FROM ParticipantBets WHERE id = ?', [participantBetId]);
    return participantBet;
  } catch (error) {
    console.error('Error getting participant bet:', error);
    throw error;
  }
};

// Function to insert a participant bet
export const insertParticipantBet = async (db, userId, bettingLineId, amount) => {
  try {
    const result = await db.runAsync('INSERT INTO ParticipantBets (userId, bettingLineId, amount) VALUES (?, ?, ?)', [userId, bettingLineId, amount]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting participant bet:', error);
    throw error;
  }
};

// Function to update a participant bet
export const updateParticipantBet = async (db, participantBetId, userId, bettingLineId, amount) => {
  try {
    await db.runAsync('UPDATE ParticipantBets SET userId = ?, bettingLineId = ?, amount = ? WHERE id = ?', [userId, bettingLineId, amount, participantBetId]);
  } catch (error) {
    console.error('Error updating participant bet:', error);
    throw error;
  }
};

// Function to delete a participant bet
export const deleteParticipantBet = async (db, participantBetId) => {
  try {
    await db.runAsync('DELETE FROM ParticipantBets WHERE id = ?', [participantBetId]);
  } catch (error) {
    console.error('Error deleting participant bet:', error);
    throw error;
  }
};
