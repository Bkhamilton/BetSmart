// app/contexts/GameContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { Game, GameContextValue } from '@/constants/types';

export const GameContext = createContext<GameContextValue>({
    currentGame: null,
    setCurrentGame: () => {},
});

interface GameContextProviderProps {
    children: ReactNode;
}

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
    const [currentGame, setCurrentGame] = useState<Game | null>(null);

    const value = {
        currentGame,
        setCurrentGame,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
