
export const displayLeg = (leg, betTargetName) => {

    const { marketType, value, odds, overUnder, betTargetId, betTarget, targetType, betType } = leg;

    switch (betType) {
        case 'Player Points':
            return `${betTarget} ${marketType} ${value} ${overUnder}`;
        case 'Player Threes':
            return `${betTarget} ${marketType} ${value} ${overUnder}`;
        case 'Main':
            switch (marketType) {
            case 'moneyline':
                return `${betTargetName} ${marketType.toUpperCase()}`;
            case 'spread':
                return `${betTargetName} ${marketType} ${value}`;
            case 'totals':
                return `Total ${overUnder} ${value}`;
            default:
                return '';
            }
        default:
            return `${betTarget} ${marketType} ${value} ${overUnder}`;
    }
}

export const countMarketTypes = (betSlips) => {
    const marketTypeCounts = {};

    const marketMapping = {
        moneyline: 'ML',
        spread: 'SPREAD',
        totals: 'O/U',
        'Player Points': 'PTS',
        'Player Rebounds': 'REB',
        'Player Assists': 'AST',
        'Player Threes': '3PT',
    };

    betSlips.forEach(bet => {
        bet.bets.forEach(betDetail => {
            betDetail.legs.forEach(leg => {
                const marketType = leg.marketType;
                const mappedMarketType = marketMapping[marketType] || marketType; // Use the mapped translation or fallback to the original marketType
                if (!marketTypeCounts[mappedMarketType]) {
                    marketTypeCounts[mappedMarketType] = { total: 0, won: 0 };
                }
                marketTypeCounts[mappedMarketType].total++;
                if (bet.result === '1') {
                    marketTypeCounts[mappedMarketType].won++;
                }
            });
        });
    });

    // Convert the dictionary to an array of objects
    const marketTypeArray = Object.keys(marketTypeCounts).map(marketType => ({
        marketType,
        total: marketTypeCounts[marketType].total,
        won: marketTypeCounts[marketType].won
    }));

    // Calculate the total and won sums
    const totalSum = marketTypeArray.reduce((acc, obj) => acc + obj.total, 0);
    const wonSum = marketTypeArray.reduce((acc, obj) => acc + obj.won, 0);

    // Add the final object with the marketType "TOTAL"
    marketTypeArray.push({
        marketType: 'TOTAL',
        total: totalSum,
        won: wonSum
    });

    return marketTypeArray;
}