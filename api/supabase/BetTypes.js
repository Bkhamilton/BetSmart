export const getAllBetTypes = async (supabase) => {
    const { data, error } = await supabase
        .from('BetTypes')
        .select('*')
        
    if (error) throw error
    return data
}