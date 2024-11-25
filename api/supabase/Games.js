
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

export const insertGame = async (supabase, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) => {
    const { data, error } = await supabase
        .from('Games')
        .insert({ gameId: gameId, seasonId: seasonId, date: date, timestamp: timestamp, homeTeamId: homeTeamId, awayTeamId: awayTeamId });

    if (error) {
        throw error;
    }

    return data;
}
    