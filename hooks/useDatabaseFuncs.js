import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { deleteBetSlip, getBetSlipsByUserId, deleteBetSlipsByUserId } from '@/db/betslips/BetSlips';
import { deleteBetsByBetSlipId, getBetsByBetSlipIds, deleteBetsByBetSlipIds } from '@/db/betslips/ParticipantBets';
import { deleteLegsByParticipantBetId, getLegsByParticipantBetIds, deleteLegsByParticipantBetIds } from '@/db/betslips/Legs';
import { deleteLegsResultsByLegIds } from '@/db/betslips/LegResults';
import { deleteParticipantBetResultsByParticipantBetIds } from '@/db/betslips/ParticipantBetResults';
import { deleteBetSlipResultsByBetSlipIds } from '@/db/betslips/BetSlipResults';
import { updateUserBalance } from '@/db/user-specific/Balance';

const useDatabaseFuncs = () => {

    const { db } = useContext(DBContext);

    const { setUserBalance } = useContext(UserContext);

    const deleteUserBetSlip = async (betSlip, userId) => {
        try {
            // delete betslip
            await deleteBetSlip(db, betSlip.id, userId);
            // delete betslip bets
            await deleteBetsByBetSlipId(db, betSlip.id);
            // delete betSlip bets legs
            betSlip.bets.map(async bet => {
                await deleteLegsByParticipantBetId(db, bet.id);
            });

            // update user balance
            await updateUserBalance(db, betSlip.bookieId, betSlip.betAmount, userId);
            setUserBalance(prevBalances => 
                prevBalances.map(item => 
                    item.bookieId === betSlip.bookieId ? { ...item, balance: Number(item.balance) + Number(betSlip.betAmount) } : item
                )
            )
        } catch (error) {
            console.error('Error deleting bet slip:', error);
            throw error;
        }
    };

    const clearBettingData = async (user) => {
        console.log('Clearing betting data');
    
        try {
            await db.withTransactionAsync(async () => {
                // Get all betslips for user
                const betSlips = await getBetSlipsByUserId(db, user.id);
                const betSlipIds = betSlips.map(betSlip => betSlip.id);
    
                // Get all bets from betslips
                const bets = await getBetsByBetSlipIds(db, betSlipIds);
                const betIds = bets.map(bet => bet.id);
    
                // Get all legs from bets
                const legs = await getLegsByParticipantBetIds(db, betIds);
                const legIds = legs.map(leg => leg.id);
    
                // Delete legs results
                if (legIds.length > 0) {
                    await deleteLegsResultsByLegIds(db, legIds);
                }
    
                // Delete legs
                if (betIds.length > 0) {
                    await deleteLegsByParticipantBetIds(db, betIds);
                }
    
                // Delete participant bet results
                if (betIds.length > 0) {
                    await deleteParticipantBetResultsByParticipantBetIds(db, betIds);
                }
    
                // Delete bets
                if (betSlipIds.length > 0) {
                    await deleteBetsByBetSlipIds(db, betSlipIds);
                }
    
                // Delete betslip results
                if (betSlipIds.length > 0) {
                    await deleteBetSlipResultsByBetSlipIds(db, betSlipIds);
                }
    
                // Delete betslips
                await deleteBetSlipsByUserId(db, user.id);
    
                console.log('Betting data cleared successfully');
            });
        } catch (error) {
            console.error('Error clearing betting data:', error);
        }
    };

    const clearUserData = async (user) => {
        console.log(user);
        /*
        clear all User Data
        This Includes:
            - Balance
            - Bonuses
            - Transactions
            clearBettingData(user)
        */
    }

    return {
        deleteUserBetSlip,
        clearUserData,
        clearBettingData,
    };
};

export default useDatabaseFuncs;