export const getBookieId = async (supabase, bookieName) => {
    try {
        const { data, error } = await supabase
            .from('Bookies')
            .select('id')
            .eq('name', bookieName)
            .single();
        if (error) {
            console.error('Error fetching bookie id:', error);
            throw error;
        }
        return data.id;
    } catch (error) {
        console.error('Error fetching bookie id:', error);
        throw error;
    }
}

export const getAllBookies = async (supabase) => {
    try {
        const { data, error } = await supabase
            .from('Bookies')
            .select('*');
        if (error) {
            console.error('Error fetching bookies:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching bookies:', error);
        throw error;
    }
} 