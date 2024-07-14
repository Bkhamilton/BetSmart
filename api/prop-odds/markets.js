import secrets from "@/secrets";
import { getGamesByDate, insertGame } from "@/db/general/Games";
import { getTeamIds, getTeamsByAbbreviation } from "@/db/general/Teams";
import { getCurrentSeason } from "@/db/general/Seasons";
import { getLeagueByName } from "@/db/general/Leagues";
import { getTodaysGameswithNames } from "@/db/general/Games";
import { getBookieByName } from "@/db/general/Bookies";
import { getBetTargetId, getBetTargetIdByGameId } from "@/db/bet-general/BetTargets";
import { getBetMarketByGame, insertBetMarket } from "@/db/api/BetMarkets";
import { insertMarketFetchHistory, getLastMarketFetchedByGame, marketFetchedOnDate } from '@/db/api/MarketFetchHistory';

export const getMarkets = async (gameId) => {
    try {
        const response = await fetch(`https://api.prop-odds.com/beta/markets/${gameId}?api_key=${secrets.PROP_ODDS_API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getMarketProps = async (gameId, market) => {
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

const getBetTargetName = (db, name, gameId) => {
  return new Promise((resolve, reject) => {
    const trimmedName = name.trim();

    // If the name includes Over or Under, return gameId
    if (trimmedName.includes('Over') || trimmedName.includes('Under')) {
      resolve(gameId);
    }

    if (trimmedName.includes(' - ')) {
      const [firstPart] = trimmedName.split(' - ');
      // If firstPart is a single string, return it
      if (!firstPart.includes(' ')) {
        resolve(firstPart);
      }
      const [abbreviation, partialTeamName] = firstPart.split(' ', 2);
      getTeamsByAbbreviation(db, abbreviation).then((teams) => {
        const matchedTeam = teams.find(team => team.teamName.includes(partialTeamName));
        resolve(matchedTeam ? matchedTeam.teamName : 'Team not found');
      }).catch(reject);
    } else {
      resolve(trimmedName);
    }
  });
};

const getValue = (outcome) => {
  if (outcome.handicap === 0) {
    if (outcome.participant_name) {
      return outcome.participant_name;
    } else {
      return outcome.name;
    }
  } else {
    return outcome.handicap;
  }
}

const getOverUnder = (outcome) => {
  if (outcome.name.includes('Over') || outcome.name.includes('Under')) {
    return outcome.name.replace(/[^a-zA-Z]/g, '');
  } else {
    return '';
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
      const value = getValue(outcome.outcome);
      const odds = outcome.outcome.odds;
      const overUnder = getOverUnder(outcome.outcome);
      if (betTarget === gameId) {
        getBetTargetIdByGameId(db, gameId).then(async (target) => {
          await insertBetMarket(db, gameId, market, value, odds, overUnder, target.id, bookieId);
        });
      } else {
        getBetTargetId(db, betTarget).then(async (target) => {
          await insertBetMarket(db, gameId, market, value, odds, overUnder, target.id, bookieId);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export const fetchMarketProps = async (db, gameId, market) => {
  try {
    const data = await getMarketProps(gameId, market);
    const filteredData = data.sportsbooks.filter(book => ['draftkings', 'fanduel'].includes(book.bookie_key));
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