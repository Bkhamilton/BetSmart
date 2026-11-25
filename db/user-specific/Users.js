export const getUserByCloudId = async (db, cloudUserId) => {
    try {
        return await db.getFirstAsync('SELECT * FROM Users WHERE cloudUserId = ?', [cloudUserId]);
    } catch (error) {
        console.error('Error getting local account:', error);
        throw error;
    }
};
