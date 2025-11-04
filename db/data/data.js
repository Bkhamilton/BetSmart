// Function to get total profit from bet slips for a specific user over a specific period
export const getProfitByPeriod = async (db, userId, period) => {
    try {
        // Optimized query to calculate profit in a single pass
        const result = await db.getAllAsync(`
            SELECT 
                COALESCE(SUM(
                    CASE 
                        WHEN R.result = 1 THEN B.winnings - B.betAmount
                        WHEN R.result = 0 THEN -B.betAmount
                        ELSE 0
                    END
                ), 0) AS totalProfit
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND B.date >= date('now', ?)
            `, [userId, period]);
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
        // Optimized query to calculate win rate in a single query
        const result = await db.getAllAsync(`
            SELECT 
                COUNT(*) as totalCount,
                SUM(CASE WHEN R.result = 1 THEN 1 ELSE 0 END) as wonCount
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND B.date >= date('now', ?)
        `, [userId, period]);
        
        const { totalCount, wonCount } = result[0];
        return totalCount > 0 ? (wonCount / totalCount) * 100 : 0;
    } catch (error) {
        console.error('Error getting win rate:', error);
        throw error;
    }
}

// Function to get ROI by user and period
export const getROIByPeriod = async (db, userId, period) => {
    try {
        // Optimized query to calculate ROI in a single query
        const result = await db.getAllAsync(`
            SELECT 
                COALESCE(SUM(B.betAmount), 0) as totalBetAmount,
                COALESCE(SUM(
                    CASE 
                        WHEN R.result = 1 THEN B.winnings - B.betAmount
                        WHEN R.result = 0 THEN -B.betAmount
                        ELSE 0
                    END
                ), 0) AS totalProfit
            FROM 
                BetSlips B
            LEFT JOIN 
                BetSlipsResults R ON B.id = R.betSlipId
            WHERE 
                B.userId = ? AND B.date >= date('now', ?)
        `, [userId, period]);
        
        const { totalBetAmount, totalProfit } = result[0];
        return totalBetAmount > 0 ? (totalProfit / totalBetAmount) * 100 : 0;
    } catch (error) {
        console.error('Error getting ROI:', error);
        throw error;
    }
}
    }
}