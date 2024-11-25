export const getAllLeagues = async (supabase) => {
    try {
        const { data, error } = await supabase
            .from('Leagues')
            .select('*')
        if (error) {
            console.error(error);
            return;
        }
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const getActiveLeagues = async (supabase, date) => {
    try {
        const { data, error } = await supabase
            .rpc('get_active_leagues', { p_date: date });
        if (error) {
            console.error(error);
            return;
        }
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const getLeagueByName = async (supabase, leagueName) => {
    try {
        const { data, error } = await supabase
            .from('Leagues')
            .select('*')
            .eq('leagueName', leagueName)
            .single();
        if (error) {
            console.error(error);
            return;
        }
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const getLeagueId = async (supabase, leagueName) => {
    try {
        const { data, error } = await supabase
            .from('Leagues')
            .select('id')
            .eq('leagueName', leagueName);
        if (error) {
            console.error(error);
            return;
        }
        return data[0];
    } catch (error) {
        console.error(error);
    }
}