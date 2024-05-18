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
    const betMarket = await db.getAsync('SELECT * FROM BetMarkets WHERE id = ?', [betMarketId]);
    return betMarket;
  } catch (error) {
    console.error('Error getting bet market:', error);
    throw error;
  }
};

// Function to insert a bet market
export const insertBetMarket = async (db, gameId, marketType, value, odds, overUnder, betTargetId, bookieId) => {
  try {
    const result = await db.runAsync('INSERT INTO BetMarkets (gameId, marketType, value, odds, overUnder, betTargetId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?)', [gameId, marketType, value, odds, overUnder, betTargetId, bookieId]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting bet market:', error);
    throw error;
  }
};

// Function to update a bet market
export const updateBetMarket = async (db, betMarketId, gameId, marketType, value, odds, overUnder, betTargetId, bookieId) => {
  try {
    await db.runAsync('UPDATE BetMarkets SET gameId = ?, marketType = ?, value = ?, odds = ?, overUnder = ?, betTargetId = ? bookieId = ? WHERE id = ?', [gameId, marketType, value, odds, overUnder, betTargetId, betMarketId, bookieId]);
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