export const addPlayer = async (supabase, name, position, number, image, teamId) => {
    const { data, error } = await supabase
        .from('Players')
        .insert([
            { name, position, number, image, teamId }
        ]);

    if (error) {
        console.error('Error inserting player:', error);
        return null;
    }

    return data;
};

export const getAllPlayers = async (supabase) => {
    const { data, error } = await supabase
        .from('Players')
        .select('*');

    if (error) {
        console.error('Error getting players:', error);
        throw error;
    }

    return data;
};