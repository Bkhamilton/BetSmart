import * as SQLite from 'expo-sqlite';

export const initializeDatabase = async (db) => {

};

// Function to create the database and tables
export const createTables = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT,
      email TEXT, 
      username TEXT NOT NULL, 
      password TEXT NOT NULL,
      UNIQUE (username)
    );
    CREATE TABLE IF NOT EXISTS Balance (
      bookieId INTEGER NOT NULL, 
      balance REAL NOT NULL, 
      userID INTEGER NOT NULL, 
      FOREIGN KEY(userID) REFERENCES users(Id),
      FOREIGN KEY(bookieId) REFERENCES Bookies(Id),
      PRIMARY KEY (bookieId, Balance, userID)
    );
    CREATE TABLE IF NOT EXISTS Bookies (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL, 
      description TEXT,
      UNIQUE (id, name, description)
    );
    CREATE TABLE IF NOT EXISTS Leagues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leagueName TEXT NOT NULL,
      sport TEXT NOT NULL,
      description TEXT,
      UNIQUE (leagueName, sport, description)
    );
    CREATE TABLE IF NOT EXISTS Teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamName TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      leagueId INTEGER NOT NULL,
      FOREIGN KEY(leagueId) REFERENCES Leagues(id),
      UNIQUE (teamName, abbreviation, leagueId)
    );
    CREATE TABLE IF NOT EXISTS Seasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leagueId INTEGER NOT NULL,
      season TEXT NOT NULL,
      games INTEGER NOT NULL,
      description TEXT,
      seasonType TEXT NOT NULL,
      FOREIGN KEY(leagueId) REFERENCES Leagues(id),
      UNIQUE (leagueId, season, games)
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
      FOREIGN KEY(awayTeamId) REFERENCES Teams(id),
      UNIQUE (gameId, seasonId, date, homeTeamId, awayTeamId)
    );
    CREATE TABLE IF NOT EXISTS BetTargets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      targetType TEXT NOT NULL,
      targetName TEXT NOT NULL,
      teamId INTEGER,
      FOREIGN KEY(teamId) REFERENCES Teams(id),
      UNIQUE (targetType, targetName, teamId)
    );
    CREATE TABLE BetTypes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      betType TEXT NOT NULL,
      description TEXT,
      UNIQUE (betType, description)
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
      FOREIGN KEY(bookieId) REFERENCES Bookies(Id),
      UNIQUE (gameId, marketType, value, odds, overUnder, betTargetId, bookieId)
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
      FOREIGN KEY (bookieId) REFERENCES Bookies(Id),
      UNIQUE (formatId, date, odds, betAmount, winnings, userId, bookieId)
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
      FOREIGN KEY (awayTeamId) REFERENCES BetTargets(id),
      UNIQUE (betSlipId, sport, homeTeamId, awayTeamId, odds)
    );
    CREATE TABLE Legs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participantBetId INTEGER NOT NULL,
      betMarketId INTEGER NOT NULL,
      FOREIGN KEY (participantBetId) REFERENCES ParticipantBets(id),
      FOREIGN KEY (betMarketId) REFERENCES BetMarkets(id),
      UNIQUE (participantBetId, betMarketId)
    );
  `);
  console.log('Tables created');
};

// Function to drop the tables
export const dropTables = async (db) => {
  await db.execAsync(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS balance;
    DROP TABLE IF EXISTS Bookies;
    DROP TABLE IF EXISTS Leagues;
    DROP TABLE IF EXISTS Teams;
    DROP TABLE IF EXISTS Seasons;
    DROP TABLE IF EXISTS Games;
    DROP TABLE IF EXISTS BetTargets;
    DROP TABLE IF EXISTS BetTypes;
    DROP TABLE IF EXISTS BetFormats;
    DROP TABLE IF EXISTS BetMarkets;
    DROP TABLE IF EXISTS BetSlips;
    DROP TABLE IF EXISTS ParticipantBets;
    DROP TABLE IF EXISTS Legs;
  `);
  console.log('Tables dropped');
};

export const dropSeasonsTable = async (db) => {
  await db.execAsync(`
    DROP TABLE IF EXISTS Seasons;
  `);
  console.log('Seasons Table dropped');
};

export const createSeasonsTable = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Seasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leagueId INTEGER NOT NULL,
      season TEXT NOT NULL,
      games INTEGER NOT NULL,
      description TEXT,
      seasonType TEXT NOT NULL CHECK(seasonType IN ('Pre-Season', 'Regular Season', 'Playoffs')),
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      FOREIGN KEY(leagueId) REFERENCES Leagues(id),
      UNIQUE (id, leagueId, season, games)
    );
  `);
  console.log('Seasons Table created');
}