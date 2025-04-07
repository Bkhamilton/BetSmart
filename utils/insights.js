export const getActionableInsights = async (db, userId) => {
    const insights = [];

    try {
        // League Performance Insight
        const leagueQuery = `
            SELECT leagueName, win_percentage
            FROM LeaguePerformance
            WHERE userId = ?
            ORDER BY win_percentage DESC
            LIMIT 1;
        `;
        const leagueResult = await db.getFirstAsync(leagueQuery, [userId]);
        if (leagueResult && leagueResult.win_percentage >= 70) {
            insights.push({
                message: `Your ${leagueResult.leagueName} bets are hitting at ${leagueResult.win_percentage}%, great work!`,
                priority: 1 // High priority for strong performance
            });
        }

        // Market Performance Insight
        const marketQuery = `
            SELECT market_name, win_percentage
            FROM MarketPerformance
            WHERE userId = ? AND total_bets >= 5
            ORDER BY win_percentage ASC
            LIMIT 1;
        `;
        const marketResult = await db.getFirstAsync(marketQuery, [userId]);
        if (marketResult && marketResult.win_percentage <= 20) {
            insights.push({
                message: `Your ${marketResult.market_name} bets are struggling at ${marketResult.win_percentage}%. Consider trying new markets!`,
                priority: 2 // Medium priority for improvement areas
            });
        }

        // Odds Range Performance Insight
        const oddsQuery = `
            SELECT odds_range, win_percentage
            FROM OddsRangePerformance
            WHERE userId = ?
            ORDER BY win_percentage DESC
            LIMIT 1;
        `;
        const oddsResult = await db.getFirstAsync(oddsQuery, [userId]);
        if (oddsResult && oddsResult.win_percentage >= 80) {
            insights.push({
                message: `Your bets between ${oddsResult.odds_range} are hitting at ${oddsResult.win_percentage}%. Keep it up!`,
                priority: 1 // High priority for strong performance
            });
        }

        // Bet Type Performance Insight
        const betTypeQuery = `
            SELECT betType, win_percentage
            FROM BetTypePerformance
            WHERE userId = ? AND total_bets >= 5
            ORDER BY win_percentage ASC
            LIMIT 1;
        `;
        const betTypeResult = await db.getFirstAsync(betTypeQuery, [userId]);
        if (betTypeResult && betTypeResult.win_percentage <= 20) {
            insights.push({
                message: `Your ${betTypeResult.betType} bets are struggling at ${betTypeResult.win_percentage}%. Consider exploring other bet types.`,
                priority: 2 // Medium priority for improvement areas
            });
        }

        // Recent Performance Insight
        const recentQuery = `
            SELECT result, COUNT(*) AS streak_length
            FROM RecentPerformance
            WHERE userId = ?
            GROUP BY result
            ORDER BY streak_length DESC
            LIMIT 1;
        `;
        const recentResult = await db.getFirstAsync(recentQuery, [userId]);
        if (recentResult && recentResult.result === "1") {
            insights.push({
                message: `You're on a hot streak with ${recentResult.streak_length} consecutive wins!`,
                priority: 1 // High priority for positive streaks
            });
        } else if (recentResult && recentResult.result === "0") {
            insights.push({
                message: `You're on a cold streak with ${recentResult.streak_length} consecutive losses. Consider adjusting your strategy.`,
                priority: 3 // Highest priority for concerning trends
            });
        }

        // Sort insights by priority (lower number = higher priority)
        insights.sort((a, b) => a.priority - b.priority);

    } catch (error) {
        console.error('Error generating actionable insights:', error);
    }

    return insights;
};