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