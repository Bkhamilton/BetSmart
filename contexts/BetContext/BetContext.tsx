// app/contexts/BetContext/BetContext.tsx
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

interface BetSlip {
  id: number;
  type: string;
  date: string;
  odds: number;
  betAmount: number;
  winnings: number;
  bets: Bet[];
}

interface Bet {
  date: string;
  sport: string;
  home: string;
  away: string;
  odds: number;
  legs: Leg[];
}

interface Leg {
  type: string;
  betTarget: string;
  stat: string;
  line: string;
  odds: string;
}

interface BetContextValue {
  betSlip: BetSlip | null;
  setBetSlip: (betSlip: BetSlip | null) => void;
  currentGame: Game | null;
  setCurrentGame: (game: Game | null) => void;
  league: League | null;
  setLeague: (league: League | null) => void;
  bookie: string | null;
  setBookie: (bookie: string | null) => void;
  bookieId: Number | null;
  setBookieId: (bookieId: Number | null) => void;
}

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
});

interface BetContextProviderProps {
  children: ReactNode;
}

export const BetContextProvider = ({ children }: BetContextProviderProps) => {
  const [betSlip, setBetSlip] = useState<BetSlip | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [league, setLeague] = useState<League | null>(null);
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