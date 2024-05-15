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
    CREATE TABLE IF NOT EXISTS Teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamName TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      logoUrl TEXT,
      city TEXT,
      state TEXT,
      country TEXT
    );
    CREATE TABLE IF NOT EXISTS Leagues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leagueName TEXT NOT NULL,
      sport TEXT NOT NULL,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS Seasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leagueId INTEGER NOT NULL,
      season TEXT NOT NULL,
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