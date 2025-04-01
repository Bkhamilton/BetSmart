import { getActiveLeagues } from "@/api/supabase/Leagues";
import { getSeasonByDate } from "@/api/supabase/Seasons";
import { getTeamId } from "@/api/supabase/Teams";
import { insertGame, getGameByGameId } from "@/api/supabase/Games";
import { insertBetTarget, getBetTargetsByGameId, getBetTargetId } from "@/api/supabase/BetTargets";
import { insertBetMarket, clearGameBetMarkets } from "@/api/supabase/BetMarkets";
import { getBookieId } from "@/api/supabase/Bookies";
import { getDateFull } from "@/utils/dateFunctions";
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
    Insert BetMarket => (supabase, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
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

export const getMarkets = async (league, markets) => {
    try {
        const marketString = markets.join(',');
        const response = await fetch(`https://api.the-odds-api.com/v4/sports/${league}/odds/?apiKey=${process.env.EXPO_PUBLIC_THE_ODDS_FREE_API_KEY}&regions=us&markets=${marketString}&oddsFormat=american`);
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

const getMarketType = (market) => {
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

const getOdds = (odds) => {
    if (odds > 0) {
      return '+' + odds;
    } else {
      return odds.toString();
    }
}

const addOutcomeToDB = async (supabase, outcome, last_update, market, bookId, gameId, betTarget) => {
    try {
        const { name, price, point = null } = outcome;
        // Insert BetMarket => (supabase, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId)
        const marketType = getMarketType(market);
        const overUnder = name === 'Over' || name === 'Under' ? name : '';
        const value = market === 'h2h' ? name : point;
        const betTargetId = name === 'Over' || name === 'Under' ? betTarget : await getBetTargetId(supabase, name);
        const odds = getOdds(price);
        if (!betTargetId) {
            console.log('No betTargetId found for ' + name);
            return;
        }
        await insertBetMarket(supabase, gameId, marketType, last_update, value, odds, overUnder, betTargetId, bookId);
    } catch (error) {
        console.error(error);
    }
}

export const handleMarketData = async (supabase, market, bookieId, gameId, betTargetId) => {
    try {
        const { key, last_update, outcomes } = market;
        for (let outcome of outcomes) {
            await addOutcomeToDB(supabase, outcome, last_update, key, bookieId, gameId, betTargetId);
        }
    } catch (error) {
        console.error(error);
    }
}

export const handleBookieData = async (supabase, book, gameId, betTargetId) => {
    try {
        const { key, title, last_update, markets } = book;
        const bookieId = await getBookieId(supabase, title);
        for (let market of markets) {
            await handleMarketData(supabase, market, bookieId, gameId, betTargetId);
        }
    } catch (error) {
        console.error(error);
    }
}

export const handleGameData = async (supabase, game, league) => {
    try {
        // Check if game is already in DB
        // If it is, don't add it again
        const curGame = await getGameByGameId(supabase, game.id);
        if (!curGame) {
            console.log('Adding game ' + game.id + ' to DB');
            const date = getDateFull(game.commence_time);
            const curSeason = await getSeasonByDate(supabase, league.id, date);
            const homeTeamId = await getTeamId(supabase, game.home_team);
            if (!homeTeamId) {
                console.log('No homeTeamId found for ' + game.home_team);
                return;
            }
            const awayTeamId = await getTeamId(supabase, game.away_team);
            if (!awayTeamId) {
                console.log('No awayTeamId found for ' + game.away_team);
                return;
            }
            await insertGame(supabase, game.id, curSeason.id, date, game.commence_time, homeTeamId, awayTeamId);
        } else {
            console.log('Game ' + game.id + ' already in DB');
        }
        const betTarget = await getBetTargetsByGameId(supabase, game.id);
        let betTargetId;
        if (betTarget.length !== 0) {
            await clearGameBetMarkets(supabase, game.id);
            betTargetId = betTarget[0].id;
        } else {
            betTargetId = await insertBetTarget(supabase, 'Game', `${game.away_team} vs ${game.home_team}`, null, game.id);
        }
        for (let book of game.bookmakers) {
            if (!bookieMapping[book.title]) continue;
            await handleBookieData(supabase, book, game.id, betTargetId);
        }
    } catch (error) {
        console.error(error);
    }
}

export const refreshBettingMarkets = async (supabase, league) => {
    try {
        console.log('Refreshing betting markets for ' + league.leagueName);
        const leagueName = leagueMapping[league.leagueName];
        const data = await getBig3Markets(leagueName);
        for (let game of data) {
            await handleGameData(supabase, game, league);
        }
        console.log('Refreshed betting markets for ' + league.leagueName);
        return data;
    } catch (error) {
        console.error(error);
    }    
}

export const refreshBettingMarketsLeagues = async (supabase, leagues) => {
    try {
        for (let league of leagues) {
            await refreshBettingMarkets(supabase, league);
        }
    } catch (error) {
        console.error(error);
    }
}

export const refreshAllBettingMarkets = async (supabase) => {
    try {
        const leagues = await getActiveLeagues(supabase);
        for (let league of leagues) {
            await refreshBettingMarkets(supabase, league);
        }
    } catch (error) {
        console.error(error);
    }
}