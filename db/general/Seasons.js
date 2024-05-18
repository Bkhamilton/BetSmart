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
    const season = await db.getAsync('SELECT * FROM Seasons WHERE id = ?', [seasonId]);
    return season;
  } catch (error) {
    console.error('Error in getSeason:', error);
    throw error;
  }
};

// Function to insert a season
export const insertSeason = async (db, leagueId, season, games) => {
  try {
    const result = await db.runAsync('INSERT INTO Seasons (leagueId, season, games) VALUES (?, ?, ?)', [leagueId, season, games]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error in insertSeason:', error);
    throw error;
  }
};

// Function to update a season
export const updateSeason = async (db, seasonId, leagueId, season, games) => {
  try {
    await db.runAsync('UPDATE Seasons SET leagueId = ?, season = ?, games = ? WHERE id = ?', [leagueId, season, games, seasonId]);
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
