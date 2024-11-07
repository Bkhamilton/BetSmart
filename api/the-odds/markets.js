import secrets from "@/secrets";
import { getLeagueByName, getLeagueByGameId } from "@/db/general/Leagues";
import { getSeasonByDate } from "@/db/general/Seasons";
import { getTeamId } from "@/db/general/Teams";
import { insertGame, getTodaysGameswithNames, getGameByGameId } from "@/db/general/Games";
import { insertBetTarget, getBetTargetId, getBetTargetsByGameId, getBetTargetIdByName } from "@/db/bet-general/BetTargets";
import { insertBetMarket, getBetMarketByGame } from "@/db/api/BetMarkets";
import { getBookieId } from "@/db/general/Bookies";
// Handling array of objects
/*
Main object fields: 
    id: string, 
    sport_key: string, (api specific, 'basketball_nba, 'americanfootball_nfl', etc.)
    sport_title: string, ('NBA', 'NFL', etc.)
    commence_time: string, ('YYYY-MM-DDTHH:MM:SSZ')
    home_team: string, 
    away_team: string, 
    bookmakers: array of Book objects

Book object fields:
    key: string, (Bookie name, 'draftkings', 'fanduel', etc.)
    title: string, (Bookie name, 'DraftKings', 'FanDuel', etc.)
    last_update: string, ('YYYY-MM-DDTHH:MM:SSZ')
    markets: array of Market objects

Market object fields:
    key: string, (market name, 'spreads', 'totals', etc.)
    last_update: string, ('YYYY-MM-DDTHH:MM:SSZ')
    outcomes: array of Outcome objects

Outcome object fields:
    name: string, (for ML, Spread, teamName, for Totals, 'Over' or 'Under')
    price: number, (American Odds)
    point: number, (for Spread and Totals)
*/

/*
Example market names:
    h2h: Moneyline
    spreads: Spread
    totals: Total Over/Under
*/

/*
Mapping of league names to API-specific sport keys:
MUST HAVES
    NBA: 'basketball_nba'
    NFL: 'americanfootball_nfl'
    MLB: 'baseball_mlb'
    NHL: 'icehockey_nhl'
ADD LATER
    NCAAF: 'americanfootball_ncaaf'
    NCAAB: 'basketball_ncaab'
    WNBA: 'basketball_wnba'
    MMA: 'mma_mixed_martial_arts'
    MLS: 'soccer_usa_mls'
    EPL: 'soccer_epl'
*/

/*
DB Important Info:
    Insert BetMarket => (db, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
*/

const bookieMapping = {
    'DraftKings': 'draftkings',
    'FanDuel': 'fanduel',
    'BetMGM': 'betmgm',
    'Caesars': 'williamhill_us',
}

const leagueMapping = {
    'NBA': 'basketball_nba',
    'NFL': 'americanfootball_nfl',
    'MLB': 'baseball_mlb',
    'NHL': 'icehockey_nhl'
}

const getDate = (dateString) => {
    const date = new Date(dateString);
    const estDate = new Date(date.getTime());
    const year = estDate.getFullYear();
    const month = estDate.getMonth() + 1; // getMonth returns month index starting from 0
    const day = estDate.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`; // Returns the date in YYYY-MM-DD format
};
  

export const getMarkets = async (league, markets) => {
    try {
        const marketString = markets.join(',');
        const response = await fetch(`https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=${secrets.THE_ODDS_API_KEY}&regions=us&markets=${marketString}&oddsFormat=american`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getBig3Markets = async (league) => {
    try {
        const markets = ['h2h', 'spreads', 'totals'];
        const data = await getMarkets(league, markets);
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getMarketType = (market) => {
    switch (market) {
        case 'h2h':
            return 'moneyline';
        case 'spreads':
            return 'spread';
        case 'totals':
            return 'totals';
        default:
            return '';
    }
}

const addOutcomeToDB = async (db, outcome, last_update, market, bookId, gameId, betTarget) => {
    try {
        const { name, price, point = null } = outcome;
        // Insert BetMarket => (db, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
        const marketType = getMarketType(market);
        const overUnder = name === 'Over' || name === 'Under' ? name : '';
        const value = name === 'Over' || name === 'Under' ? point : name;
        const betTargetId = name === 'Over' || name === 'Under' ? betTarget : await getBetTargetIdByName(db, name);
        console.log('Inserting ' + gameId + ' ' + marketType + ' ' + last_update + ' ' + value + ' ' + price + ' ' + overUnder + ' ' + betTargetId + ' ' + bookId);
        console.log(JSON.stringify(betTargetId, null, 2));
        await insertBetMarket(db, gameId, marketType, last_update, value, price, overUnder, betTargetId, bookId);
    } catch (error) {
        console.error(error);
    }
}

const handleMarket = async (db, market, bookId, gameId, betTarget) => {
    try {
        const { key, last_update, outcomes } = market;
        for (let outcome of outcomes) {
            await addOutcomeToDB(db, outcome, last_update, key, bookId, gameId, betTarget);
        }
    } catch (error) {
        console.error(error);
    }
}

const handleBookie = async (db, book, gameId, betTarget) => {
    try {
        const { key, title, last_update, markets } = book;
        const bookieId = await getBookieId(db, title);
        for (let market of markets) {
            await handleMarket(db, market, bookieId, gameId, betTarget);
        }
    } catch (error) {
        console.error(error);
    }
}

const addGameToDB = async (db, game, league) => {
    try {
        const { id, sport_key, commence_time, home_team, away_team, bookmakers } = game;
        // Check if game is already in DB
        // If it is, don't add it again
        const curGame = await getGameByGameId(db, id);
        if (!curGame) {
            const date = getDate(commence_time);
            const curSeason = await getSeasonByDate(db, league.id, date);
            const homeTeam = await getTeamId(db, home_team);
            const homeTeamId = homeTeam.id;
            const awayTeam = await getTeamId(db, away_team);
            const awayTeamId = awayTeam.id;
            await insertGame(db, id, curSeason.id, date, commence_time, homeTeamId, awayTeamId);
            console.log('Inserted ' + away_team + ' vs ' + home_team + ' into Games');
        }
        // const betTarget = await getBetTargetsByGameId(db, id);
        // If betTarget is not in DB, add it

        const betTarget = await getBetTargetsByGameId(db, id);
        let betTargetId;
        if (betTarget.length === 0) {
            betTargetId = await insertBetTarget(db, 'Game', `${away_team} vs ${home_team}`, null, id);
        } else {
            betTargetId = betTarget[0].id;
        }
        for (let book of bookmakers) {
            // if bookie is not in valid list of bookies, return
            if (!bookieMapping[book.title]) return;
            await handleBookie(db, book, game.id, betTargetId);
        }
    } catch (error) {
        console.error(error);
    }
}

export const fetchMarketData = async (db, league) => {
    try {
        const leagueName = leagueMapping[league.leagueName];
        const data = await getBig3Markets(leagueName);
        for (let game of data) {
            await addGameToDB(db, game, league);
        }
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Function to get sport data
const getLeagueData = async (db, league, curLeague, date, curSeason) => {
    const games = await getTodaysGameswithNames(db, date, curSeason.id);
    return {
        league,
        data: {
            league: curLeague.leagueName,
            season: curSeason.description,
            seasonType: curSeason.seasonType,
            date: date,
            games: games
        }
    };
};

export const retrieveGameData = async (db, leagues) => {
    try {
        let data = [];
        for (let league of leagues) {
            const today = new Date();
            const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const curLeague = await getLeagueByName(db, league);
            const curSeason = await getSeasonByDate(db, curLeague.id, date);
            const value = await getTodaysGameswithNames(db, date, curSeason.id);
            if (value.length > 0) {
                data.push({ 
                    league, 
                    data: { 
                        league: curLeague.leagueName, 
                        season: curSeason.description, 
                        seasonType: curSeason.seasonType, 
                        date: date, 
                        games: value 
                    } 
                });
            } else {
                await fetchMarketData(db, curLeague);
                data.push(await getLeagueData(db, league, curLeague, date, curSeason));
            }
        }
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const retrieveMarketData = async (db, gameId, markets) => {
    try {
        let data = [];
        for (let market of markets) {
            const value = await getBetMarketByGame(db, gameId, market);
            if (value.length > 0) {
                // We have data!!
                data.push({ market, data: value });
            } else {
                // If the data is not in the DB, make sure it hasn't been fetched today
                /*
                await fetchMarketProps(db, gameId, market);
                const fetchedData = await getBetMarketByGame(db, gameId, market);
                data.push({ market, data: fetchedData });
                */
                const league = await getLeagueByGameId(db, gameId);
                await fetchMarketData(db, league);
            }
        }
        return data;
    } catch (error) {
      console.error(error);
    }
}
  