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
      FOREIGN KEY(UserID) REFERENCES users(Id),
    );
    CREATE TABLE IF NOT EXISTS Bookies (
      id INTEGER AUTOINCREMENT, 
      Name TEXT NOT NULL, 
      Description TEXT,
      PRIMARY KEY (Id, Name, Description)
    );
    CREATE TABLE IF NOT EXISTS Leagues (
      id INTEGER AUTOINCREMENT,
      leagueName TEXT NOT NULL,
      sport TEXT NOT NULL,
      description TEXT,
      PRIMARY KEY (id, leagueName, sport, description)
    );
    CREATE TABLE IF NOT EXISTS Teams (
      id INTEGER AUTOINCREMENT,
      teamName TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      leagueId INTEGER NOT NULL,
      FOREIGN KEY(leagueId) REFERENCES Leagues(id),
      PRIMARY KEY (id, teamName, abbreviation, leagueId)
    );
    CREATE TABLE IF NOT EXISTS Seasons (
      id INTEGER AUTOINCREMENT,
      leagueId INTEGER NOT NULL,
      season TEXT NOT NULL,
      games INTEGER NOT NULL,
      FOREIGN KEY(leagueId) REFERENCES Leagues(id),
      PRIMARY KEY (id, leagueId, season, games)
    );
    CREATE TABLE IF NOT EXISTS Games (
      id INTEGER AUTOINCREMENT,
      gameId TEXT NOT NULL,
      seasonId INTEGER NOT NULL,
      date TEXT NOT NULL,
      homeTeamId INTEGER NOT NULL,
      awayTeamId INTEGER NOT NULL,
      FOREIGN KEY(seasonId) REFERENCES Seasons(id),
      FOREIGN KEY(homeTeamId) REFERENCES Teams(id),
      FOREIGN KEY(awayTeamId) REFERENCES Teams(id),
      PRIMARY KEY (id, gameId, seasonId, date, homeTeamId, awayTeamId)
    );
    CREATE TABLE IF NOT EXISTS BetTargets (
      id INTEGER AUTOINCREMENT,
      targetType TEXT NOT NULL,
      targetName TEXT NOT NULL,
      teamId INTEGER,
      FOREIGN KEY(teamId) REFERENCES Teams(id),
      PRIMARY KEY (id, targetType, targetName, teamId)
    );
    CREATE TABLE BetTypes (
      id INTEGER AUTOINCREMENT,
      betType TEXT NOT NULL,
      description TEXT,
      PRIMARY KEY (id, betType, description)
    );
    CREATE TABLE BetFormats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      formatName TEXT NOT NULL UNIQUE,
      description TEXT
    );
    CREATE TABLE BetMarkets (
      id INTEGER AUTOINCREMENT,
      gameId TEXT NOT NULL,
      marketType TEXT NOT NULL,
      value REAL NOT NULL,
      odds TEXT,
      overUnder TEXT,
      betTargetId INTEGER NOT NULL,
      bookieId INTEGER NOT NULL,
      FOREIGN KEY(betTargetId) REFERENCES BetTargets(id),
      FOREIGN KEY(gameId) REFERENCES Games(gameId),
      FOREIGN KEY(bookieId) REFERENCES Bookies(Id),
      PRIMARY KEY (id, gameId, marketType, value, odds, overUnder, betTargetId, bookieId)
    );
    CREATE TABLE BetSlips (
      id INTEGER AUTOINCREMENT,
      formatId INTEGER NOT NULL,
      date TEXT NOT NULL,
      odds TEXT NOT NULL,
      betAmount REAL NOT NULL,
      winnings REAL,
      userId INTEGER NOT NULL,
      bookieId INTEGER NOT NULL,
      FOREIGN KEY (formatId) REFERENCES BetFormats(id),
      FOREIGN KEY (userId) REFERENCES Users(id),
      FOREIGN KEY (bookieId) REFERENCES Bookies(Id),
      PRIMARY KEY (id, formatId, date, odds, betAmount, winnings, userId, bookieId)
    );
    CREATE TABLE ParticipantBets (
      id INTEGER AUTOINCREMENT,
      betSlipId INTEGER NOT NULL,
      sport TEXT NOT NULL,
      homeTeamId INTEGER NOT NULL,
      awayTeamId INTEGER NOT NULL,
      odds TEXT NOT NULL,
      FOREIGN KEY (betSlipId) REFERENCES BetSlips(id),
      FOREIGN KEY (homeTeamId) REFERENCES BetTargets(id),
      FOREIGN KEY (awayTeamId) REFERENCES BetTargets(id),
      PRIMARY KEY (id, betSlipId, sport, homeTeamId, awayTeamId, odds)
    );
    CREATE TABLE Legs (
      id INTEGER AUTOINCREMENT,
      participantBetId INTEGER NOT NULL,
      betMarketId INTEGER NOT NULL,
      FOREIGN KEY (participantBetId) REFERENCES ParticipantBets(id),
      FOREIGN KEY (betMarketId) REFERENCES BetMarkets(id),
      PRIMARY KEY (id, participantBetId, betMarketId)
    );
  `);
};