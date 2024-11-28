export const getAllBetFormats = async (supabase) => {
    const { data, error } = await supabase
        .from('bet_formats')
        .select('*')
        
    if (error) throw error
    return data
}