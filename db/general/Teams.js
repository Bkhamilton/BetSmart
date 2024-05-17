import * as SQLite from 'expo-sqlite';

// Function to get all teams
export const getAllTeams = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM Teams');
  return allRows;
};

// Function to get a team
export const getTeam = async (db, teamId) => {
  const team = await db.getAsync('SELECT * FROM Teams WHERE id = ?', [teamId]);
  return team;
};

// Function to insert a team
export const insertTeam = async (db, teamName, abbreviation, leagueId) => {
  const result = await db.runAsync('INSERT INTO Teams (teamName, abbreviation, leagueId) VALUES (?, ?, ?, ?)', [teamName, abbreviation, leagueId]);
  return result.lastInsertRowId;
};

// Function to update a team
export const updateTeam = async (db, teamId, teamName, abbreviation, leagueId) => {
  await db.runAsync('UPDATE Teams SET teamName = ?, abbreviation = ?, leagueId = ? WHERE id = ?', [teamName, abbreviation, leagueId, teamId]);
};

// Function to delete a team
export const deleteTeam = async (db, teamId) => {
  await db.runAsync('DELETE FROM Teams WHERE id = ?', [teamId]);
};