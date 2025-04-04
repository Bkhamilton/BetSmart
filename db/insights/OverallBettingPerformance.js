export const getOverallBettingPerformance = async (db, userId) => {
    try {
        const query = `
            SELECT *
            FROM OverallBettingPerformance
            WHERE userId = ?
        `;
        const results = await db.getAllAsync(query, [userId]);
        return results;
    } catch (error) {
        console.error('Error getting overall betting performance:', error);
        throw error;
    }
};