export const recreateHistoryInsightViews = async (db) => {
    await db.execAsync(`
        DROP VIEW IF EXISTS LeaguePerformance;
        DROP VIEW IF EXISTS MarketPerformance;
        DROP VIEW IF EXISTS BetTypePerformance;
        DROP VIEW IF EXISTS BetFormatPerformance;
        DROP VIEW IF EXISTS BookiePerformance;

        CREATE VIEW LeaguePerformance AS
        SELECT bs.userId, COALESCE(pb.leagueSnapshot, l.leagueName, 'Unknown') AS leagueName,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN pbr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN pbr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN pbr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN ParticipantBets pb ON bs.id = pb.betSlipId
        JOIN ParticipantBetsResults pbr ON pb.id = pbr.participantBetId
        LEFT JOIN Games g ON pb.gameId = g.gameId AND pb.leagueSnapshot IS NULL
        LEFT JOIN Seasons s ON g.seasonId = s.id
        LEFT JOIN Leagues l ON s.leagueId = l.id
        GROUP BY bs.userId, COALESCE(pb.leagueSnapshot, l.leagueName, 'Unknown');

        CREATE VIEW MarketPerformance AS
        SELECT bs.userId, COALESCE(l.marketTypeSnapshot, bm.marketType, 'Unknown') AS market_name,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN lr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN ParticipantBets pb ON bs.id = pb.betSlipId
        JOIN Legs l ON pb.id = l.participantBetId
        JOIN LegsResults lr ON l.id = lr.legId
        LEFT JOIN BetMarkets bm ON l.betMarketId = bm.id
        GROUP BY bs.userId, COALESCE(l.marketTypeSnapshot, bm.marketType, 'Unknown');

        CREATE VIEW BetTypePerformance AS
        SELECT bs.userId, COALESCE(l.betTypeSnapshot, bt.betType, 'Unknown') AS betType,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN lr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN lr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage
        FROM BetSlips bs
        JOIN ParticipantBets pb ON bs.id = pb.betSlipId
        JOIN Legs l ON pb.id = l.participantBetId
        JOIN LegsResults lr ON l.id = lr.legId
        LEFT JOIN BetTypes bt ON l.betTypeId = bt.id
        GROUP BY bs.userId, COALESCE(l.betTypeSnapshot, bt.betType, 'Unknown');

        CREATE VIEW BetFormatPerformance AS
        SELECT bs.userId, COALESCE(bs.formatNameSnapshot, bf.formatName, 'Unknown') AS format_name,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage,
            AVG(bs.betAmount) AS avg_bet_size,
            SUM(CASE WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount ELSE -bs.betAmount END) AS net_profit
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        LEFT JOIN BetFormats bf ON bs.formatId = bf.id
        GROUP BY bs.userId, COALESCE(bs.formatNameSnapshot, bf.formatName, 'Unknown');

        CREATE VIEW BookiePerformance AS
        SELECT bs.userId, COALESCE(bs.bookieNameSnapshot, bk.name, 'Unknown') AS bookie_name,
            COUNT(*) AS total_bets,
            SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN bsr.result = 0 THEN 1 ELSE 0 END) AS losses,
            ROUND(SUM(CASE WHEN bsr.result = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS win_percentage,
            SUM(bs.betAmount) AS total_wagered,
            SUM(CASE WHEN bsr.result = 1 THEN bs.winnings - bs.betAmount ELSE -bs.betAmount END) AS net_profit
        FROM BetSlips bs
        JOIN BetSlipsResults bsr ON bs.id = bsr.betSlipId
        LEFT JOIN Bookies bk ON bs.bookieId = bk.id
        GROUP BY bs.userId, COALESCE(bs.bookieNameSnapshot, bk.name, 'Unknown');
    `);
};
