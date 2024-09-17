// Function to get a leg result
export const getLegResult = async (db, legId) => {
    try {
        const row = await db.getAsync('SELECT * FROM LegsResults WHERE legId = ?', [legId]);
        return row;
    } catch (error) {
        console.error('Error getting leg result:', error);
        throw error;
    }
};

// Function to insert a leg result
export const insertLegResult = async (db, legId, result) => {
    try {
        const res = await db.runAsync('INSERT INTO LegsResults (legId, result) VALUES (?, ?)', [legId, result]);
        return res.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting leg result:', error);
        throw error;
    }
};

// Function to update a leg result
export const updateLegResult = async (db, legId, result) => {
    try {
        await db.runAsync('UPDATE LegsResults SET result = ? WHERE legId = ?', [result, legId]);
        console.log("Leg result updated");
    } catch (error) {
        console.error('Error updating leg result:', error);
        throw error;
    }
};

// Function to delete a leg result
export const deleteLegResult = async (db, legId) => {
    try {
        await db.runAsync('DELETE FROM LegsResults WHERE legId = ?', [legId]);
    } catch (error) {
        console.error('Error deleting leg result:', error);
        throw error;
    }
};
