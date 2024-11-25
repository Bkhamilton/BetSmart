export const getBetTargetId = async (supabase, targetName) => {
    try {
        const { data, error } = await supabase
            .from('BetTargets')
            .select('id')
            .eq('targetName', targetName)
        if (error) {
            console.error('Error fetching bet target id:', error);
            throw error;
        }
        return data ? data[0].id : null;
    } catch (error) {
        console.error('Error fetching bet target id:', error);
        throw error;
    }
}

export const getBetTargetsByGameId = async (supabase, gameId) => {
    try {
        const { data, error } = await supabase
            .from('BetTargets')
            .select('*')
            .eq('gameId', gameId);
        if (error) {
            console.error('Error fetching bet targets by game id:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching bet targets by game id:', error);
        throw error;
    }
}

export const insertBetTarget = async (supabase, targetType, targetName, teamId, gameId) => {
    try {
        const { data, error } = await supabase
            .from('BetTargets')
            .insert({ targetType: targetType, targetName: targetName, teamId: teamId, gameId: gameId })
        if (error) {
            console.error('Error inserting bet target:', error);
            throw error;
        }
        return data ? data[0].id : null;
    } catch (error) {
        console.error('Error inserting bet target:', error);
        throw error;
    }
}