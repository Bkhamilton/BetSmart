// Function to get total profit from bet slips for a specific user over a specific period
export const getProfitByPeriod = async (db, userId, period) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COALESCE(
                    (SELECT SUM(B.winnings) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND B.date >= date('now', ?) AND R.result = 1), 0) 
                - 
                COALESCE(
                    (SELECT SUM(B.betAmount) 
                     FROM BetSlips B
                     LEFT JOIN BetSlipsResults R ON B.id = R.betSlipId
                     WHERE B.userId = ? AND B.date >= date('now', ?) AND R.result = 0), 0) 
                AS totalProfit
            `, [userId, period, userId, period]);
        return result[0].totalProfit;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get total bet amount from bet slips for a specific user over a specific period
export const getTotalBetAmountByPeriod = async (db, userId, period) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COALESCE(
                    (SELECT SUM(B.betAmount) 
                     FROM BetSlips B
                     WHERE B.userId = ? AND B.date >= date('now', ?)), 0) 
                AS totalBetAmount
            `, [userId, period]);
        return result[0].totalBetAmount;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get total number of bets won by user and period
export const getWonBetSlipCountByPeriod = async (db, userId, period) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(R.result) as count
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND R.result = 1 AND B.date >= date('now', ?)`, [userId, period]);
        return result[0].count;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get total number of bets placed by user and period
export const getTotalBetCountByPeriod = async (db, userId, period) => {
    try {
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(*) as count
            FROM 
                BetSlips B
            WHERE 
                B.userId = ? AND B.date >= date('now', ?)`, [userId, period]);
        return result[0].count;
    } catch (error) {
        console.error('Error getting bet slip result:', error);
        throw error;
    }
};

// Function to get Win Rate by user and period
export const getWinRateByPeriod = async (db, userId, period) => {
    try {
        const wonCount = await getWonBetSlipCountByPeriod(db, userId, period);
        const totalBetCount = await getTotalBetCountByPeriod(db, userId, period);
        return totalBetCount > 0 ? (wonCount / totalBetCount) * 100 : 0;
    } catch (error) {
        console.error('Error getting win rate:', error);
        throw error;
    }
}

// Function to get ROI by user and period
export const getROIByPeriod = async (db, userId, period) => {
    try {
        const totalProfit = await getProfitByPeriod(db, userId, period);
        const totalBetAmount = await getTotalBetAmountByPeriod(db, userId, period);
        return totalBetAmount > 0 ? (totalProfit / totalBetAmount) * 100 : 0;
    } catch (error) {
        console.error('Error getting ROI:', error);
        throw error;
    }
}