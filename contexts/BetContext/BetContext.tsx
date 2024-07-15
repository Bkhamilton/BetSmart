// app/contexts/BetContext/BetContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { createLeg, createBet, createBetSlip, updateBetSlip, removeLeg } from '@/contexts/BetContext/betSlipHelpers';

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

interface Bookie {
  id: number;
  name: string;
  description: string;
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
  selectProp: (props: { game: any; type: any; target: any; stat: any; value: any; overUnder: any; odds: any; }) => void;
  totalLegs: Number | null;
  setTotalLegs: (totalLegs: number) => void;
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
  selectProp: () => {},
  totalLegs: null,
  setTotalLegs: () => {},
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

  const [totalLegs, setTotalLegs] = useState<Number | null>(0);

  const selectProp = (props: { game: any; type: any; target: any; stat: any; value: any; overUnder: any; odds: any; }) => {
    const { game, type, target, stat, value, overUnder, odds } = props;

    const leg = createLeg(type, target, stat, value, overUnder, odds);
    const bet = createBet(game.date, league.leagueName, game.homeTeamName, game.awayTeamName, odds, [leg]);

    const today = new Date();

    if (betSlip) {
      const newBetSlip = updateBetSlip(betSlip, bet, leg);
      setBetSlip(newBetSlip);
      setTotalLegs(newBetSlip.bets.reduce((total, bet) => total + bet.legs.length, 0));
    } else {
      const newBetSlip = createBetSlip(1, 'Single', today, odds, 0, 0, [bet]);
      setBetSlip(newBetSlip);
      setTotalLegs(1);
    }
  }

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
    selectProp,
    totalLegs,
    setTotalLegs,
  };

  return (
    <BetContext.Provider value={value}>
      {children}
    </BetContext.Provider>
  );
};