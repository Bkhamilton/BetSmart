// app/contexts/BetContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Game {
  home_team: string;
  away_team: string;
  start_timestamp: number;
  game_id: string;
}

interface BetContextValue {
  betSlip: any[];
  setBetSlip: (betSlip: any[]) => void;
  currentGame: Game | null;
  setCurrentGame: (game: Game | null) => void;
}

export const BetContext = createContext<BetContextValue>({
  betSlip: [],
  setBetSlip: () => {},
  currentGame: null,
  setCurrentGame: () => {},
});

interface BetContextProviderProps {
  children: ReactNode;
}

export const BetContextProvider = ({ children }: BetContextProviderProps) => {
  const [betSlip, setBetSlip] = useState<any[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  const value = {
    betSlip,
    setBetSlip,
    currentGame,
    setCurrentGame,
  };

  return (
    <BetContext.Provider value={value}>
      {children}
    </BetContext.Provider>
  );
};