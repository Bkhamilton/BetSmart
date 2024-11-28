export const getAllBetTypes = async (supabase) => {
    const { data, error } = await supabase
        .from('bet_types')
        .select('*')
        
    if (error) throw error
    return data
}