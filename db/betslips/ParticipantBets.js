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
        Teams2.abbreviation as awayTeamAbv,
        Seasons.leagueId,
        Leagues.leagueName as league
      FROM ParticipantBets
      JOIN 
        Games ON ParticipantBets.gameId = Games.gameId
      JOIN 
        Teams ON Games.homeTeamId = Teams.id 
      JOIN 
        Teams as Teams2 ON Games.awayTeamId = Teams2.id
      JOIN
        Seasons ON Games.seasonId = Seasons.id
      JOIN
        Leagues ON Seasons.leagueId = Leagues.id
      WHERE betSlipId IN (${placeholders})
    `;

    const allRows = await db.getAllAsync(query, betSlipIds);
    return allRows;
  } catch (error) {
    console.error('Error getting all valid participant bets:', error);
    throw error;
  }
};

// Function to get count for participant bets by leagueName and return the highest count row
export const getFavoriteLeague = async (db, userId) => {
  try {
    const favoriteLeague = await db.getAllAsync(`
      SELECT 
        COUNT(*) as count,
        Leagues.leagueName as name
      FROM 
        ParticipantBets
      JOIN 
        Games ON ParticipantBets.gameId = Games.gameId
      JOIN 
        Seasons ON Games.seasonId = Seasons.id
      JOIN 
        Leagues ON Seasons.leagueId = Leagues.id
      JOIN
        BetSlips ON ParticipantBets.betSlipId = BetSlips.id
      WHERE 
        BetSlips.userId = ?
      GROUP BY 
        Leagues.leagueName
      ORDER BY 
        count DESC
    `, [userId]);
    return favoriteLeague[0];
  } catch (error) {
    console.error('Error getting participant bet count by league:', error);
    throw error;
  }
};

// Function to get the favorite team to bet on for a given user
export const getFavoriteTeam = async (db, userId) => {
  try {
    const favoriteTeam = await db.getAllAsync(`
      SELECT 
        COUNT(*) as count,
        Teams.abbreviation as name,
        Teams.logoUrl as logoUrl
      FROM 
        ParticipantBets
      JOIN 
        Games ON ParticipantBets.gameId = Games.gameId
      JOIN 
        Teams ON Games.homeTeamId = Teams.id OR Games.awayTeamId = Teams.id
      JOIN
        BetSlips ON ParticipantBets.betSlipId = BetSlips.id
      WHERE 
        BetSlips.userId = ?
      GROUP BY 
        Teams.abbreviation,
        Teams.logoUrl
      ORDER BY 
        count DESC
    `, [userId]);
    return favoriteTeam[0];
  } catch (error) {
    console.error('Error getting favorite team to bet on:', error);
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

// Function to get all bets for a given array of betSlipIds
export const getBetsByBetSlipIds = async (db, betSlipIds) => {
  try {
    // Construct placeholders for the array elements
    const placeholders = betSlipIds.map(() => '?').join(',');

    // Construct the SQL query
    const query = `
      SELECT 
        * 
      FROM 
        ParticipantBets 
      WHERE 
        betSlipId IN (${placeholders})
    `;

    const allRows = await db.getAllAsync(query, betSlipIds);
    return allRows;
  } catch (error) {
    console.error('Error getting bets by betSlipIds:', error);
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

// Function to delete participant bets by participantBetIds
export const deleteBetsByBetSlipId = async (db, betSlipId) => {
  try {
    await db.runAsync('DELETE FROM ParticipantBets WHERE betSlipId = ?', [betSlipId]);
  } catch (error) {
    console.error('Error deleting participant bets by betSlipId:', error);
    throw error;
  }
}

// Function to delete participant bets by participantBetIds
export const deleteBetsByBetSlipIds = async (db, betSlipIds) => {
  try {
    const placeholders = betSlipIds.map(() => '?').join(',');
    await db.runAsync(`DELETE FROM ParticipantBets WHERE betSlipId IN (${placeholders})`, betSlipIds);
  } catch (error) {
    console.error('Error deleting participant bets by betSlipIds:', error);
    throw error;
  }
};

// Function to clear all participant bets
export const clearParticipantBets = async (db, userId) => {
  try {
    await db.runAsync('DELETE FROM ParticipantBets WHERE betSlipId IN (SELECT id FROM BetSlips WHERE userId = ?)', [userId]);
  } catch (error) {
    console.error('Error clearing participant bets:', error);
    throw error;
  }
};