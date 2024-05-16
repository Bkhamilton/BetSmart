import * as SQLite from 'expo-sqlite';

// Function to get all seasons
export const getAllSeasons = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM Seasons');
  return allRows;
};

// Function to get a season
export const getSeason = async (db, seasonId) => {
  const season = await db.getAsync('SELECT * FROM Seasons WHERE id = ?', [seasonId]);
  return season;
};

// Function to insert a season
export const insertSeason = async (db, leagueId, season, games) => {
  const result = await db.runAsync('INSERT INTO Seasons (leagueId, season, games) VALUES (?, ?, ?)', [leagueId, season, games]);
  return result.lastInsertRowId;
};

// Function to update a season
export const updateSeason = async (db, seasonId, leagueId, season, games) => {
  await db.runAsync('UPDATE Seasons SET leagueId = ?, season = ?, games = ? WHERE id = ?', [leagueId, season, games, seasonId]);
};

// Function to delete a season
export const deleteSeason = async (db, seasonId) => {
  await db.runAsync('DELETE FROM Seasons WHERE id = ?', [seasonId]);
};
