import secrets from "@/secrets";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGamesByDate, insertGame } from "@/db/general/Games";
import { getTeamIds } from "@/db/general/Teams";
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
      const response = await fetch(`https://api.prop-odds.com/beta/odds/94a341a91450aa39f4492d2f49b5e46f/${market}?api_key=${secrets.PROP_ODDS_API_KEY}`);
      const data = await response.json();
      console.log(JSON.stringify(data, null, 2));
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

const getBetTargetName = (name) => {
  console.log(name);

  return name;
}

const addBetMarketToDB = async (db, gameId, market, book) => {
  try {
    const bookie = await getBookieByName(db, book.bookie_key);
    const bookieId = bookie.id;
    const marketValues = fetchMarketValues(book);
    for (let outcome of marketValues) {
      const betTarget = getBetTargetName(outcome.name);
      const betTargetId = await getBetTargetId(db, betTarget).id;
      const value = outcome.outcome.handicap === 0 ? outcome.outcome.description : outcome.outcome.handicap;
      const odds = outcome.outcome.odds;
      const overUnder = outcome.outcome.name === 'Over' || outcome.outcome.name === 'Under' ? outcome.outcome.name : '';
      console.log(`Inserting ${gameId}, ${market}, ${value}, ${odds}, ${overUnder}, ${betTargetId}, ${bookieId}`);
      //await insertBetMarket(db, gameId, market, value, odds, overUnder, betTargetId, bookieId);
    }
  } catch (error) {
    console.error(error);
  }
}

export const fetchMarketProps = async (db, gameId, market) => {
  try {
    const data = await getMarketProps(db, gameId, market);
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