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
            FOREIGN KEY(teamId) REFERENCES Teams(id)
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
        CREATE TABLE IF NOT EXISTS Preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            preferenceName TEXT NOT NULL,
            preferenceValue TEXT NOT NULL,
            FOREIGN KEY(userId) REFERENCES Users(id),
            UNIQUE (userId, preferenceName, preferenceValue)
        );
    `);
}

export const createInsightTables = async (db) => {
    await db.execAsync(`
        CREATE VIEW OverallBettingPerformance AS
        SELECT 
            bs.userId,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0 THEN 1 ELSE 0 END) AS losses,
            SUM(CASE WHEN bsr.result = -1 THEN 1 ELSE 0 END) AS pushes,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage,
            SUM(bs.betAmount) AS total_wagered,
            SUM(CASE 
                WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount 
                WHEN bsr.result = 0 THEN -bs.betAmount 
                ELSE 0 
            END) AS net_profit,
            ROUND(SUM(CASE 
                WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount 
                WHEN bsr.result = 0 THEN -bs.betAmount 
                ELSE 0 
            END) * 100.0 / SUM(bs.betAmount), 2) AS roi_percentage
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        WHERE bsr.result IN (1, 0, -1)
        GROUP BY bs.userId;

        CREATE VIEW MarketPerformance AS
        SELECT 
            bs.userId,
            bm.marketType AS market_name,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN lr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN ParticipantBets pb ON bs.id = pb.betSlipId
        JOIN Legs l ON pb.id = l.participantBetId
        JOIN LegsResults lr ON l.id = lr.legId
        JOIN BetMarkets bm ON l.betMarketId = bm.id
        GROUP BY bs.userId, bm.marketType;

        CREATE VIEW BetTypePerformance AS
        SELECT 
            bs.userId,
            bt.name AS bet_type,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN lr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN ParticipantBets pb ON bs.id = pb.betSlipId
        JOIN Legs l ON pb.id = l.participantBetId
        JOIN LegsResults lr ON l.id = lr.legId
        JOIN BetTypes bt ON l.betTypeId = bt.id
        GROUP BY bs.userId, bt.name;
        
        CREATE VIEW OddsRangePerformance AS
        SELECT 
            bs.userId,
            CASE 
                WHEN CAST(pb.odds AS REAL) < 0 THEN 'Favorite (negative odds)'
                WHEN CAST(pb.odds AS REAL) BETWEEN 0 AND 100 THEN 'Even to +100'
                WHEN CAST(pb.odds AS REAL) BETWEEN 100 AND 150 THEN '+100 to +150'
                WHEN CAST(pb.odds AS REAL) BETWEEN 150 AND 200 THEN '+150 to +200'
                WHEN CAST(pb.odds AS REAL) > 200 THEN 'Longshot (+200+)'
                ELSE 'Unknown'
            END AS odds_range,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN pbr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN pbr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN pbr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN ParticipantBets pb ON bs.id = pb.betSlipId
        JOIN ParticipantBetsResults pbr ON pb.id = pbr.participantBetId
        GROUP BY bs.userId, odds_range;

        CREATE TEMPORARY TABLE RecentPerformance AS
        SELECT 
            bs.userId,
            bs.id,
            bs.date,
            bsr.result,
            bs.betAmount,
            bs.winnings,
            CASE WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount 
                WHEN bsr.result = 0 THEN -bs.betAmount 
                ELSE 0 END AS net_result
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        ORDER BY bs.userId, bs.date DESC
        LIMIT 15;

        CREATE TEMPORARY TABLE CurrentStreak AS
        WITH StreakData AS (
            SELECT 
                bs.userId,
                bs.id,
                bs.date,
                bsr.result,
                LAG(bsr.result) OVER (PARTITION BY bs.userId ORDER BY bs.date) AS prev_result
            FROM BetSlips bs
            JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
            ORDER BY bs.userId, bs.date DESC
        )
        SELECT 
            userId,
            result AS current_streak_result,
            COUNT(*) AS streak_length
        FROM (
            SELECT 
                userId,
                result,
                SUM(CASE WHEN result <> prev_result OR prev_result IS NULL THEN 1 ELSE 0 END) 
                    OVER (PARTITION BY userId ORDER BY date DESC) AS streak_group
            FROM StreakData
        ) 
        GROUP BY userId, result, streak_group
        ORDER BY userId, MIN(date) DESC;
        LIMIT 1;

        CREATE VIEW LeaguePerformance AS
        SELECT 
            bs.userId,
            l.leagueName,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN pbr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN pbr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN pbr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN ParticipantBets pb ON bs.id = pb.betSlipId
        JOIN ParticipantBetsResults pbr ON pb.id = pbr.participantBetId
        JOIN Games g ON pb.gameId = g.gameId
        JOIN Seasons s ON g.seasonId = s.id
        JOIN Leagues l ON s.leagueId = l.id
        GROUP BY bs.userId, l.leagueName;

        CREATE VIEW DayOfWeekPerformance AS
        SELECT 
            bs.userId,
            strftime('%w', bs.date) AS day_of_week,
            CASE strftime('%w', bs.date)
                WHEN '0' THEN 'Sunday'
                WHEN '1' THEN 'Monday'
                WHEN '2' THEN 'Tuesday'
                WHEN '3' THEN 'Wednesday'
                WHEN '4' THEN 'Thursday'
                WHEN '5' THEN 'Friday'
                WHEN '6' THEN 'Saturday'
            END AS day_name,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0' THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        GROUP BY bs.userId, day_of_week, day_name
        ORDER BY bs.userId, day_of_week;

        CREATE VIEW TimeOfDayPerformance AS
        SELECT 
            bs.userId,
            CASE 
                WHEN CAST(strftime('%H', bs.date) AS INTEGER) BETWEEN 6 AND 11 THEN 'Morning (6AM-12PM)'
                WHEN CAST(strftime('%H', bs.date) AS INTEGER) BETWEEN 12 AND 17 THEN 'Afternoon (12PM-6PM)'
                WHEN CAST(strftime('%H', bs.date) AS INTEGER) BETWEEN 18 AND 23 THEN 'Evening (6PM-12AM)'
                ELSE 'Late Night (12AM-6AM)'
            END AS time_of_day,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        GROUP BY bs.userId, time_of_day;

        CREATE VIEW BetSizePerformance AS
        SELECT 
            bs.userId,
            CASE 
                WHEN bs.betAmount < 10 THEN 'Small (<10)'
                WHEN bs.betAmount BETWEEN 10 AND 25 THEN 'Medium (10-25)'
                WHEN bs.betAmount BETWEEN 25 AND 50 THEN 'Large (25-50)'
                WHEN bs.betAmount > 50 THEN 'XL (>50)'
                ELSE 'Unknown'
            END AS bet_size_category,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage,
            SUM(bs.betAmount) AS total_wagered,
            SUM(CASE WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount ELSE -bs.betAmount END) AS net_profit
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        GROUP BY bs.userId, bet_size_category;

        CREATE VIEW BetFormatPerformance AS
        SELECT 
            bs.userId,
            bf.name AS format_name,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage,
            AVG(bs.betAmount) AS avg_bet_size,
            SUM(CASE WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount ELSE -bs.betAmount END) AS net_profit
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        JOIN BetFormats bf ON bs.formatId = bf.id
        GROUP BY bs.userId, bf.name;
        
        CREATE VIEW BookiePerformance AS
        SELECT 
            bs.userId,
            bk.name AS bookie_name,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage,
            SUM(bs.betAmount) AS total_wagered,
            SUM(CASE WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount ELSE -bs.betAmount END) AS net_profit
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        JOIN Bookies bk ON bs.bookieId = bk.id
        GROUP BY bs.userId, bk.name;
    `);
}
