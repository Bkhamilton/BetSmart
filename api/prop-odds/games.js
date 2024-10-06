import secrets from "@/secrets";
import { insertGame, getTodaysGameswithNames } from "@/db/general/Games";
import { getTeamIds } from "@/db/general/Teams";
import { getCurrentSeason, getSeasonByDate } from "@/db/general/Seasons";
import { getLeagueByName, getActiveLeagues } from "@/db/general/Leagues";
import { insertFetchHistory, getLastFetchedByLeague, leagueFetchedOnDate } from "@/db/api/FetchHistory";
import { insertBetTarget } from "@/db/bet-general/BetTargets";

export const getGames = async (db, sport) => {
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const response = await fetch(`https://api.prop-odds.com/beta/games/${sport}?date=${date}&tz=America/New_York&api_key=${secrets.PROP_ODDS_API_KEY}`);
      const data = await response.json();
      insertFetchHistory(db, sport, date);
      return data;
    } catch (error) {
      console.error(error);
    }
};

export const getGamesDate = async (db, sport, date) => {
  try {
    const response = await fetch(`https://api.prop-odds.com/beta/games/${sport}?date=${date}&tz=America/New_York&api_key=${secrets.PROP_ODDS_API_KEY}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

const getDate = (dateString) => {
  const date = new Date(dateString);
  const estDate = new Date(date.getTime());
  const year = estDate.getFullYear();
  const month = estDate.getMonth() + 1; // getMonth returns month index starting from 0
  const day = estDate.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`; // Returns the date in YYYY-MM-DD format
};

export const addGameToDB = async (db, game, sport) => {

  try {
    const { game_id, start_timestamp, home_team, away_team } = game;
    const teamIds = await getTeamIds(db, [home_team, away_team]);
    const homeTeamId = teamIds[0].id;
    const awayTeamId = teamIds[1].id;
    const league = await getLeagueByName(db, sport);
    const date = getDate(start_timestamp);
    const curSeason = await getSeasonByDate(db, league.id, date);
    await insertGame(db, game_id, curSeason.id, date, start_timestamp, homeTeamId, awayTeamId);
    await insertBetTarget(db, 'Game', `${away_team} vs ${home_team}`, null, game_id);
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch data from API and store it in SQLite DB
export const fetchGamesDB = async (db, sport) => {
  try {
    const data = await getGames(db, sport);
    for (let game of data.games) {
      await addGameToDB(db, game, sport);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchGamesDate = async (db, sport, date) => {
  try {
    const response = await getGamesDate(db, sport, date);
    const data = await response.json();
    for (let game of data.games) {
      await addGameToDB(db, game, sport);
    }
    insertFetchHistory(db, sport, date);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to get sport data
const getSportData = async (db, sport, league, date, curSeason) => {
  const games = await getTodaysGameswithNames(db, date, curSeason.id);
  return {
    sport,
    data: {
      league: league.leagueName,
      season: curSeason.description,
      seasonType: curSeason.seasonType,
      date: date,
      games: games
    }
  };
};

// Function to retrieve data from SQLite DB
export const retrieveGames = async (db, sports) => {
  try {
    let data = [];
    for (let sport of sports) {
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const league = await getLeagueByName(db, sport);
      const curSeason = await getSeasonByDate(db, league.id, date);
      const value = await getTodaysGameswithNames(db, date, curSeason.id);
      if (value.length > 0) {
        data.push(await getSportData(db, sport, league, date, curSeason));
      } else {
        const lastFetched = await getLastFetchedByLeague(db, league.leagueName);
        if (lastFetched && lastFetched.lastFetched !== date) {
          await fetchGamesDB(db, sport);
          data.push(await getSportData(db, sport, league, date, curSeason));
        }
      }
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const retrieveGamesDate = async (db, sports, date) => {
  try {
    let data = [];
    for (let sport of sports) {
      const league = await getLeagueByName(db, sport);
      const curSeason = await getSeasonByDate(db, league.id, date);
      if (!curSeason) {
        continue;
      }
      const value = await getTodaysGameswithNames(db, date, curSeason.id);
      if (value.length > 0) {
        data.push(await getSportData(db, sport, league, date, curSeason));
      } else {
        const fetched = await leagueFetchedOnDate(db, league.leagueName, date);
        if (!fetched) {
          await fetchGamesDate(db, sport, date);
          data.push(await getSportData(db, sport, league, date, curSeason));
        }
      }
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const retrieveAllGames = async (db, date) => {
  try {
    const leagues = await getActiveLeagues(db, date);
    return await retrieveGamesDate(db, leagues, date);
  } catch (error) {
    console.error(error);
  }
}