export const getAllBetFormats = async (supabase) => {
    const { data, error } = await supabase
        .from('BetFormats')
        .select('*')
        
    if (error) throw error
    return data
}