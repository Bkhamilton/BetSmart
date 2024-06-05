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
  
  export function createBet(date, sport, home, away, odds, legs) {
    return {
      date,
      sport,
      home,
      away,
      odds,
      legs
    };
  }
  
  export function createLeg(type, betTarget, stat, alt, line, overUnder) {
    return {
      type,
      betTarget,
      stat,
      alt,
      line,
      overUnder
    };
  }