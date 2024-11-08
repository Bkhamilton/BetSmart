import * as SQLite from 'expo-sqlite';

// Function to get all leagues
export const getAllLeagues = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM Leagues');
    return allRows;
  } catch (error) {
    console.error('Error getting all leagues:', error);
    throw error;
  }
};

// Function to get all active leagues - leagues with active seasons
export const getActiveLeagues = async (db, date) => {
  try {
    const leagues = await db.getAllAsync(`
      SELECT DISTINCT Leagues.* 
      FROM Leagues 
      JOIN Seasons ON Leagues.id = Seasons.leagueId 
      WHERE Seasons.startDate <= ? AND Seasons.endDate >= ?
    `, [date, date]);
    return leagues;
  } catch (error) {
    console.error('Error getting active leagues:', error);
    throw error;
  }
};

// Function to get all active leagues - leagues with active seasons
export const getActiveLeagueNames = async (db, date) => {
  try {
    const leagues = await db.getAllAsync(`
      SELECT DISTINCT Leagues.leagueName 
      FROM Leagues 
      JOIN Seasons ON Leagues.id = Seasons.leagueId 
      WHERE Seasons.startDate <= ? AND Seasons.endDate >= ?
    `, [date, date]);
    return leagues.map(league => league.leagueName);
  } catch (error) {
    console.error('Error getting active leagues:', error);
    throw error;
  }
};

// Function to get a league
export const getLeague = async (db, leagueId) => {
  try {
    const league = await db.getAsync('SELECT * FROM Leagues WHERE id = ?', [leagueId]);
    return league;
  } catch (error) {
    console.error('Error getting league:', error);
    throw error;
  }
};

// Function to get a league by name
export const getLeagueByName = async (db, leagueName) => {
  try {
    const league = await db.getAllAsync('SELECT * FROM Leagues WHERE leagueName = ?', [leagueName.toUpperCase()]);
    return league[0];
  } catch (error) {
    console.error('Error getting league:', error);
    throw error;
  }
};

// Function to get the league from a gameId (Joined with Seasons Table and Leagues Table)
export const getLeagueByGameId = async (db, gameId) => {
  try {
    const league = await db.getAllAsync(`
      SELECT 
        Leagues.leagueName 
      FROM 
        Leagues 
      JOIN 
        Seasons ON Leagues.id = Seasons.leagueId 
      JOIN 
        Games ON Seasons.id = Games.seasonId 
      WHERE 
        Games.gameId = ?
    `, [gameId]);
    return league[0];
  } catch (error) {
    console.error('Error getting league by gameId:', error);
    throw error;
  }
};

// Function to insert a league
export const insertLeague = async (db, leagueName, sport, description) => {
  try {
    const result = await db.runAsync('INSERT INTO Leagues (leagueName, sport, description) VALUES (?, ?, ?)', [leagueName, sport, description]);
    console.log('Inserted league:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting league:', error);
    throw error;
  }
};

// Function to update a league
export const updateLeague = async (db, leagueId, leagueName, sport, description) => {
  try {
    await db.runAsync('UPDATE Leagues SET leagueName = ?, sport = ?, description = ? WHERE id = ?', [leagueName, sport, description, leagueId]);
  } catch (error) {
    console.error('Error updating league:', error);
    throw error;
  }
};

// Function to delete a league
export const deleteLeague = async (db, leagueId) => {
  try {
    await db.runAsync('DELETE FROM Leagues WHERE id = ?', [leagueId]);
  } catch (error) {
    console.error('Error deleting league:', error);
    throw error;
  }
};
