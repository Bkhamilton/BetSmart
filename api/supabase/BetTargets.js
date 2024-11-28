export const getAllRelevantBetTargets = async (supabase) => {
    try {
        const { data, error } = await supabase
            .rpc('get_all_relevant_bet_targets');
        if (error) {
            console.error('Error fetching bet targets:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching bet targets:', error);
        throw error;
    }
}

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
            .select('id');
        if (error) {
            console.error('Error inserting bet target:', error);
            throw error;
        }
        return data[0].id;
    } catch (error) {
        console.error('Error inserting bet target:', error);
        throw error;
    }
}