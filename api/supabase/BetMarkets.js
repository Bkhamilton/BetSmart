export const getAllRelevantBetMarkets = async (supabase) => {
    try {
        const { data, error } = await supabase
            .rpc('get_all_relevant_bet_markets');
        if (error) {
            console.error('Error getting bet markets:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error getting bet markets:', error);
        throw error;
    }
}

export const getUpcomingBetMarkets = async (supabase) => {
    try {
        const { data, error } = await supabase
            .rpc('get_upcoming_bet_markets');
        if (error) {
            console.error('Error getting upcoming bet markets:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error getting upcoming bet markets:', error);
        throw error;
    }
}

export const getMarketsForGame = async (supabase, gameId) => {
    try {
        const { data, error } = await supabase
            .from('BetMarkets')
            .select('*')
            .eq('gameId', gameId);
        if (error) {
            console.error('Error getting markets for game:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error getting markets for game:', error);
        throw error;
    }
}

export const getLastUpdatedMarket = async (supabase) => {
    try {
        const { data, error } = await supabase
            .from('BetMarkets')
            .select('timestamp')
            .order('timestamp', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error getting last updated market:', error);
            throw error;
        }

        return data.length > 0 ? data[0].timestamp : null;
    } catch (error) {
        console.error('Error getting last updated market:', error);
        throw error;
    }
};

export const insertBetMarket = async (supabase, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) => {
    try {
        const { data, error } = await supabase
            .from('BetMarkets')
            .insert({ 
                gameId: gameId, 
                marketType: marketType, 
                timestamp: timestamp, 
                value: value, 
                odds: odds, 
                overUnder: overUnder, 
                betTargetId: betTargetId, 
                bookieId: bookieId 
            });
        if (error) {
            console.error('Error inserting bet market:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error inserting bet market:', error);
        throw error;
    }
}

export const clearGameBetMarkets = async (supabase, gameId) => {
    try {
        const { data, error } = await supabase
            .from('BetMarkets')
            .delete()
            .eq('gameId', gameId);
        if (error) {
            console.error('Error clearing bet markets:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error clearing bet markets:', error);
        throw error;
    }
}