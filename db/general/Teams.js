import * as SQLite from 'expo-sqlite';

// Function to get all teams
export const getAllTeams = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM Teams');
    return allRows;
  } catch (error) {
    console.error('Error getting all teams:', error);
    throw error;
  }
};

// Function to get a team
export const getTeam = async (db, teamId) => {
  try {
    const team = await db.getAsync('SELECT * FROM Teams WHERE id = ?', [teamId]);
    return team;
  } catch (error) {
    console.error('Error getting team:', error);
    throw error;
  }
};

// Function to insert a team
export const insertTeam = async (db, teamName, abbreviation, leagueId) => {
  try {
    const result = await db.runAsync('INSERT INTO Teams (teamName, abbreviation, leagueId) VALUES (?, ?, ?, ?)', [teamName, abbreviation, leagueId]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting team:', error);
    throw error;
  }
};

// Function to update a team
export const updateTeam = async (db, teamId, teamName, abbreviation, leagueId) => {
  try {
    await db.runAsync('UPDATE Teams SET teamName = ?, abbreviation = ?, leagueId = ? WHERE id = ?', [teamName, abbreviation, leagueId, teamId]);
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

// Function to delete a team
export const deleteTeam = async (db, teamId) => {
  try {
    await db.runAsync('DELETE FROM Teams WHERE id = ?', [teamId]);
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};