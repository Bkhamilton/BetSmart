// app/contexts/BetContext/BetContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createLeg, createBet, createBetSlip, updateBetSlip, removeLeg } from '@/contexts/BetContext/betSlipHelpers';
import { UserContext } from '../UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import { insertBetSlip } from '@/db/user-specific/BetSlips';
import { insertParticipantBet } from '@/db/user-specific/ParticipantBets';
import { insertLeg } from '@/db/user-specific/Legs';
import { getBetFormat } from '@/db/bet-general/BetFormats';
import { getBetType } from '@/db/bet-general/BetTypes';
import { getBetMarketByLeg } from '@/db/api/BetMarkets';

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
  league: string;
  gameId: string;
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
  overUnder: string;
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
  confirmBetSlip: () => void;
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
  confirmBetSlip: () => {},
});

interface BetContextProviderProps {
  children: ReactNode;
}

export const BetContextProvider = ({ children }: BetContextProviderProps) => {

  const { user } = useContext(UserContext);

  const [betSlip, setBetSlip] = useState<BetSlip | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [league, setLeague] = useState<League | null>(null);
  const [bookie, setBookie] = useState<string | null>('DraftKings');
  const [bookieId, setBookieId] = useState<Number | null>(1);

  const [totalLegs, setTotalLegs] = useState<Number | null>(0);

  const selectProp = (props: { game: any; type: any; target: any; stat: any; value: any; overUnder: any; odds: any; }) => {
    const { game, type, target, stat, value, overUnder, odds } = props;

    const leg = createLeg(type, target, stat, value, overUnder, odds);
    const bet = createBet(game.date, league.leagueName, game.gameId, game.homeTeamName, game.awayTeamName, odds, [leg]);

    const today = new Date();

    if (betSlip) {
      const newBetSlip = updateBetSlip(betSlip, bet, leg);
      if (!newBetSlip) {
        setBetSlip(null);
      }
      setTotalLegs(newBetSlip? newBetSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0);
    } else {
      const newBetSlip = createBetSlip(1, 'Single', today, odds, 0, 0, [bet]);
      setBetSlip(newBetSlip);
      setTotalLegs(1);
    }
  }

  const confirmBetSlip = async (db: any) => {
    try {
      // Create BetSlip in DB
      const betSlipFormat = await getBetFormat(db, betSlip.type);
      console.log('Inserting :', betSlipFormat.id, betSlip.date, betSlip.odds, betSlip.betAmount, betSlip.winnings, user.id, bookieId);
      const betSlipId = await insertBetSlip(db, betSlipFormat.id, betSlip.date, betSlip.odds, betSlip.betAmount, betSlip.winnings, user.id, bookieId);

      for (const bet of betSlip.bets) {
        try {
          // Create ParticipantBet in DB
          const participantBetId = await insertParticipantBet(db, betSlipId, bet.gameId, bet.odds);

          for (const leg of bet.legs) {
            try {
              // Create Leg in DB using ParticipantBetId
              const betMarket = await getBetMarketByLeg(db, leg);
              const betType = await getBetType(db, leg.type);
              await insertLeg(db, participantBetId, betMarket.id, betType.id);
            } catch (legError) {
              console.error('Error inserting leg:', legError);
            }
          }
        } catch (betError) {
          console.error('Error inserting participant bet:', betError);
        }
      }

      setBetSlip(null);
      setTotalLegs(0);
    } catch (error) {
      console.error('Error inserting bet slip:', error);
    }
  };

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
    confirmBetSlip,
  };

  return (
    <BetContext.Provider value={value}>
      {children}
    </BetContext.Provider>
  );
};
