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

// Function to get all ParticipantBets for a given array of betSlipIds
export const getAllValidParticipantBets = async (db, betSlipIds) => {
  try {
    // Construct placeholders for the array elements
    const placeholders = betSlipIds.map(() => '?').join(',');

    // Construct the SQL query
    const query = `
      SELECT 
        ParticipantBets.*, 
        Games.gameId, 
        Games.seasonId, 
        Games.date, 
        Games.timestamp,
        Teams.teamName as homeTeamName, 
        Teams.abbreviation as homeTeamAbv, 
        Teams2.teamName as awayTeamName, 
        Teams2.abbreviation as awayTeamAbv   
      FROM ParticipantBets
      JOIN 
        Games ON ParticipantBets.gameId = Games.gameId
      JOIN 
        Teams ON Games.homeTeamId = Teams.id 
      JOIN 
        Teams as Teams2 ON Games.awayTeamId = Teams2.id  
      WHERE betSlipId IN (${placeholders})
    `;

    const allRows = await db.getAllAsync(query, betSlipIds);
    return allRows;
  } catch (error) {
    console.error('Error getting all valid participant bets:', error);
    throw error;
  }
};

// Function to get a participant bet
export const getParticipantBet = async (db, participantBetId) => {
  try {
    const participantBet = await db.getAllAsync('SELECT * FROM ParticipantBets WHERE id = ?', [participantBetId]);
    return participantBet;
  } catch (error) {
    console.error('Error getting participant bet:', error);
    throw error;
  }
};

// Function to insert a participant bet
export const insertParticipantBet = async (db, betSlipId, gameId, odds) => {
  try {
    const result = await db.runAsync('INSERT INTO ParticipantBets (betSlipId, gameId, odds) VALUES (?, ?, ?)', [betSlipId, gameId, odds]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting participant bet:', error);
    throw error;
  }
};

// Function to update a participant bet
export const updateParticipantBet = async (db, participantBetId, betSlipId, gameId, odds) => {
  try {
    await db.runAsync('UPDATE ParticipantBets SET betSlipId = ?, gameId = ?, odds = ? WHERE id = ?', [betSlipId, gameId, odds, participantBetId]);
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
