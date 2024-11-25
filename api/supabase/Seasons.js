export const getSeasonByDate = async (supabase, leagueId, date) => {
    const { data, error } = await supabase
        .from('Seasons')
        .select('*')
        .eq('leagueId', leagueId)
        .lte('startDate', date)
        .gte('endDate', date)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}