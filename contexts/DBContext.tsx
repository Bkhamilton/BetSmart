// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllBookies } from '@/db/general/Bookies';
import { getAllLeagues } from '@/db/general/Leagues';

interface Bookie {
    id: number;
    name: string;
    description: string;
}

interface League {
    id: number;
    leagueName: string;
    sport: string;
    description: string;
}

interface DBContextValue {
    db: any;
    bookies: Bookie[];
    setBookies: (bookies: Bookie[]) => void;
    leagues: League[];
    setLeagues: (leagues: League[]) => void;
}

export const DBContext = createContext<DBContextValue>({
    db: null,
    bookies: [],
    setBookies: () => {},
    leagues: [],
    setLeagues: () => {},
});

interface DBContextValueProviderProps {
  children: ReactNode;
}

export const DBContextProvider = ({ children }: DBContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [bookies, setBookies] = React.useState<Bookie[]>([]);
    const [leagues, setLeagues] = React.useState<League[]>([]);

    useEffect(() => {
        if (db) {
            getAllBookies(db).then((result) => {
                setBookies(result);
            });
            getAllLeagues(db).then((result) => {
                setLeagues(result);
            });
        }
    }, [db]);

    const value = {
        db,
        bookies,
        leagues,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};