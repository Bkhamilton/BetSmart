import secrets from "@/secrets";
import { getTeamsByAbbreviation } from "@/db/general/Teams";
import { getBookieByName, getBookieNames } from "@/db/general/Bookies";
import { getBetTargetId, getBetTargetIdByGameId } from "@/db/bet-general/BetTargets";
import { getBetMarketByGame, insertBetMarket, getMoneyline, getSpread, getTotalOverUnder } from "@/db/api/BetMarkets";
import { insertMarketFetchHistory, marketFetchedOnDate } from '@/db/api/MarketFetchHistory';

export const getMarkets = async (gameId) => {
    try {
        const response = await fetch(`https://api.prop-odds.com/beta/markets/${gameId}?api_key=${secrets.PROP_ODDS_API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getMarketProps = async (db, gameId, market) => {
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const response = await fetch(`https://api.prop-odds.com/beta/odds/${gameId}/${market}?api_key=${secrets.PROP_ODDS_API_KEY}`);
      const data = await response.json();
      insertMarketFetchHistory(db, gameId, market, date);
      return data;
    } catch (error) {
      console.error(error);
    }
};

// Function to add games to the DB
const fetchMarketValues = (data) => {
  const mostRecentOutcomes = {};

  for (let outcome of data.market.outcomes) {
    const team = outcome.name;
    if (!mostRecentOutcomes[team] || new Date(outcome.timestamp) > new Date(mostRecentOutcomes[team].timestamp)) {
      mostRecentOutcomes[team] = outcome;
    }
  }

  // Convert the map to an array of objects
  const teams = Object.keys(mostRecentOutcomes);
  return teams.map(team => ({
    name: team,
    outcome: mostRecentOutcomes[team],
  }));
};

const betTargetCases = {
  'WAS Nationals': 'Washington Nationals',
  'CHI White' : 'Chicago White Sox',
  'CHI Cubs' : 'Chicago Cubs',
  'CHI White ' : 'Chicago White Sox',
}

const getBetTargetName = (db, name, gameId) => {
  return new Promise((resolve, reject) => {
    const trimmedName = name.trim();

    // If the name includes Over or Under, return gameId
    if (trimmedName.includes('Over') || trimmedName.includes('Under')) {
      resolve(gameId);
    }

    // Check if the name ends with a spread value (e.g., "-3.5" or "+2.5")
    const spreadPattern = /[-+]\d+(\.\d+)?$/;
    if (spreadPattern.test(trimmedName)) {
      const teamName = trimmedName.replace(spreadPattern, '').trim();
      resolve(teamName);
    }
    
    if (trimmedName.includes(' - ')) {
      const [firstPart] = trimmedName.split(' - ');
      // If firstPart is a single string, return it
      if (!firstPart.includes(' ')) {
        resolve(firstPart);
      }
      const [abbreviation, partialTeamName] = firstPart.split(' ', 2);
      // If abbrev + partialTeamName is in betTargetCases, return the value
      if (betTargetCases[abbreviation + ' ' + partialTeamName]) {
        resolve(betTargetCases[abbreviation + ' ' + partialTeamName]);
      }
      getTeamsByAbbreviation(db, abbreviation).then((teams) => {
        const matchedTeam = teams.find(team => team.teamName.includes(partialTeamName));
        resolve(matchedTeam ? matchedTeam.teamName : abbreviation + ' ' + partialTeamName);
      }).catch(reject);
    } else {
      if (betTargetCases[trimmedName]) {
        resolve(betTargetCases[trimmedName]);
      } else {
        resolve(trimmedName);
      }
    }
  });
};

const getOverUnder = (outcome) => {
  if (outcome.name.includes('Over') || outcome.name.includes('Under')) {
    return outcome.name.replace(/[^a-zA-Z]/g, '');
  } else {
    return '';
  }
}

const getOdds = (odds) => {
  if (odds > 0) {
    return '+' + odds;
  } else {
    return odds.toString();
  }
}

const getValue = async (db, outcome) => {
  if (outcome.handicap === 0) {
    if (outcome.participant_name) {
      const [abbreviation, partialTeamName] = outcome.participant_name.split(' ', 2);
      if (betTargetCases[abbreviation + ' ' + partialTeamName]) {
        return betTargetCases[abbreviation + ' ' + partialTeamName];
      }

      try {
        const teams = await getTeamsByAbbreviation(db, abbreviation);
        const matchedTeam = teams.find(team => team.teamName.includes(partialTeamName));
        return matchedTeam ? matchedTeam.teamName : outcome.participant_name;
      } catch (error) {
        console.error('Error fetching teams by abbreviation:', error);
        return outcome.participant_name;
      }
    } else {
      return outcome.name;
    }
  } else {
    return outcome.handicap;
  }
}

// Function to add bet market to the DB
const addBetMarketToDB = async (db, gameId, market, book) => {
  try {
    const bookie = await getBookieByName(db, book.bookie_key);
    const bookieId = bookie.id;
    const marketValues = fetchMarketValues(book);
    for (let outcome of marketValues) {
      const betTarget = await getBetTargetName(db, outcome.name, gameId);
      const value = await getValue(db, outcome.outcome);
      const odds = getOdds(outcome.outcome.odds);
      const overUnder = getOverUnder(outcome.outcome);
      const timestamp = outcome.outcome.timestamp;
      if (betTarget === gameId) {
        getBetTargetIdByGameId(db, gameId).then(async (target) => {
          await insertBetMarket(db, gameId, market, timestamp, value, odds, overUnder, target.id, bookieId);
        });
      } else {
        getBetTargetId(db, betTarget).then(async (target) => {
          if (!target) {
            console.log(`Target not found: '${betTarget}'`);
            return;
          }
          await insertBetMarket(db, gameId, market, timestamp, value, odds, overUnder, target.id, bookieId);
        })
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export const fetchMarketProps = async (db, gameId, market) => {
  try {
    const data = await getMarketProps(db, gameId, market);
    const validBookies = await getBookieNames(db);
    const filteredData = data.sportsbooks.filter(book => validBookies.includes(book.bookie_key));
    for (let book of filteredData) {
      await addBetMarketToDB(db, gameId, market, book);
    }
  } catch (error) {
    console.error(error);
  }
}

export const retrieveMarketsDB = async (db, gameId, markets) => {
  try {
    let data = [];
    for (let market of markets) {
      const value = await getBetMarketByGame(db, gameId, market);
      if (value.length > 0) {
        // We have data!!
        data.push({ market, data: value });
      } else {
        // If the data is not in the DB, make sure it hasn't been fetched today
        const today = new Date();
        const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const fetched = await marketFetchedOnDate(db, market, gameId, date);
        if (!fetched) {
          // If it hasn't been fetched today, fetch it
          await fetchMarketProps(db, gameId, market);
          const fetchedData = await getBetMarketByGame(db, gameId, market);
          data.push({ market, data: fetchedData });
        }
      }
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

export const retrieveBig3Markets = async (db, gameId) => {
  try {
    const markets = ['spread', 'moneyline', 'total_over_under'];
    return await retrieveMarketsDB(db, gameId, markets);
  } catch (error) {
    console.error(error);
  }
}

export const retrieveBig3MarketsByGame = async (db, gameId) => {
  try {
    let data = [];

    // retrieve Moneyline
    data.push({ 'moneyline' : await getMoneyline(db, gameId)});
  
    // retrieve Spread
    data.push({ 'spread' : await getSpread(db, gameId)});

    // retrieve Total Over/Under
    data.push({ 'total_over_under' : await getTotalOverUnder(db, gameId)});

  } catch (error) {
    console.error(error);
  }
}