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
    CREATE TABLE IF NOT EXISTS Bookies (
      Id INTEGER PRIMARY KEY AUTOINCREMENT, 
      Name TEXT NOT NULL, 
      Description TEXT
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
    CREATE TABLE IF NOT EXISTS Games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId TEXT NOT NULL,
      seasonId INTEGER NOT NULL,
      date TEXT NOT NULL,
      homeTeamId INTEGER NOT NULL,
      awayTeamId INTEGER NOT NULL,
      FOREIGN KEY(seasonId) REFERENCES Seasons(id),
      FOREIGN KEY(homeTeamId) REFERENCES Teams(id),
      FOREIGN KEY(awayTeamId) REFERENCES Teams(id)
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
    CREATE TABLE BetMarkets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId TEXT NOT NULL,
      marketType TEXT NOT NULL,
      value REAL NOT NULL,
      odds TEXT,
      overUnder TEXT,
      betTargetId INTEGER NOT NULL,
      bookieId INTEGER NOT NULL,
      FOREIGN KEY(betTargetId) REFERENCES BetTargets(id),
      FOREIGN KEY(gameId) REFERENCES Games(gameId),
      FOREIGN KEY(bookieId) REFERENCES Bookies(Id)
    );
    CREATE TABLE BetSlips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      formatId INTEGER NOT NULL,
      date TEXT NOT NULL,
      odds TEXT NOT NULL,
      betAmount REAL NOT NULL,
      winnings REAL,
      userId INTEGER NOT NULL,
      bookieId INTEGER NOT NULL,
      FOREIGN KEY (formatId) REFERENCES BetFormats(id),
      FOREIGN KEY (userId) REFERENCES Users(id),
      FOREIGN KEY (bookieId) REFERENCES Bookies(Id)
    );
    CREATE TABLE ParticipantBets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      betSlipId INTEGER NOT NULL,
      sport TEXT NOT NULL,
      homeTeamId INTEGER NOT NULL,
      awayTeamId INTEGER NOT NULL,
      odds TEXT NOT NULL,
      FOREIGN KEY (betSlipId) REFERENCES BetSlips(id),
      FOREIGN KEY (homeTeamId) REFERENCES BetTargets(id),
      FOREIGN KEY (awayTeamId) REFERENCES BetTargets(id)
    );
    CREATE TABLE Legs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participantBetId INTEGER NOT NULL,
      betMarketId INTEGER NOT NULL,
      FOREIGN KEY (participantBetId) REFERENCES ParticipantBets(id),
      FOREIGN KEY (betMarketId) REFERENCES BetMarkets(id)
    );
  `);
};