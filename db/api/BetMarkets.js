import * as SQLite from 'expo-sqlite';

// Function to get all bet markets
export const getAllBetMarkets = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM BetMarkets');
        return allRows;
    } catch (error) {
        console.error('Error getting all bet markets:', error);
        throw error;
    }
};

// Function to get a bet market
export const getBetMarket = async (db, betMarketId) => {
    try {
        const betMarket = await db.getAllAsync('SELECT * FROM BetMarkets WHERE id = ?', [betMarketId]);
        return betMarket;
    } catch (error) {
        console.error('Error getting bet market:', error);
        throw error;
    }
};

// Function to get bet market that matches Leg object
export const getBetMarketByLeg = async (db, gameId, leg) => {
    try {
        const betMarket = await db.getAllAsync('SELECT * FROM BetMarkets WHERE gameId = ? AND marketType = ? AND value = ? AND odds = ? AND overUnder = ? AND betTargetId = ?', [gameId, leg.stat, leg.line, leg.odds, leg.overUnder, leg.betTarget]);
        return betMarket[0];
    } catch (error) {
        console.error('Error getting bet market by leg:', error);
        throw error;
    }
};

// Function to return the most recent timestamp for any bet market
export const getLastUpdatedMarket = async (db) => {
    try {
        const lastUpdatedMarket = await db.getAllAsync('SELECT MAX(timestamp) as lastUpdated FROM BetMarkets');
        return lastUpdatedMarket[0].lastUpdated;
    } catch (error) {
        console.error('Error getting last updated market:', error);
        throw error;
    }
};

// Function to get all bet markets for a game and market type
export const getBetMarketByGame = async (db, gameId, marketType) => {
    try {
        const allRows = await db.getAllAsync(`
        SELECT 
            bm.*, 
            bt.targetName as targetName
        FROM 
            BetMarkets bm
        JOIN 
            BetTargets bt ON bm.betTargetId = bt.id
        WHERE 
            bm.gameId = ? AND bm.marketType = ?
        `, [gameId, marketType]);
        return allRows;
    } catch (error) {
        console.error('Error getting bet markets by game and market type:', error);
        throw error;
    }
};

// Function to get all bet markets for a game
export const getBetMarketByGameId = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM BetMarkets WHERE gameId = ?', [gameId]);
        return allRows;
    } catch (error) {
        console.error('Error getting bet markets by game:', error);
        throw error;
    }
};

// Function to insert a bet market
export const insertBetMarket = async (db, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) => {
    try {
        const result = await db.runAsync('INSERT INTO BetMarkets (gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting bet market:', error);
        throw error;
    }
};

// Function to insert a full bet market
export const insertFullBetMarket = async (db, id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) => {
    try {
        const result = await db.runAsync('INSERT INTO BetMarkets (id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting full bet market:', error);
        throw error;
    }
};

// Function to update a bet market
export const updateBetMarket = async (db, betMarketId, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) => {
    try {
        await db.runAsync('UPDATE BetMarkets SET gameId = ?, marketType = ?, timestamp = ?, value = ?, odds = ?, overUnder = ?, betTargetId = ?, bookieId = ? WHERE id = ?', [gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId, betMarketId]);
    } catch (error) {
        console.error('Error updating bet market:', error);
        throw error;
    }
};

// Function to delete a bet market
export const deleteBetMarket = async (db, betMarketId) => {
    try {
        await db.runAsync('DELETE FROM BetMarkets WHERE id = ?', [betMarketId]);
    } catch (error) {
        console.error('Error deleting bet market:', error);
        throw error;
    }
};

// Function to delete all bet markets for a game
export const clearGameBetMarkets = async (db, gameId) => {
    try {
        await db.runAsync('DELETE FROM BetMarkets WHERE gameId = ?', [gameId]);
    } catch (error) {
        console.error('Error deleting bet markets by game:', error);
        throw error;
    }
};

export const getMoneyline = async (db, gameId) => {
    try {
        const moneyline = await db.getAllAsync(`
        SELECT 
            bm.id,
            bm.gameId,
            bm.marketType,
            bm.timestamp,
            bm.value,
            bm.odds,
            bm.overUnder,
            bm.betTargetId,
            bm.bookieId
        FROM 
            BetMarkets bm
        INNER JOIN (
            SELECT 
            betTargetId, 
            MIN(timestamp) as oldestTimestamp
            FROM 
            BetMarkets
            WHERE 
            gameId = ? AND marketType = "moneyline"
            GROUP BY 
            betTargetId
        ) oldest ON bm.betTargetId = oldest.betTargetId AND bm.timestamp = oldest.oldestTimestamp
        WHERE 
            bm.gameId = ? AND bm.marketType = "moneyline"
        `, [gameId, gameId]);
        return moneyline;
    } catch (error) {
        console.error('Error getting moneyline:', error);
        throw error;
    }
}

export const getSpread = async (db, gameId) => {
    try {
        const spread = await db.getAllAsync('SELECT * FROM BetMarkets WHERE gameId = ? AND marketType = "spread"', [gameId]);
        return spread;
    } catch (error) {
        console.error('Error getting spread:', error);
        throw error;
    }
}

export const getTotalOverUnder = async (db, gameId) => {
    try {
        const totalOverUnder = await db.getAllAsync('SELECT * FROM BetMarkets WHERE gameId = ? AND marketType = "totals"', [gameId]);
        return totalOverUnder;
    } catch (error) {
        console.error('Error getting total over under:', error);
        throw error;
    }
}

// Function to check if marketTypes 'moneyline', 'spread' and 'totals' all exist for a given gameId
export const checkBetMarketsExist = async (db, gameId) => {
    try {
        const moneyline = await getMoneyline(db, gameId);
        const spread = await getSpread(db, gameId);
        const totalOverUnder = await getTotalOverUnder(db, gameId);

        if (moneyline.length > 0 && spread.length > 0 && totalOverUnder.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if bet markets exist:', error);
        throw error;
    }
}

// Function to check if any one of marketTypes 'moneyline', 'spread' and 'totals' exist for a given gameId
export const checkIfAnyBetMarketsExist = async (db, gameId) => {
    try {
        const moneyline = await getMoneyline(db, gameId);
        const spread = await getSpread(db, gameId);
        const totalOverUnder = await getTotalOverUnder(db, gameId);

        if (moneyline.length > 0 || spread.length > 0 || totalOverUnder.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if any bet markets exist:', error);
        throw error;
    }
}

// Function to clear all bet markets
export const clearBetMarkets = async (db) => {
    try {
        await db.runAsync('DELETE FROM BetMarkets');
    } catch (error) {
        console.error('Error clearing bet markets:', error);
        throw error;
    }
}