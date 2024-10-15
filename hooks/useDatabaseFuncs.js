import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import { deleteBetSlip } from '@/db/betslips/BetSlips';
import { deleteBetsByBetSlipId } from '@/db/betslips/ParticipantBets';
import { deleteLegsByParticipantBetId } from '@/db/betslips/Legs'; 
import { updateUserBalance } from '@/db/user-specific/Balance';

const useDatabaseFuncs = () => {

    const db = useSQLiteContext();

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

    return {
        deleteUserBetSlip,
    };
};

export default useDatabaseFuncs;