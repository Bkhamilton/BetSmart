// Function to group BetMarket objects by timestamp and bookieId
export const groupByTimestampAndBookie = (betMarkets, currentGame) => {
    const grouped = {};

    betMarkets.forEach(betMarket => {
        const key = `${betMarket.timestamp}-${betMarket.bookieId}`;
        if (!grouped[key]) {
            grouped[key] = {
                timestamp: betMarket.timestamp,
                bookieId: betMarket.bookieId,
                homeOdds: null,
                awayOdds: null,
            };
        }

        if (betMarket.targetName === currentGame.homeTeamName) {
            grouped[key].homeOdds = betMarket.odds;
        } else if (betMarket.targetName === currentGame.awayTeamName) {
            grouped[key].awayOdds = betMarket.odds;
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