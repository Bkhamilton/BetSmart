import secrets from "@/secrets";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGamesByDate, insertGame } from "@/db/general/Games";
import { getTeamIds, getTeamByAbbreviation } from "@/db/general/Teams";
import { getCurrentSeason } from "@/db/general/Seasons";
import { getLeagueByName } from "@/db/general/Leagues";
import { getTodaysGameswithNames } from "@/db/general/Games";
import { getBookieByName } from "@/db/general/Bookies";
import { getBetTargetId } from "@/db/bet-general/BetTargets";
import { getBetMarketByGame, insertBetMarket } from "@/db/api/BetMarkets";

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
      const response = await fetch(`https://api.prop-odds.com/beta/odds/${gameId}/${market}?api_key=${secrets.PROP_ODDS_API_KEY}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
};

const getMoneyLine = (marketData) => {
  const moneyLine = {};
  marketData.market.outcomes.forEach(outcome => {
    moneyLine[outcome.name] = outcome.odds;
  });
  return moneyLine;
};

const fetchMoneyline = async (data) => {
  const filteredData = data.sportsbooks.filter(book => ['draftkings', 'fanduel', 'betmgm'].includes(book.bookie_key));

  return filteredData.map(book => ({
    bookie: book.bookie_key,
    moneyLine: getMoneyLine(book.market),
  }));
};

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

const getBetTargetName = (db, name) => {
  return new Promise((resolve, reject) => {
    const trimmedName = name.trim();

    if (trimmedName.includes(' - ')) {
      const [firstPart] = trimmedName.split(' - ');
      const [abbreviation, partialTeamName] = firstPart.split(' ', 2);
      getTeamByAbbreviation(db, abbreviation).then((teams) => {
        const matchedTeam = teams.find(team => team.teamName.includes(partialTeamName));
        resolve(matchedTeam ? matchedTeam.teamName : 'Team not found');
      }).catch(reject);
    } else {
      resolve(trimmedName);
    }
  });
};

const addBetMarketToDB = async (db, gameId, market, book) => {
  try {
    const bookie = await getBookieByName(db, book.bookie_key);
    const bookieId = bookie.id;
    const marketValues = fetchMarketValues(book);
    for (let outcome of marketValues) {
      const betTarget = await getBetTargetName(db, outcome.name);
      const value = outcome.outcome.handicap === 0 ? outcome.outcome.description : outcome.outcome.handicap;
      const odds = outcome.outcome.odds;
      const overUnder = outcome.outcome.name === 'Over' || outcome.outcome.name === 'Under' ? outcome.outcome.name : '';
      getBetTargetId(db, betTarget).then((target) => {
        console.log(`Inserting ${gameId}, ${market}, ${value}, ${odds}, ${overUnder}, ${target.id}, ${bookieId}`);
        //await insertBetMarket(db, gameId, market, value, odds, overUnder, betTargetId, bookieId);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export const fetchMarketProps = async (db, gameId, market) => {
  console.log(`Fetching ${market} for game ${gameId}`);
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
        // If the data is not in the DB, fetch it
        await fetchMarketProps(db, gameId, market);
        const fetchedData = await getBetMarketByGame(db, gameId, market);
        data.push({ market, data: fetchedData });
      }
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}