// Function to get all relevant game results
export const getAllRelevantGameResults = async (supabase) => {
    const { data, error } = await supabase
        .rpc('get_all_relevant_game_results');

    if (error) {
        throw error;
    }

    return data;
}

// Function to get game results for a game
export const getGameResultsForGame = async (supabase, gameId) => {
    const { data, error } = await supabase
        .from('GameResults')
        .select('*')
        .eq('gameId', gameId);

    if (error) {
        throw error;
    }

    return data;
}

// Function to insert a game result
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