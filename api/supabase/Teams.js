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
        .eq('teamName', teamName)
        .single();

    if (error) {
        console.error('Error getting team:', error);
        throw error;
    }

    return data;
}