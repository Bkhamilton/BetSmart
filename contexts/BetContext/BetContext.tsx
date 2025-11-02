// app/contexts/BetContext/BetContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createLeg, createBet, createBetSlip, updateBetSlip, removeLeg } from '@/contexts/BetContext/betSlipHelpers';
import { UserContext } from '../UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import { insertBetSlip } from '@/db/betslips/BetSlips';
import { insertParticipantBet } from '@/db/betslips/ParticipantBets';
import { insertLeg } from '@/db/betslips/Legs';
import { insertBetMarket, insertFullBetMarket } from '@/db/api/BetMarkets';
import { getBetFormat } from '@/db/bet-general/BetFormats';
import { getBetType } from '@/db/bet-general/BetTypes';
import { getBetMarketByLeg } from '@/db/api/BetMarkets';
import { getBetTargetId } from '@/db/bet-general/BetTargets'
import { updateUserBalance } from '@/db/user-specific/Balance';
import { Game, League, BetSlip, Bet, Leg, Bookie, BetContextValue } from '@/constants/types';

const USER_GENERATED_ID_START = 1000001;

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

export const BetContextProvider = ({ children }: BetContextProviderProps) => {

    const { user, setUserBalance, setTrigger } = useContext(UserContext);

    const [betSlip, setBetSlip] = useState<BetSlip | null>(null);
    const [currentGame, setCurrentGame] = useState<Game | null>(null);
    const [league, setLeague] = useState<League | null>(null);
    const [bookie, setBookie] = useState<string | null>('DraftKings');
    const [bookieId, setBookieId] = useState<Number | null>(1);

    const [totalLegs, setTotalLegs] = useState<Number | null>(0);

    const selectProp = (props: { game: any; type: any; target: any; stat: any; value: any; overUnder: any; odds: any; bookieId: any; }) => {
        const { game, type, target, stat, value, overUnder, odds, bookieId } = props;

        const leg = createLeg(type, target, stat, value, overUnder, odds, bookieId);
        const bet = createBet(game.date, league!.leagueName, game.gameId, game.homeTeamName, game.awayTeamName, odds, [leg]);

        const today = new Date();

        if (betSlip) {
            const newBetSlip = updateBetSlip(betSlip, bet, leg);
            if (!newBetSlip) {
                setBetSlip(null);
            }
            setTotalLegs(newBetSlip ? newBetSlip.bets.reduce((total: number, bet: Bet) => total + bet.legs.length, 0) : 0);
        } else {
            const newBetSlip = createBetSlip(1, 'Single', today, bookieId, odds, 0, 0, [bet]);
            setBetSlip(newBetSlip);
            setTotalLegs(1);
        }
    }

    const confirmBetSlip = async (db: any) => {
        try {
            if (!betSlip) {
                console.error('No bet slip to confirm');
                return;
            }
            // Create BetSlip in DB

            const betSlipFormat = await getBetFormat(db, betSlip.type);
            const betSlipDate = betSlip.date.toISOString();
            const betSlipOdds = betSlip.odds.toString();
        
            const betSlipId = await insertBetSlip(db, betSlipFormat.id, betSlipDate, betSlipOdds, betSlip.betAmount, betSlip.winnings, user!.id, betSlip.bookieId);

            if (!betSlipId) {
                console.error('Error inserting bet slip');
                return;
            }

            if (!betSlip.bets || betSlip.bets.length === 0) {
                console.error('No bets found in bet slip');
                return;
            }

            for (const bet of betSlip.bets) {
                try {
                // Create ParticipantBet in DB
                const participantBetId = await insertParticipantBet(db, betSlipId, bet.gameId, bet.odds);

                for (const leg of bet.legs) {
                    try {
                        // Create Leg in DB using ParticipantBetId
                        const betType = await getBetType(db, leg.type);
                        const betMarket = await getBetMarketByLeg(db, bet.gameId, leg);
                        let betMarketId;
                        
                        if (!betMarket) {
                            // Add new bet market row with betSlip.bookieId and leg info
                            const timestamp = new Date().toISOString();

                            const result = await db.getFirstAsync(
                                'SELECT MAX(id) AS maxId FROM BetMarkets WHERE id >= ?',
                                [USER_GENERATED_ID_START]
                            );
                            const nextId = result?.maxId ? result.maxId + 1 : USER_GENERATED_ID_START;

                            // Insert the new BetMarket with the calculated ID
                            betMarketId = await insertFullBetMarket(
                                db,
                                nextId,
                                bet.gameId,
                                leg.stat,
                                timestamp,
                                leg.line,
                                leg.odds,
                                leg.overUnder,
                                leg.betTarget,
                                betSlip.bookieId
                            );
                        } else {
                            betMarketId = betMarket.id;
                        }
                        
                        
                        await insertLeg(db, participantBetId, betMarketId, betType.id);
                    } catch (legError) {
                        console.error('Error inserting leg:', legError);
                    }
                }
                } catch (betError) {
                    console.error('Error inserting participant bet:', betError);
                }
            }

            // Update balance for userBalance
            await updateUserBalance(db, betSlip.bookieId, (betSlip.betAmount * -1), user!.id);
            setTrigger(true);
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
