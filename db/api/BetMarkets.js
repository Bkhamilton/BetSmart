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

// Function to get bet market that matches Leg object
export const getBetMarketByLeg = async (db, leg) => {
  try {
    const betMarket = await db.getAsync('SELECT * FROM BetMarkets WHERE gameId = ? AND marketType = ? AND value = ? AND odds = ? AND overUnder = ? AND betTargetId = ? AND bookieId = ?', [leg.gameId, leg.marketType, leg.value, leg.odds, leg.overUnder, leg.betTargetId, leg.bookieId]);
    return betMarket;
  } catch (error) {
    console.error('Error getting bet market by leg:', error);
    throw error;
  }
};

// Function to get all bet markets for a game and market type
export const getBetMarketByGame = async (db, gameId, marketType) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM BetMarkets WHERE gameId = ? AND marketType = ?', [gameId, marketType]);
    return allRows;
  } catch (error) {
    console.error('Error getting bet markets by game and market type:', error);
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