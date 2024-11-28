export const getAllRelevantGameResults = async (supabase) => {
    const { data, error } = await supabase
        .rpc('get_all_relevant_game_results');

    if (error) {
        throw error;
    }

    return data;
}

export const insertGameResult = async (supabase, gameId, homeScore, awayScore, winner) => {
    const { data, error } = await supabase
        .from('GameResults')
        .insert([
            {
                gameId,
                homeScore,
                awayScore,
                winner,
            }
        ]);

    if (error) {
        throw error;
    }

    return data ? data[0].id : null;
}