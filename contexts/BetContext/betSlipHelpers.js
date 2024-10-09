import { getAllValidParticipantBets } from '@/db/betslips/ParticipantBets';
import { getAllValidLegs } from '@/db/betslips/Legs';

export function createBetSlip(id, type, date, bookieId, odds, betAmount, winnings, bets) {
  return {
    id,
    type,
    date,
    bookieId,
    odds, 
    betAmount,
    winnings,
    bets
  };
}

export function createBet(date, league, gameId, home, away, odds, legs) {
  return {
    date,
    league,
    gameId,
    home,
    away,
    odds,
    legs
  };
}

export function createLeg(type, betTarget, stat, line, overUnder, odds, bookieId) {
  return {
    type,
    betTarget,
    stat,
    line,
    overUnder,
    odds,
    bookieId
  };
}

export function calculateCombinedOdds(oddsArray) {
  if (oddsArray.length === 1) {
    return oddsArray[0];
  }

  let combinedDecimalOdds = 1;

  for (let i = 0; i < oddsArray.length; i++) {
    const numOdds = Number(oddsArray[i]);
    const decimalOdds = numOdds > 0 ? (numOdds / 100) + 1 : (100 / Math.abs(numOdds)) + 1;
    combinedDecimalOdds *= decimalOdds;
  }

  combinedDecimalOdds -= 1;

  let combinedOdds = combinedDecimalOdds >= 1 ? (combinedDecimalOdds - 1) * 100 : -100 / (combinedDecimalOdds - 1);

  // Adjust for combined odds that result in a positive value between 00 and 100
  if (combinedOdds > 0 && combinedOdds < 100) {
    combinedOdds += 100;
  }

  const americanOdds = combinedOdds >= 0 ? `+${Math.round(combinedOdds)}` : `${Math.round(combinedOdds)}`;

  return americanOdds;
}

export function updateBet(betSlip, bet, leg) {
  // Find the leg
  const legToUpdate = bet.legs.find(l => 
    l.type === leg.type && 
    l.betTarget === leg.betTarget && 
    l.stat === leg.stat
  );

  // If the leg doesn't exist, add a new one
  if (!legToUpdate) {
    bet.legs.push(leg);
    bet.odds = calculateCombinedOdds([bet.odds, leg.odds]);
  } else {
    // If the leg does exist, if legUpdate = leg, remove it
    if (legToUpdate.type === leg.type && legToUpdate.betTarget === leg.betTarget && legToUpdate.stat === leg.stat) {
      const newSlip = removeLeg(betSlip, bet, leg);
      return newSlip;
    } else {
      // Else, update the leg
      legToUpdate.line = leg.line;
      legToUpdate.odds = leg.odds;
    }
  }

  return bet;
}

export function updateBetSlip(betSlip, bet, leg) {
  // Find the bet
  let betToUpdate = betSlip.bets.find(b => 
    b.date === bet.date && 
    b.sport === bet.sport && 
    b.home === bet.home && 
    b.away === bet.away
  );

  // If the bet doesn't exist, add a new one
  if (!betToUpdate) {
    betSlip.bets.push(bet);

    // Update the betSlip type
    if (betSlip.type === 'Single') {
      betSlip.type = 'Parlay';
    }
  } else {
    // If the bet does exist, update it using updateBet function
    betToUpdate = updateBet(betSlip, betToUpdate, leg);

    // If the betToUpdate is null, return null
    if (!betToUpdate) {
      return null;
    }

    // Update the betSlip type
    if (betSlip.type === 'Single') {
      betSlip.type = 'Same Game Parlay';
    }
  }

  // Update the betSlip odds
  betSlip.odds = calculateCombinedOdds(betSlip.bets.map(bet => bet.odds));

  return betSlip;
}

export function removeLeg(betSlip, bet, leg) {
  // Find the bet
  const betToRemove = betSlip.bets.find(b => 
    b.date === bet.date && 
    b.sport === bet.sport && 
    b.home === bet.home && 
    b.away === bet.away
  );

  // Find the leg
  const legToRemove = betToRemove.legs.find(l => 
    l.type === leg.type && 
    l.betTarget === leg.betTarget && 
    l.stat === leg.stat
  );

  // Remove the leg
  betToRemove.legs = betToRemove.legs.filter(l => l !== legToRemove);

  // If there are no legs left in the bet, remove the bet
  if (betToRemove.legs.length === 0) {
    betSlip.bets = betSlip.bets.filter(b => b !== betToRemove);

    // Update the betSlip type
    if (betSlip.bets.length === 1) {
      betSlip.type = 'Single';
    }
  } else {
    // Else, update the odds for the bet
    betToRemove.odds = calculateCombinedOdds(betToRemove.legs.map(l => l.odds));
  }

  // If there are no bets left in the betSlip, return null
  if (betSlip.bets.length === 0) {
    return null;
  }

  // Update the betSlip odds
  betSlip.odds = calculateCombinedOdds(betSlip.bets.map(bet => bet.odds));

  return betSlip;
}

export function removeBetSlip(betSlip) {
  return null;
}

export function updateBetOdds(betSlip, bet, newOdds) {
  // Find the bet
  const betToUpdate = betSlip.bets.find(b => 
    b.date === bet.date && 
    b.sport === bet.sport && 
    b.home === bet.home && 
    b.away === bet.away
  );

  // Update the bet odds
  betToUpdate.odds = newOdds;

  // If there is only one leg, update that bet.legs[0].odds
  if (betToUpdate.legs.length === 1) {
    betToUpdate.legs[0].odds = newOdds;
  }

  // Update the betSlip odds
  betSlip.odds = calculateCombinedOdds(betSlip.bets.map(bet => bet.odds));

  return betSlip;
}

// function to update the betSlip's betAmount and winnings
export function updateBetSlipAmounts(betSlip, betAmount, winnings) {
  betSlip.betAmount = betAmount;
  betSlip.winnings = winnings;
}

// Fill bet slips with bets and legs
export const fillBetSlips = async (db, betSlips) => {
  try {
    const betSlipIds = betSlips.map(betSlip => betSlip.id);
    const participantBets = await getAllValidParticipantBets(db, betSlipIds);
    const participantBetIds = participantBets.map(participantBet => participantBet.id);
    const legs = await getAllValidLegs(db, participantBetIds);

    // Add legs to participantBets
    const participantBetsWithLegs = participantBets.map(participantBet => ({
      ...participantBet,
      legs: legs.filter(leg => leg.participantBetId === participantBet.id)
    }));

    // Add participantBets to betSlips
    const betSlipsWithBets = betSlips.map(betSlip => ({
      ...betSlip,
      bets: participantBetsWithLegs.filter(participantBet => participantBet.betSlipId === betSlip.id)
    }));

    return betSlipsWithBets;
  } catch (error) {
    console.error('Error filling bet slips:', error);
    throw error;
  }
};

export function updateBetSlipBookie(betSlip, bookieId) {
  betSlip.bookieId = bookieId;
}