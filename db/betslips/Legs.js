import * as SQLite from 'expo-sqlite';

// Function to get all legs
export const getAllLegs = async (db) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM Legs');
    return allRows;
  } catch (error) {
    console.error('Error getting all legs:', error);
    throw error;
  }
};

// Function to get all Legs for a given array of participantBetIds
export const getAllValidLegs = async (db, participantBetIds) => {
  try {
    // Construct placeholders for the array elements
    const placeholders = participantBetIds.map(() => '?').join(',');

    // Construct the SQL query
    const query = `
      SELECT 
        Legs.id AS legId,
        Legs.participantBetId AS participantBetId, 
        Legs.betMarketId AS betMarketId,
        BetMarkets.marketType AS marketType, 
        BetMarkets.value AS value, 
        BetMarkets.odds AS odds, 
        BetMarkets.overUnder AS overUnder, 
        BetTargets.id AS betTargetId,
        BetTargets.targetName AS betTarget,
        BetTargets.targetType AS targetType,
        BetTypes.id AS betTypeId, 
        BetTypes.betType AS betType
      FROM 
        Legs 
      JOIN 
        BetMarkets ON Legs.betMarketId = BetMarkets.id 
      JOIN
        BetTargets ON BetMarkets.betTargetId = BetTargets.id
      JOIN 
        BetTypes ON Legs.betTypeId = BetTypes.id
      WHERE 
        Legs.participantBetId IN (${placeholders})
    `;

    const allRows = await db.getAllAsync(query, participantBetIds);
    return allRows;
  } catch (error) {
    console.error('Error getting all legs for participant bets:', error);
    throw error;
  }
};

// Function to get a leg
export const getLeg = async (db, legId) => {
  try {
    const query = `
      SELECT * 
      FROM Legs 
      WHERE id = ?
    `;
    const leg = await db.getAsync(query, [legId]);
    return leg;
  } catch (error) {
    console.error('Error getting leg:', error);
    throw error;
  }
};

// Function to get Favorite Bet for a given userId
export const getFavoriteBetType = async (db, userId) => {
  try {
    const favoriteBet = await db.getAllAsync(`
      SELECT 
        COUNT(*) as count,
        BetMarkets.marketType as name
      FROM 
        BetSlips
      JOIN 
        ParticipantBets ON BetSlips.id = ParticipantBets.betSlipId
      JOIN 
        Legs ON ParticipantBets.id = Legs.participantBetId
      JOIN 
        BetMarkets ON Legs.betMarketId = BetMarkets.id
      WHERE 
        BetSlips.userId = ?
      GROUP BY 
        BetMarkets.marketType
      ORDER BY 
        count DESC
    `, [userId]);
    return favoriteBet[0];
  } catch (error) {
    console.error('Error getting favorite bet:', error);
    throw error;
  }
};

// Function to insert a leg
export const insertLeg = async (db, participantBetId, betMarketId, betTypeId) => {
  try {
    const query = `
      INSERT INTO Legs (participantBetId, betMarketId, betTypeId) 
      VALUES (?, ?, ?)
    `;
    const resultDB = await db.runAsync(query, [participantBetId, betMarketId, betTypeId]);
    return resultDB.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting leg:', error);
    throw error;
  }
};

// Function to update a leg
export const updateLeg = async (db, legId, participantBetId, betMarketId, betTypeId) => {
  try {
    const query = `
      UPDATE Legs 
      SET participantBetId = ?, betMarketId = ?, betTypeId = ? 
      WHERE id = ?
    `;
    await db.runAsync(query, [participantBetId, betMarketId, betTypeId, legId]);
  } catch (error) {
    console.error('Error updating leg:', error);
    throw error;
  }
};

// Function to delete a leg
export const deleteLeg = async (db, legId) => {
  try {
    await db.runAsync('DELETE FROM Legs WHERE id = ?', [legId]);
  } catch (error) {
    console.error('Error deleting leg:', error);
    throw error;
  }
};

export const deleteLegsByParticipantBetId = async (db, participantBetId) => {
  try {
    await db.runAsync('DELETE FROM Legs WHERE participantBetId = ?', [participantBetId]);
  } catch (error) {
    console.error('Error deleting legs:', error);
    throw error;
  }
}
