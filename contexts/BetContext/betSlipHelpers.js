export function createBetSlip(id, type, date, odds, betAmount, winnings, bets) {
  return {
    id,
    type,
    date,
    odds, 
    betAmount,
    winnings,
    bets
  };
}

export function createBet(date, league, home, away, odds, legs) {
  return {
    date,
    league,
    home,
    away,
    odds,
    legs
  };
}

export function createLeg(type, betTarget, stat, line, odds) {
  return {
    type,
    betTarget,
    stat,
    line,
    odds,
  };
}

function calculateCombinedOdds(oddsArray) {

  // If there is only one odds, return it
  if (oddsArray.length === 1) {
    return oddsArray[0];
  }

  let combinedDecimalOdds = 1;

  // Convert each American odds to decimal odds and multiply them together
  for (let i = 0; i < oddsArray.length; i++) {
    const numOdds = Number(oddsArray[i]);
    const decimalOdds = numOdds > 0 ? (numOdds / 100) + 1 : (100 / Math.abs(numOdds)) + 1;
    combinedDecimalOdds *= decimalOdds;
  }

  // Subtract 1 from the combined decimal odds
  combinedDecimalOdds -= 1;

  // Convert the combined decimal odds back to American odds
  const combinedOdds = combinedDecimalOdds >= 1 ? (combinedDecimalOdds - 1) * 100 : -100 / (combinedDecimalOdds - 1);

  const americanOdds = combinedOdds >= 1 ? `+${Math.round(combinedOdds)}` : `-${Math.round(combinedOdds)}`;

  return americanOdds;
}

export function updateBet(bet, leg) {
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
    // If the leg does exist, update it
    legToUpdate.line = leg.line;
    legToUpdate.odds = leg.odds;
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
    betToUpdate = updateBet(betToUpdate, leg);

    // Update the betSlip type
    if (betSlip.type === 'Single') {
      betSlip.type = 'Same Game Parlay';
    }
  }

  // Update the betSlip odds
  betSlip.odds = calculateCombinedOdds(betSlip.bets.map(bet => bet.odds));

  return betSlip;
}