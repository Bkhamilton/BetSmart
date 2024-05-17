import * as SQLite from 'expo-sqlite';

// Function to get all bet markets
export const getAllBetMarkets = async (db) => {
  const allRows = await db.getAllAsync('SELECT * FROM BetMarkets');
  return allRows;
};

// Function to get a bet market
export const getBetMarket = async (db, betMarketId) => {
  const betMarket = await db.getAsync('SELECT * FROM BetMarkets WHERE id = ?', [betMarketId]);
  return betMarket;
};

// Function to insert a bet market
export const insertBetMarket = async (db, gameId, marketType, value, odds, overUnder, betTargetId, bookieId) => {
  const result = await db.runAsync('INSERT INTO BetMarkets (gameId, marketType, value, odds, overUnder, betTargetId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?)', [gameId, marketType, value, odds, overUnder, betTargetId, bookieId]);
  return result.lastInsertRowId;
};

// Function to update a bet market
export const updateBetMarket = async (db, betMarketId, gameId, marketType, value, odds, overUnder, betTargetId, bookieId) => {
  await db.runAsync('UPDATE BetMarkets SET gameId = ?, marketType = ?, value = ?, odds = ?, overUnder = ?, betTargetId = ? bookieId = ? WHERE id = ?', [gameId, marketType, value, odds, overUnder, betTargetId, betMarketId, bookieId]);
};

// Function to delete a bet market
export const deleteBetMarket = async (db, betMarketId) => {
  await db.runAsync('DELETE FROM BetMarkets WHERE id = ?', [betMarketId]);
};