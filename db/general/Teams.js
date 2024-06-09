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

// Function to get all teams for each league
export const getTeamsByLeague = async (db, leagueId) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM Teams WHERE leagueId = ?', [leagueId]);
    return allRows;
  } catch (error) {
    console.error('Error getting all teams:', error);
    throw error;
  }
};

// Function to get team IDs by team names
export const getTeamIds = async (db, teamNames) => {
  try {
      const placeholders = teamNames.map(() => '?').join(',');
      const query = `SELECT id, teamName FROM Teams WHERE teamName IN (${placeholders})`;
      const allRows = await db.getAllAsync(query, teamNames);
      return allRows;
  } catch (error) {
      console.error('Error in getTeamIds:', error);
      throw error;
  }
};

// Function to get a team
export const getTeam = async (db, teamId) => {
  try {
    const team = await db.getAllAsync('SELECT * FROM Teams WHERE id = ?', [teamId]);
    return team;
  } catch (error) {
    console.error('Error getting team:', error);
    throw error;
  }
};

// Function to get a team by team name
export const getTeamByName = async (db, teamName) => {
  try {
    const team = await db.getAllAsync('SELECT * FROM Teams WHERE teamName = ?', [teamName]);
    return team;
  } catch (error) {
    console.error('Error getting team:', error);
    throw error;
  }
};

// Function to insert a team
export const insertTeam = async (db, teamName, abbreviation, leagueId) => {
  try {
    const result = await db.runAsync('INSERT INTO Teams (teamName, abbreviation, leagueId) VALUES (?, ?, ?)', [teamName, abbreviation, leagueId]);
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

// Function to update a team name
export const updateTeamName = async (db, teamId, teamName) => {
  try {
    await db.runAsync('UPDATE Teams SET teamName = ? WHERE id = ?', [teamName, teamId]);
  } catch (error) {
    console.error('Error updating team name:', error);
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