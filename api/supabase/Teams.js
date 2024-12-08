export const addTeam = async (supabase, teamName, abbreviation, leagueId, logoUrl) => {
    const { data, error } = await supabase
        .from('Teams')
        .insert({ teamName: teamName, abbreviation: abbreviation, leagueId: leagueId, logoUrl: logoUrl })
            

    if (error) {
        console.error('Error adding team:', error);
        throw error;
    }

    return data;
}

export const getTeamByName = async (supabase, teamName) => {
    const { data, error } = await supabase
        .from('Teams')
        .select('*')
        .eq('teamName', teamName);

    if (error) {
        console.error('Error getting team:', error);
        throw error;
    }

    return data;
}

export const getTeamId = async (supabase, teamName) => {
    const { data, error } = await supabase
        .from('Teams')
        .select('id')
        .eq('teamName', teamName);

    if (error) {
        console.error('Error getting team:', error);
        throw error;
    }

    return data ? data[0].id : null;
}

export const getTeamsByLeagueId = async (supabase, leagueId) => {
    const { data, error } = await supabase
        .from('Teams')
        .select('*')
        .eq('leagueId', leagueId);

    if (error) {
        console.error('Error getting teams:', error);
        throw error;
    }

    return data;
}

export const getAllTeams = async (supabase) => {
    const { data, error } = await supabase
        .from('Teams')
        .select('*');

    if (error) {
        console.error('Error getting teams:', error);
        throw error;
    }

    return data;
}