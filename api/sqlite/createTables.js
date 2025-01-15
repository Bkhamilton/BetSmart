// Function to create the database and tables
export const createTables = async (db) => {
    await createGeneralTables(db);
    await createBetGeneralTables(db);
    await createBetslipTables(db);
    await createUserSpecificTables(db);
    await createAPITables(db);
    console.log('Tables created');
};
  
export const createAPITables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS BetMarkets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId TEXT NOT NULL,
            marketType TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            value REAL NOT NULL,
            odds TEXT,
            overUnder TEXT,
            betTargetId INTEGER NOT NULL,
            bookieId INTEGER NOT NULL,
            FOREIGN KEY(betTargetId) REFERENCES BetTargets(id),
            FOREIGN KEY(gameId) REFERENCES Games(gameId),
            FOREIGN KEY(bookieId) REFERENCES Bookies(Id),
            UNIQUE (gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
        );
        CREATE TABLE IF NOT EXISTS FetchHistory (
            league TEXT,
            lastFetched TEXT NOT NULL,
            PRIMARY KEY (league, lastFetched),
            FOREIGN KEY(league) REFERENCES Leagues(leagueName)
        );
        CREATE TABLE IF NOT EXISTS MarketFetchHistory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId TEXT,
            marketType TEXT,
            lastFetched TEXT NOT NULL,
            FOREIGN KEY(gameId) REFERENCES Games(gameId),
            UNIQUE (gameId, marketType, lastFetched)
        );
        CREATE TABLE IF NOT EXISTS GameResults (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId INTEGER NOT NULL,
            homeScore INTEGER NOT NULL,
            awayScore INTEGER NOT NULL,
            winner TEXT NOT NULL,
            spread TEXT NOT NULL,
            totalPoints INTEGER NOT NULL,
            FOREIGN KEY(gameId) REFERENCES Games(id),
            UNIQUE (gameId, homeScore, awayScore, winner, spread, totalPoints)
        );
    `);
}

export const createGeneralTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Bookies (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT NOT NULL, 
            description TEXT,
            UNIQUE (name, description)
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
            logoUrl TEXT,
            FOREIGN KEY(leagueId) REFERENCES Leagues(id),
            UNIQUE (teamName, abbreviation, leagueId)
        );
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
            UNIQUE (leagueId, season, games, seasonType, startDate, endDate)
        );
        CREATE TABLE IF NOT EXISTS Games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId TEXT NOT NULL,
            seasonId INTEGER NOT NULL,
            date TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            homeTeamId INTEGER NOT NULL,
            awayTeamId INTEGER NOT NULL,
            FOREIGN KEY(seasonId) REFERENCES Seasons(id),
            FOREIGN KEY(homeTeamId) REFERENCES Teams(id),
            FOREIGN KEY(awayTeamId) REFERENCES Teams(id),
            UNIQUE (gameId, seasonId, date, homeTeamId, awayTeamId)
        );
        CREATE TABLE IF NOT EXISTS Players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            position TEXT NOT NULL,
            number TEXT NOT NULL,
            image TEXT,
            teamId INTEGER NOT NULL,
            FOREIGN KEY(teamId) REFERENCES Teams(id),
            UNIQUE (name, position, number, teamId)
        );
    `);
}

export const createBetslipTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS BetSlips (
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
        CREATE TABLE IF NOT EXISTS ParticipantBets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            betSlipId INTEGER NOT NULL,
            gameId TEXT NOT NULL,
            odds TEXT NOT NULL,
            FOREIGN KEY (betSlipId) REFERENCES BetSlips(id),
            FOREIGN KEY (gameId) REFERENCES Games(gameId),
            UNIQUE (betSlipId, gameId, odds)
        );
        CREATE TABLE IF NOT EXISTS Legs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participantBetId INTEGER NOT NULL,
            betMarketId INTEGER NOT NULL,
            betTypeId INTEGER NOT NULL,
            FOREIGN KEY (participantBetId) REFERENCES ParticipantBets(id),
            FOREIGN KEY (betMarketId) REFERENCES BetMarkets(id),
            FOREIGN KEY (betTypeId) REFERENCES BetTypes(id),
            UNIQUE (participantBetId, betMarketId)
        );
        CREATE TABLE IF NOT EXISTS BetSlipsResults (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            betSlipId INTEGER NOT NULL,
            result TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (betSlipId) REFERENCES BetSlips(id)
        );
        CREATE TABLE IF NOT EXISTS ParticipantBetsResults (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participantBetId INTEGER NOT NULL,
            result TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (participantBetId) REFERENCES ParticipantBets(id)
        );
        CREATE TABLE IF NOT EXISTS LegsResults (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            legId INTEGER NOT NULL,
            result TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (legId) REFERENCES Legs(id)
        );
    `);
}

export const createBetGeneralTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS BetTargets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            targetType TEXT NOT NULL,
            targetName TEXT NOT NULL,
            teamId INTEGER,
            gameId TEXT,
            FOREIGN KEY(teamId) REFERENCES Teams(id),
            FOREIGN KEY(gameId) REFERENCES Games(gameId),
            UNIQUE (targetType, targetName, teamId, gameId)
        );
        CREATE TABLE IF NOT EXISTS BetTypes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            betType TEXT NOT NULL,
            description TEXT,
            UNIQUE (betType, description)
        );
        CREATE TABLE IF NOT EXISTS BetFormats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            formatName TEXT NOT NULL UNIQUE,
            description TEXT,
            UNIQUE (formatName, description)
        );
        CREATE TABLE IF NOT EXISTS LeagueProps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            leagueId INTEGER NOT NULL,
            propName TEXT NOT NULL,
            FOREIGN KEY(leagueId) REFERENCES Leagues(id),
            UNIQUE (leagueId, propName)
        );
        CREATE TABLE IF NOT EXISTS LeaguePropsInfo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            propValue TEXT NOT NULL,
            leaguePropId INTEGER NOT NULL,
            FOREIGN KEY(leaguePropId) REFERENCES LeagueProps(id),
            UNIQUE (propValue, leaguePropId)
        );
    `);
}

export const createUserSpecificTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT,
            email TEXT, 
            username TEXT NOT NULL, 
            password TEXT NOT NULL,
            UNIQUE (username)
        );
        CREATE TABLE IF NOT EXISTS UserSessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            loginTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            logoutTimestamp DATETIME,
            isActive BOOLEAN DEFAULT 1,
            FOREIGN KEY(userId) REFERENCES Users(id),
            UNIQUE (userId, loginTimestamp, logoutTimestamp, isActive)
        );
        CREATE TABLE IF NOT EXISTS Balance (
            bookieId INTEGER NOT NULL, 
            balance REAL NOT NULL, 
            userID INTEGER NOT NULL, 
            FOREIGN KEY(userID) REFERENCES users(Id),
            FOREIGN KEY(bookieId) REFERENCES Bookies(Id),
            PRIMARY KEY (bookieId, Balance, userID)
        );
        CREATE TABLE IF NOT EXISTS Transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookieId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            transactionType TEXT NOT NULL CHECK(transactionType IN ('Deposit', 'Withdraw')),
            initialBalance REAL NOT NULL,
            amount REAL NOT NULL,
            finalBalance REAL NOT NULL,
            timestamp TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY(bookieId) REFERENCES Bookies(id),
            FOREIGN KEY(userId) REFERENCES Users(id),
            UNIQUE (bookieId, userId, transactionType, initialBalance, amount, finalBalance, timestamp)
        );
        CREATE TABLE IF NOT EXISTS Bonuses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookieId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            bonusType TEXT NOT NULL,
            bonusAmount REAL NOT NULL,
            timestamp TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY(bookieId) REFERENCES Bookies(id),
            FOREIGN KEY(userId) REFERENCES Users(id),
            UNIQUE (bookieId, userId, bonusType, bonusAmount, timestamp, description)
        );
    `);
}