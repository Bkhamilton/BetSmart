// app/contexts/BetContext/BetContext.tsx
// This file now serves as a compatibility layer, re-exporting the separate contexts
// for backward compatibility with existing code that imports from BetContext

import React, { createContext, useContext, ReactNode } from 'react';
import { BetContextValue } from '@/constants/types';
import { GameContext, GameContextProvider } from '../GameContext';
import { LeagueContext, LeagueContextProvider } from '../LeagueContext';
import { BookieSelectionContext, BookieSelectionContextProvider } from '../BookieSelectionContext';
import { BetSlipContext, BetSlipContextProvider } from '../BetSlipContext';

// Create a combined context that provides all the values from the separate contexts
export const BetContext = createContext<BetContextValue>({
    betSlip: null,
    setBetSlip: () => {},
    currentGame: null,
    setCurrentGame: () => {},
    league: null,
    setLeague: () => {},
    bookie: null,
    setBookie: () => {},
    bookieId: null,
    setBookieId: () => {},
    selectProp: () => {},
    totalLegs: null,
    setTotalLegs: () => {},
    confirmBetSlip: async () => {},
});

interface BetContextProviderProps {
    children: ReactNode;
}

// Custom hook to combine all the separate contexts into one
export const useCombinedBetContext = (): BetContextValue => {
    const gameContext = useContext(GameContext);
    const leagueContext = useContext(LeagueContext);
    const bookieContext = useContext(BookieSelectionContext);
    const betSlipContext = useContext(BetSlipContext);

    return {
        ...gameContext,
        ...leagueContext,
        ...bookieContext,
        ...betSlipContext,
    };
};

// Wrapper component that provides the combined context
const BetContextWrapper = ({ children }: { children: ReactNode }) => {
    const combinedValue = useCombinedBetContext();

    return (
        <BetContext.Provider value={combinedValue}>
            {children}
        </BetContext.Provider>
    );
};

// Main provider that wraps all the separate context providers
export const BetContextProvider = ({ children }: BetContextProviderProps) => {
    return (
        <GameContextProvider>
            <LeagueContextProvider>
                <BookieSelectionContextProvider>
                    <BetSlipContextProvider>
                        <BetContextWrapper>
                            {children}
                        </BetContextWrapper>
                    </BetSlipContextProvider>
                </BookieSelectionContextProvider>
            </LeagueContextProvider>
        </GameContextProvider>
    );
};
