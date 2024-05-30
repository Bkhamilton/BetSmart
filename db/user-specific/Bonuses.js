import * as SQLite from 'expo-sqlite';

// Function to get a user's bonuses
export const getBonuses = async (db, userId) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Bonuses WHERE userId = ?', [userId]);
        return allRows;
    } catch (error) {
        console.error('Error getting bonuses:', error);
        throw error;
    }
};

// Function to insert a bonus
export const insertBonus = async (db, bookieId, userId, bonusType, bonusAmount, timestamp, description) => {
    try {
        const result = await db.runAsync('INSERT INTO Bonuses (bookieId, userId, bonusType, bonusAmount, timestamp, description) VALUES (?, ?, ?, ?, ?, ?)', [bookieId, userId, bonusType, bonusAmount, timestamp, description]);
        console.log(result);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting bonus:', error);
        throw error;
    }
};

// Function to update a bonus
export const updateBonus = async (db, bonusId, bonusType, bonusAmount, timestamp, description) => {
    try {
        await db.runAsync('UPDATE Bonuses SET bonusType = ?, bonusAmount = ?, timestamp = ?, description = ? WHERE id = ?', [bonusType, bonusAmount, timestamp, description, bonusId]);
        console.log("Bonus updated");
    } catch (error) {
        console.error('Error updating bonus:', error);
        throw error;
    }
};

// Function to delete a bonus
export const deleteBonus = async (db, bonusId) => {
    try {
        await db.runAsync('DELETE FROM Bonuses WHERE id = ?', [bonusId]);
    } catch (error) {
        console.error('Error deleting bonus:', error);
        throw error;
    }
};
