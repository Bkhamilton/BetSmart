
export const getAllUpcomingGames = async (supabase) => {
    
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const { data, error } = await supabase
        .from('Games')
        .select('*')
        .gte('date', date)
        .order('date', { ascending: true });
    if (error) {
        throw error;
    }

    return data;
}

export const getUpcomingGames = async (supabase, seasonId) => {
    const { data, error } = await supabase
        .rpc('get_upcoming_games', { input_season_id: seasonId });
    
    if (error) {
        throw error;
    }
    
    return data;
}

export const getGamesByDateAndSeason = async (supabase, date, seasonId) => {
    const { data, error } = await supabase
        .rpc('get_games_by_date_and_season', { input_date: date, input_season_id: seasonId });
    
    if (error) {
        throw error;
    }
    
    return data;
}

export const getGameByTeams = async (supabase, homeTeamId, awayTeamId, timestamp) => {
    const { data, error } = await supabase
        .from('Games')
        .select('*')
        .eq('homeTeamId', homeTeamId)
        .eq('awayTeamId', awayTeamId)
        .eq('timestamp', timestamp);

    if (error) {
        throw error;
    }

    return data ? data[0] : null;
}

export const getGamesForResults = async (supabase, date, seasonId) => {
    const { data, error } = await supabase
        .rpc('get_games_for_results', { input_date: date, input_season_id: seasonId });

    if (error) {
        throw error;
    }

    return data;
}

export const getGameByGameId = async (supabase, gameId) => {
    const { data, error } = await supabase
        .from('Games')
        .select('*')
        .eq('gameId', gameId);

    if (error) {
        throw error;
    }

    return data ? data[0] : null;
}

export const getAllRelevantGames = async (supabase) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
        .from('Games')
        .select('gameId, seasonId, date, timestamp, homeTeamId, awayTeamId')
        .gte('date', oneWeekAgo)
        .order('date');

    if (error) {
        throw error;
    }

    return data;
}

export const insertGame = async (supabase, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) => {
    const { data, error } = await supabase
        .from('Games')
        .insert({ gameId: gameId, seasonId: seasonId, date: date, timestamp: timestamp, homeTeamId: homeTeamId, awayTeamId: awayTeamId });

    if (error) {
        throw error;
    }

    return data;
}
   
