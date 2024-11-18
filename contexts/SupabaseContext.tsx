// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'
import secrets from "@/secrets";

interface SupabaseContextValue {
    cloudDB?: any;
}

interface League {
    id: number;
    leagueName: string;
    sport: string;
    description: string;
}

export const SupabaseContext = createContext<SupabaseContextValue>({
    cloudDB: undefined,
});

interface SupabaseContextValueProviderProps {
  children: ReactNode;
}

export const SupabaseContextProvider = ({ children }: SupabaseContextValueProviderProps) => {
    
    const supabaseUrl = 'https://tlnmwcwzafhtduqpdabg.supabase.co'
    const supabaseKey = secrets.SUPABASE_API_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    const value = {
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};