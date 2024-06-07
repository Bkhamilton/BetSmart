// app/contexts/BetContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Game {
  id: number;
  gameId: string;
  date: string;
  timestamp: string;
  homeTeamName: string;
  homeTeamAbv: string;
  awayTeamName: string;
  awayTeamAbv: string;
}

interface League {
  id: number;
  leagueName: string;
  sport: string;
  description: string;
}

interface BetContextValue {
  betSlip: any[];
  setBetSlip: (betSlip: any[]) => void;
  currentGame: Game | null;
  setCurrentGame: (game: Game | null) => void;
  league: string | null;
  setLeague: (league: string | null) => void;
  bookie: string | null;
  setBookie: (bookie: string | null) => void;
  bookieId: Number | null;
  setBookieId: (bookieId: Number | null) => void;
}

export const BetContext = createContext<BetContextValue>({
  betSlip: [],
  setBetSlip: () => {},
  currentGame: null,
  setCurrentGame: () => {},
  league: null,
  setLeague: () => {},
  bookie: null,
  setBookie: () => {},
  bookieId: null,
  setBookieId: () => {},
});

interface BetContextProviderProps {
  children: ReactNode;
}

export const BetContextProvider = ({ children }: BetContextProviderProps) => {
  const [betSlip, setBetSlip] = useState<any[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [league, setLeague] = useState<string | null>(null);
  const [bookie, setBookie] = useState<string | null>('DraftKings');
  const [bookieId, setBookieId] = useState<Number | null>(1);

  const value = {
    betSlip,
    setBetSlip,
    currentGame,
    setCurrentGame,
    league,
    setLeague,
    bookie,
    setBookie,
    bookieId,
    setBookieId,
  };

  return (
    <BetContext.Provider value={value}>
      {children}
    </BetContext.Provider>
  );
};