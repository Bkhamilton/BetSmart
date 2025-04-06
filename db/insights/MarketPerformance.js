export const getMarketPerformance = async (db, userId) => {
    try {
        const query = `
            SELECT *
            FROM MarketPerformance
            WHERE userId = ?
        `;
        const results = await db.getAllAsync(query, [userId]);
        return results;
    } catch (error) {
        console.error('Error getting market performance:', error);
        throw error;
    }
};