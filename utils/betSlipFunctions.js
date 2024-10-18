
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
            case 'total_over_under':
                return `Total ${overUnder} ${value}`;
            default:
                return '';
            }
        default:
            return `${betTarget} ${marketType} ${value} ${overUnder}`;
    }
}