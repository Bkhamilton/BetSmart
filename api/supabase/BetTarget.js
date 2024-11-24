export const getBetTargetId = async (supabase, targetName) => {
    try {
        const { data, error } = await supabase
            .from('BetTargets')
            .select('id')
            .eq('name', targetName)
            .single();
        if (error) {
            console.error('Error fetching bet target id:', error);
            throw error;
        }
        return data.id;
    } catch (error) {
        console.error('Error fetching bet target id:', error);
        throw error;
    }
}

export const insertBetTarget = async (supabase, targetType, targetName, teamId, gameId) => {
    try {
        const { data, error } = await supabase
            .from('BetTargets')
            .insert({ type: targetType, name: targetName, teamId: teamId, gameId: gameId });
        if (error) {
            console.error('Error inserting bet target:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error inserting bet target:', error);
        throw error;
    }
}