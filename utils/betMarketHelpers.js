// Function to group BetMarket objects by timestamp and bookieId
export const groupByTimestampAndBookie = (betMarkets, currentGame) => {
    const grouped = {};

    betMarkets.forEach(betMarket => {
        const key = `${betMarket.timestamp}-${betMarket.bookieId}`;
        if (!grouped[key]) {
            grouped[key] = {
                timestamp: betMarket.timestamp,
                bookieId: betMarket.bookieId,
                home: null,
                away: null,
                totals: {
                    over: null,
                    under: null,
                },
            };
        }

        if (betMarket.marketType === 'moneyline') {
            // Handle moneyline markets
            if (betMarket.targetName === currentGame.homeTeamName) {
                grouped[key].home = {
                    odds: betMarket.odds,
                    value: betMarket.value,
                    betTargetId: betMarket.betTargetId,
                };
            } else if (betMarket.targetName === currentGame.awayTeamName) {
                grouped[key].away = {
                    odds: betMarket.odds,
                    value: betMarket.value,
                    betTargetId: betMarket.betTargetId,
                };
            }
        } else if (betMarket.marketType === 'spread') {
            // Handle spread markets
            if (betMarket.value > 0) {
                // Positive spread values belong to the home team
                grouped[key].home = {
                    odds: betMarket.odds,
                    value: betMarket.value,
                    betTargetId: betMarket.betTargetId,
                };
            } else if (betMarket.value < 0) {
                // Negative spread values belong to the away team
                grouped[key].away = {
                    odds: betMarket.odds,
                    value: betMarket.value,
                    betTargetId: betMarket.betTargetId,
                };
            }
        } else if (betMarket.marketType === 'totals') {
            // Handle totals markets
            if (betMarket.overUnder === 'Over') {
                grouped[key].totals.over = {
                    odds: betMarket.odds,
                    value: betMarket.value,
                    overUnder: betMarket.overUnder,
                    betTargetId: betMarket.betTargetId,
                };
            } else if (betMarket.overUnder === 'Under') {
                grouped[key].totals.under = {
                    odds: betMarket.odds,
                    value: betMarket.value,
                    overUnder: betMarket.overUnder,
                    betTargetId: betMarket.betTargetId,
                };
            }
        }
    });

    return Object.values(grouped);
};

// Function to sort BetMarket objects by timestamp and bookieId
export const sortBetMarkets = (betMarkets) => {
    return betMarkets.sort((a, b) => {
        if (a.timestamp === b.timestamp) {
            return a.bookieId - b.bookieId;
        }
        return new Date(a.timestamp) - new Date(b.timestamp);
    });
};

// Function that takes an array of market data and returns the object with the "Best Odds" meaning the odds closest to -100 or +100
export const getBestOdds = (marketData) => {
    let bestOdds = marketData[0];
    let bestOddsDiff = Math.min(Math.abs(100 - marketData[0].odds), Math.abs(-100 - marketData[0].odds));
    
    marketData.forEach((line) => {
        const diff = Math.min(Math.abs(100 - line.odds), Math.abs(-100 - line.odds));
        if (diff < bestOddsDiff) {
            bestOdds = line;
            bestOddsDiff = diff;
        }
    });
    
    return bestOdds;
}