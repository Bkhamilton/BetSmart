import * as SQLite from 'expo-sqlite';

export const initializeDatabase = async (db) => {

};

// Function to create the database and tables
export const createTables = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      Id INTEGER PRIMARY KEY AUTOINCREMENT, 
      Name TEXT NOT NULL, 
      Username TEXT NOT NULL, 
      Password TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS balance (
      Bookie TEXT PRIMARY KEY NOT NULL, 
      Balance REAL NOT NULL, 
      UserID INTEGER, 
      FOREIGN KEY(UserID) REFERENCES users(Id)
    );
    CREATE TABLE IF NOT EXISTS Leagues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leagueName TEXT NOT NULL,
      sport TEXT NOT NULL,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS Teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamName TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      logoUrl TEXT,
      leagueId INTEGER NOT NULL,
      FOREIGN KEY(leagueId) REFERENCES Leagues(id)
    );
    CREATE TABLE IF NOT EXISTS Seasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leagueId INTEGER NOT NULL,
      season TEXT NOT NULL,
      games INTEGER NOT NULL,
      FOREIGN KEY(leagueId) REFERENCES Leagues(id)
    );
    CREATE TABLE IF NOT EXISTS BetTargets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      targetType TEXT NOT NULL,
      targetName TEXT NOT NULL,
      teamId INTEGER,
      FOREIGN KEY(teamId) REFERENCES Teams(id)
    );
    CREATE TABLE BetTypes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      betType TEXT NOT NULL,
      description TEXT
    );
    CREATE TABLE BetFormats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      formatName TEXT NOT NULL UNIQUE,
      description TEXT
    );
    CREATE TABLE BettingLines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      formatId INTEGER NOT NULL,
      date TEXT NOT NULL,
      odds TEXT NOT NULL,
      betAmount REAL NOT NULL,
      winnings REAL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (formatId) REFERENCES BetFormats(id),
      FOREIGN KEY (userId) REFERENCES Users(id)
    );
    CREATE TABLE ParticipantBets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bettingLineId INTEGER NOT NULL,
      sport TEXT NOT NULL,
      homeTeamId INTEGER NOT NULL,
      awayTeamId INTEGER NOT NULL,
      odds TEXT NOT NULL,
      FOREIGN KEY (bettingLineId) REFERENCES BettingLines(id),
      FOREIGN KEY (homeTeamId) REFERENCES BetTargets(id),
      FOREIGN KEY (awayTeamId) REFERENCES BetTargets(id)
    );
    CREATE TABLE Legs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participantBetId INTEGER NOT NULL,
      legType TEXT NOT NULL,
      betTargetId INTEGER NOT NULL,
      stat TEXT,
      line REAL,
      overUnder TEXT,
      FOREIGN KEY (participantBetId) REFERENCES ParticipantBets(id),
      FOREIGN KEY (betTargetId) REFERENCES BetTargets(id)
    );
  `);
};

// Function to get a user's balance
export const getBalance = async (db, userId) => {
  const allRows = await db.getAllAsync('SELECT * FROM balance WHERE UserID = ?', [userId]);
  return allRows;
};

// Function to insert a balance
export const insertBalance = async (db, bookie, balance, userId) => {
  const result = await db.runAsync('INSERT INTO balance (Bookie, Balance, UserID) VALUES (?, ?, ?)', [bookie, balance, userId]);
  console.log(result);
  return result.lastInsertRowId;
};

// Function to update a balance
export const updateBalance = async (db, bookie, balance, userId) => {
  await db.runAsync('UPDATE balance SET Balance = ? WHERE Bookie = ? AND UserID = ?', [balance, bookie, userId]);
  console.log("Balance updated");
};

// Function to delete a balance
export const deleteBalance = async (db, bookie, userId) => {
  await db.runAsync('DELETE FROM balance WHERE Bookie = ? AND UserID = ?', [bookie, userId]);
};

// Function to get all users
export const getAllUsers = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM users');
  return allRows;
};

// Function to get a user
export const getUser = async (db, username) => {
  const user = await db.getAsync('SELECT * FROM users WHERE Username = ?', [username]);
  return user;
};

// Function to insert a user
export const insertUser = async (db, name, username, password) => {
  const result = await db.runAsync('INSERT INTO users (Name, Username, Password) VALUES (?, ?, ?)', [name, username, password]);
  return result.lastInsertRowId;
};

// Function to update a user
export const updateUser = async (db, id, name, username, password) => {
  await db.runAsync('UPDATE users SET Name = ?, Username = ?, Password = ? WHERE Id = ?', [name, username, password, id]);
};

// Function to delete a user
export const deleteUser = async (db, id) => {
  await db.runAsync('DELETE FROM users WHERE Id = ?', [id]);
};

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
export const insertTeam = async (db, teamName, abbreviation, logoUrl, leagueId) => {
  const result = await db.runAsync('INSERT INTO Teams (teamName, abbreviation, logoUrl, leagueId) VALUES (?, ?, ?, ?)', [teamName, abbreviation, logoUrl, leagueId]);
  return result.lastInsertRowId;
};

// Function to update a team
export const updateTeam = async (db, teamId, teamName, abbreviation, logoUrl, leagueId) => {
  await db.runAsync('UPDATE Teams SET teamName = ?, abbreviation = ?, logoUrl = ?, leagueId = ? WHERE id = ?', [teamName, abbreviation, logoUrl, leagueId, teamId]);
};

// Function to delete a team
export const deleteTeam = async (db, teamId) => {
  await db.runAsync('DELETE FROM Teams WHERE id = ?', [teamId]);
};

// Function to get all bet targets
export const getAllBetTargets = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BetTargets');
  return allRows;
};

// Function to get a bet target
export const getBetTarget = async (db, betTargetId) => {
  const betTarget = await db.getAsync('SELECT * FROM BetTargets WHERE id = ?', [betTargetId]);
  return betTarget;
};

// Function to insert a bet target
export const insertBetTarget = async (db, targetType, targetName, teamId) => {
  const result = await db.runAsync('INSERT INTO BetTargets (targetType, targetName, teamId) VALUES (?, ?, ?)', [targetType, targetName, teamId]);
  return result.lastInsertRowId;
};

// Function to update a bet target
export const updateBetTarget = async (db, betTargetId, targetType, targetName, teamId) => {
  await db.runAsync('UPDATE BetTargets SET targetType = ?, targetName = ?, teamId = ? WHERE id = ?', [targetType, targetName, teamId, betTargetId]);
};

// Function to delete a bet target
export const deleteBetTarget = async (db, betTargetId) => {
  await db.runAsync('DELETE FROM BetTargets WHERE id = ?', [betTargetId]);
};

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

// Function to get all bet types
export const getAllBetTypes = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BetTypes');
  return allRows;
};

// Function to get a bet type
export const getBetType = async (db, betTypeId) => {
  const betType = await db.getAsync('SELECT * FROM BetTypes WHERE id = ?', [betTypeId]);
  return betType;
};

// Function to insert a bet type
export const insertBetType = async (db, betType, description) => {
  const result = await db.runAsync('INSERT INTO BetTypes (betType, description) VALUES (?, ?)', [betType, description]);
  return result.lastInsertRowId;
};

// Function to update a bet type
export const updateBetType = async (db, betTypeId, betType, description) => {
  await db.runAsync('UPDATE BetTypes SET betType = ?, description = ? WHERE id = ?', [betType, description, betTypeId]);
};

// Function to delete a bet type
export const deleteBetType = async (db, betTypeId) => {
  await db.runAsync('DELETE FROM BetTypes WHERE id = ?', [betTypeId]);
};

// Function to get all bet formats
export const getAllBetFormats = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BetFormats');
  return allRows;
};

// Function to get a bet format
export const getBetFormat = async (db, betFormatId) => {
  const betFormat = await db.getAsync('SELECT * FROM BetFormats WHERE id = ?', [betFormatId]);
  return betFormat;
};

// Function to insert a bet format
export const insertBetFormat = async (db, formatName, description) => {
  const result = await db.runAsync('INSERT INTO BetFormats (formatName, description) VALUES (?, ?)', [formatName, description]);
  return result.lastInsertRowId;
};

// Function to update a bet format
export const updateBetFormat = async (db, betFormatId, formatName, description) => {
  await db.runAsync('UPDATE BetFormats SET formatName = ?, description = ? WHERE id = ?', [formatName, description, betFormatId]);
};

// Function to delete a bet format
export const deleteBetFormat = async (db, betFormatId) => {
  await db.runAsync('DELETE FROM BetFormats WHERE id = ?', [betFormatId]);
};

// Function to get all betting lines
export const getAllBettingLines = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BettingLines');
  return allRows;
};

// Function to get a betting line
export const getBettingLine = async (db, bettingLineId) => {
  const bettingLine = await db.getAsync('SELECT * FROM BettingLines WHERE id = ?', [bettingLineId]);
  return bettingLine;
};

// Function to insert a betting line
export const insertBettingLine = async (db, betTargetId, betTypeId, betFormatId, odds) => {
  const result = await db.runAsync('INSERT INTO BettingLines (betTargetId, betTypeId, betFormatId, odds) VALUES (?, ?, ?, ?)', [betTargetId, betTypeId, betFormatId, odds]);
  return result.lastInsertRowId;
};

// Function to update a betting line
export const updateBettingLine = async (db, bettingLineId, betTargetId, betTypeId, betFormatId, odds) => {
  await db.runAsync('UPDATE BettingLines SET betTargetId = ?, betTypeId = ?, betFormatId = ?, odds = ? WHERE id = ?', [betTargetId, betTypeId, betFormatId, odds, bettingLineId]);
};

// Function to delete a betting line
export const deleteBettingLine = async (db, bettingLineId) => {
  await db.runAsync('DELETE FROM BettingLines WHERE id = ?', [bettingLineId]);
};

// Function to get all participant bets
export const getAllParticipantBets = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM ParticipantBets');
  return allRows;
};

// Function to get a participant bet
export const getParticipantBet = async (db, participantBetId) => {
  const participantBet = await db.getAsync('SELECT * FROM ParticipantBets WHERE id = ?', [participantBetId]);
  return participantBet;
};

// Function to insert a participant bet
export const insertParticipantBet = async (db, userId, bettingLineId, amount) => {
  const result = await db.runAsync('INSERT INTO ParticipantBets (userId, bettingLineId, amount) VALUES (?, ?, ?)', [userId, bettingLineId, amount]);
  return result.lastInsertRowId;
};

// Function to update a participant bet
export const updateParticipantBet = async (db, participantBetId, userId, bettingLineId, amount) => {
  await db.runAsync('UPDATE ParticipantBets SET userId = ?, bettingLineId = ?, amount = ? WHERE id = ?', [userId, bettingLineId, amount, participantBetId]);
};

// Function to delete a participant bet
export const deleteParticipantBet = async (db, participantBetId) => {
  await db.runAsync('DELETE FROM ParticipantBets WHERE id = ?', [participantBetId]);
};

// Function to get all legs
export const getAllLegs = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM Legs');
  return allRows;
};

// Function to get a leg
export const getLeg = async (db, legId) => {
  const leg = await db.getAsync('SELECT * FROM Legs WHERE id = ?', [legId]);
  return leg;
};

// Function to insert a leg
export const insertLeg = async (db, participantBetId, result) => {
  const result = await db.runAsync('INSERT INTO Legs (participantBetId, result) VALUES (?, ?)', [participantBetId, result]);
  return result.lastInsertRowId;
};

// Function to update a leg
export const updateLeg = async (db, legId, participantBetId, result) => {
  await db.runAsync('UPDATE Legs SET participantBetId = ?, result = ? WHERE id = ?', [participantBetId, result, legId]);
};

// Function to delete a leg
export const deleteLeg = async (db, legId) => {
  await db.runAsync('DELETE FROM Legs WHERE id = ?', [legId]);
};