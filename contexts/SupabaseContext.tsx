// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { League, SupabaseContextValue } from '@/constants/types';

export const SupabaseContext = createContext<SupabaseContextValue>({
    supabase: undefined,
});

interface SupabaseContextValueProviderProps {
  children: ReactNode;
}

export const SupabaseContextProvider = ({ children }: SupabaseContextValueProviderProps) => {
    
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY
    const supabase = createClient(
        supabaseUrl || "",
        supabaseKey || "",
        {
          auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          },
        }
    )

    const [leagues, setLeagues] = useState<League[]>([]);

    useEffect(() => {
      const getLeagues = async () => {
        try {
            const { data: leagues, error } = await supabase.from('Leagues').select();
    
            if (error) {
                console.error('Error fetching todos:', error.message);
                return;
            }
    
            if (leagues && leagues.length > 0) {
                setLeagues(leagues);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
      };
  
      getLeagues();
    }, []);

    const value = {
        supabase,
        leagues
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};