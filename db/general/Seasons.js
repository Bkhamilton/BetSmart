import * as SQLite from 'expo-sqlite';

// Function to get all seasons
export const getAllSeasons = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM Seasons');
    return allRows;
  } catch (error) {
    console.error('Error in getAllSeasons:', error);
    throw error;
  }
};

// Function to get a season
export const getSeason = async (db, seasonId) => {
  try {
    const season = await db.getAllAsync('SELECT * FROM Seasons WHERE id = ?', [seasonId]);
    return season;
  } catch (error) {
    console.error('Error in getSeason:', error);
    throw error;
  }
};

// Function to get all seasons for a league
export const getSeasonsByLeague = async (db, leagueId) => {
  try {
    const seasons = await db.getAllAsync('SELECT * FROM Seasons WHERE leagueId = ?', [leagueId]);
    return seasons;
  } catch (error) {
    console.error('Error in getSeasonsByLeague:', error);
    throw error;
  }
};

// Function to get season active during a given date
export const getSeasonByDate = async (db, leagueId, date) => {
  try {
    const season = await db.getAllAsync('SELECT * FROM Seasons WHERE leagueId = ? AND startDate <= ? AND endDate >= ?', [leagueId, date, date]);
    return season[0];
  } catch (error) {
    console.error('Error in getSeasonByDate:', error);
    throw error;
  }
};

// Function to get most current season for a given league
export const getCurrentSeason = async (db, leagueId) => {
  try {
    const season = await db.getAllAsync('SELECT * FROM Seasons WHERE leagueId = ? ORDER BY startDate DESC LIMIT 1', [leagueId]);
    return season[0];
  } catch (error) {
    console.error('Error in getCurrentSeason:', error);
    throw error;
  }
};

// Function to insert a season
export const insertSeason = async (db, leagueId, season, games, description, seasonType, startDate, endDate) => {
  try {
    const result = await db.runAsync('INSERT INTO Seasons (leagueId, season, games, description, seasonType, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)', [leagueId, season, games, description, seasonType, startDate, endDate]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error in insertSeason:', error);
    throw error;
  }
};

// Function to update a season
export const updateSeason = async (db, seasonId, leagueId, season, games, description, seasonType, startDate, endDate) => {
  try {
    const result = await db.runAsync('UPDATE Seasons SET leagueId = ?, season = ?, games = ?, description = ?, seasonType = ?, startDate = ?, endDate = ? WHERE id = ?', [leagueId, season, games, description, seasonType, startDate, endDate, seasonId]);
    return result.changes;
  } catch (error) {
    console.error('Error in updateSeason:', error);
    throw error;
  }
};

// Function to delete a season
export const deleteSeason = async (db, seasonId) => {
  try {
    await db.runAsync('DELETE FROM Seasons WHERE id = ?', [seasonId]);
  } catch (error) {
    console.error('Error in deleteSeason:', error);
    throw error;
  }
};
