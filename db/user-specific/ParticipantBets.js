import * as SQLite from 'expo-sqlite';

// Function to get all participant bets
export const getAllParticipantBets = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM ParticipantBets');
  return allRows;
};

// Function to get a participant bet
export const getParticipantBet = async (db, participantBetId) => {
  const participantBet = await db.getAsync('SELECT * FROM ParticipantBets WHERE id = ?', [participantBetId]);
  return participantBet;
};

// Function to insert a participant bet
export const insertParticipantBet = async (db, userId, bettingLineId, amount) => {
  const result = await db.runAsync('INSERT INTO ParticipantBets (userId, bettingLineId, amount) VALUES (?, ?, ?)', [userId, bettingLineId, amount]);
  return result.lastInsertRowId;
};

// Function to update a participant bet
export const updateParticipantBet = async (db, participantBetId, userId, bettingLineId, amount) => {
  await db.runAsync('UPDATE ParticipantBets SET userId = ?, bettingLineId = ?, amount = ? WHERE id = ?', [userId, bettingLineId, amount, participantBetId]);
};

// Function to delete a participant bet
export const deleteParticipantBet = async (db, participantBetId) => {
  await db.runAsync('DELETE FROM ParticipantBets WHERE id = ?', [participantBetId]);
};
