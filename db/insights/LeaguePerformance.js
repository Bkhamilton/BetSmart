export const getLeaguePerformance = async (db, userId) => {
    try {
        const query = `
            SELECT *
            FROM LeaguePerformance
            WHERE userId = ?
        `;
        const results = await db.getAllAsync(query, [userId]);
        return results;
    } catch (error) {
        console.error('Error getting league performance:', error);
        throw error;
    }
};