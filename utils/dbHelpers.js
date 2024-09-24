import { insertBetSlipResult } from '@/db/betslips/BetSlipsResults';
import { insertLegResult } from '@/db/betslips/LegsResults';
import { insertParticipantBetResult } from '@/db/betslips/ParticipantBetsResults';
import { updateUserBalance } from '@/db/user-specific/Balance';

export const confirmBetResults = (db, betSlip, user) => {
    try {
        // For each Leg in betslip.bets.legs, insert into LegResults table with betslipId, legId, result
        betSlip.bets.forEach(bet => {
            bet.legs.forEach(leg => {
            insertLegResult(db, leg.legId, leg.result);
            });
        });
    
        // For each Bet in betslip.bets, insert into BetResults table with betslipId, betId, result
        betSlip.bets.forEach(bet => {
            insertParticipantBetResult(db, bet.id, bet.result);
        });
    
        // Insert into BetSlipResults table with betslipId, result
        insertBetSlipResult(db, betSlip.id, betSlip.result);
    
        // Update user balance in the database
        if (betSlip.result) {
            updateUserBalance(db, betSlip.bookieId, betSlip.winnings.toFixed(2), user.id);
        }
    } catch (error) {
        console.error(error);
    }
}