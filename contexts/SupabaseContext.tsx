// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { League, SupabaseContextValue } from '@/constants/types';

export const SupabaseContext = createContext<SupabaseContextValue>({
    supabase: undefined,
});

interface SupabaseContextValueProviderProps {
  children: ReactNode;
}

export const SupabaseContextProvider = ({ children }: SupabaseContextValueProviderProps) => {
    
    const [leagues, setLeagues] = useState<League[]>([]);

    useEffect(() => {
      const getLeagues = async () => {
        try {
            const { data: leagues, error } = await supabase!.from('Leagues').select();
    
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
  
      if (supabase) getLeagues();
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