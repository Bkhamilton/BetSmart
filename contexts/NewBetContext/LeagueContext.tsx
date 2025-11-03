// app/contexts/LeagueContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { League, LeagueContextValue } from '@/constants/types';

export const LeagueContext = createContext<LeagueContextValue>({
    league: null,
    setLeague: () => {},
});

interface LeagueContextProviderProps {
    children: ReactNode;
}

export const LeagueContextProvider = ({ children }: LeagueContextProviderProps) => {
    const [league, setLeague] = useState<League | null>(null);

    const value = {
        league,
        setLeague,
    };

    return (
        <LeagueContext.Provider value={value}>
            {children}
        </LeagueContext.Provider>
    );
};
