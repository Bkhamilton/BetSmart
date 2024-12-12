export const getAllLeagueProps = async (supabase) => {
    const { data, error } = await supabase
        .from('LeagueProps')
        .select('*');

    if (error) {
        console.error('Error getting league props:', error);
        throw error;
    }

    return data;
}