import secrets from "../../secrets";
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

const addMarketToDB = async (db, market, bookId, gameId) => {
    try {
        const { key, last_update, outcomes } = market;
        await insertMarket(db, key, last_update, bookId, gameId);
        for (let outcome of outcomes) {
            await insertOutcome(db, outcome.name, outcome.price, outcome.point, key, bookId, gameId);
        }
    } catch (error) {
        console.error(error);
    }
}

const addBookToDB = async (db, book, gameId) => {
    try {
        const { key, title, last_update, markets } = book;
        // if key is not in valid list of bookies, return
        await insertBook(db, key, title, last_update, gameId);
        for (let market of markets) {
            await addMarketToDB(db, market, key, gameId);
        }
    } catch (error) {
        console.error(error);
    }
}

const addGameToDB = async (db, game, league) => {
    try {
        const { id, sport_key, commence_time, home_team, away_team, bookmakers } = game;
        const date = getDate(commence_time);
        const curSeason = await getSeasonByDate(db, league.id, date);
        const homeTeam = await getTeamId(db, home_team);
        const homeTeamId = homeTeam.id;
        const awayTeam = await getTeamId(db, away_team);
        const awayTeamId = awayTeam.id;
        await insertGame(db, id, curSeason.id, date, commence_time, homeTeamId, awayTeamId);
        await insertBetTarget(db, 'Game', `${away_team} vs ${home_team}`, null, game.id);
        for (let book of bookmakers) {
            await addBookToDB(db, book, game.id);
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