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

export const clearBetMarkets = async (supabase, gameId) => {
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