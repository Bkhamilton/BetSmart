// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import secrets from "@/secrets";

interface SupabaseContextValue {
    supabase?: any;
}

interface League {
    id: number;
    leagueName: string;
    sport: string;
    description: string;
}

export const SupabaseContext = createContext<SupabaseContextValue>({
    supabase: undefined,
});

interface SupabaseContextValueProviderProps {
  children: ReactNode;
}

export const SupabaseContextProvider = ({ children }: SupabaseContextValueProviderProps) => {
    
    const supabaseUrl = secrets.SUPABASE_URL
    const supabaseKey = secrets.SUPABASE_API_KEY
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
          console.error('Error fetching todos:', error.message);
        }
      };
  
      getLeagues();
    }, []);

    const value = {
        supabase,
        leagues,
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};