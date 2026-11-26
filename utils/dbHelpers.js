import { insertBetSlipResult } from '@/db/betslips/BetSlipsResults';
import { insertLegResult } from '@/db/betslips/LegsResults';
import { insertParticipantBetResult } from '@/db/betslips/ParticipantBetsResults';
import { updateUserBalance } from '@/db/user-specific/Balance';

export const confirmBetResults = async (db, betSlip, user) => {
    try {
        await db.withTransactionAsync(async () => {
            for (const bet of betSlip.bets) {
                for (const leg of bet.legs) {
                    await insertLegResult(db, leg.legId, leg.result);
                }
                await insertParticipantBetResult(db, bet.id, bet.result);
            }

            await insertBetSlipResult(db, betSlip.id, betSlip.result);

            if (betSlip.result) {
                await updateUserBalance(db, betSlip.bookieId, betSlip.winnings.toFixed(2), user.id);
            }
        });
    } catch (error) {
        console.error('Error saving bet results:', error);
        throw error;
    }
};