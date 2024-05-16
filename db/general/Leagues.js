import * as SQLite from 'expo-sqlite';

// Function to get all leagues
export const getAllLeagues = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM Leagues');
  return allRows;
};

// Function to get a league
export const getLeague = async (db, leagueId) => {
  const league = await db.getAsync('SELECT * FROM Leagues WHERE id = ?', [leagueId]);
  return league;
};

// Function to insert a league
export const insertLeague = async (db, leagueName, sport, description) => {
  const result = await db.runAsync('INSERT INTO Leagues (leagueName, sport, description) VALUES (?, ?, ?)', [leagueName, sport, description]);
  return result.lastInsertRowId;
};

// Function to update a league
export const updateLeague = async (db, leagueId, leagueName, sport, description) => {
  await db.runAsync('UPDATE Leagues SET leagueName = ?, sport = ?, description = ? WHERE id = ?', [leagueName, sport, description, leagueId]);
};

// Function to delete a league
export const deleteLeague = async (db, leagueId) => {
  await db.runAsync('DELETE FROM Leagues WHERE id = ?', [leagueId]);
};
