export const getAllLeaguePropsInfo = async (supabase) => {
    const { data, error } = await supabase
        .from('LeaguePropsInfo')
        .select('*');

    if (error) {
        console.error('Error getting league props info:', error);
        throw error;
    }

    return data;
}