import * as SQLite from 'expo-sqlite';

// Function to get a participant bet result
export const getParticipantBetResult = async (db, participantBetId) => {
    try {
        const result = await db.getAsync('SELECT * FROM ParticipantBetsResults WHERE participantBetId = ?', [participantBetId]);
        return result;
    } catch (error) {
        console.error('Error getting participant bet result:', error);
        throw error;
    }
};

// Function to insert a participant bet result
export const insertParticipantBetResult = async (db, participantBetId, result) => {
    try {
        const res = await db.runAsync('INSERT INTO ParticipantBetsResults (participantBetId, result) VALUES (?, ?)', [participantBetId, result]);
        console.log(res);
        return res.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting participant bet result:', error);
        throw error;
    }
};

// Function to update a participant bet result
export const updateParticipantBetResult = async (db, participantBetId, result) => {
    try {
        await db.runAsync('UPDATE ParticipantBetsResults SET result = ? WHERE participantBetId = ?', [result, participantBetId]);
        console.log("Participant bet result updated");
    } catch (error) {
        console.error('Error updating participant bet result:', error);
        throw error;
    }
};

// Function to delete a participant bet result
export const deleteParticipantBetResult = async (db, participantBetId) => {
    try {
        await db.runAsync('DELETE FROM ParticipantBetsResults WHERE participantBetId = ?', [participantBetId]);
    } catch (error) {
        console.error('Error deleting participant bet result:', error);
        throw error;
    }
};
