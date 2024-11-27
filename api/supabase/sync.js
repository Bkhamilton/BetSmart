// Description: Sync data from Supabase to SQLite database
export const syncBookies = async (db, supabase) => {
    // TODO: Implement sync logic for bookies
    const bookies = await getAllBookies(supabase);
};

export const syncLeagues = async (db, supabase) => {
    // TODO: Implement sync logic for leagues
    const leagues = await getAllLeagues(supabase);
};

export const syncSeasons = async (db, supabase) => {
    // TODO: Implement sync logic for seasons
    const seasons = await getAllSeasons(supabase);
};

export const syncTeams = async (db, supabase) => {
    // TODO: Implement sync logic for teams
    const teams = await getAllTeams(supabase);
};

export const syncPlayers = async (db, supabase) => {
    // TODO: Implement sync logic for players
    const players = await getAllPlayers(supabase);
};

export const syncLeagueProps = async (db, supabase) => {
    // TODO: Implement sync logic for league props
    const leagueProps = await getAllLeagueProps(supabase);
};

export const syncLeaguePropsInfo = async (db, supabase) => {
    // TODO: Implement sync logic for league props info
    const leaguePropsInfo = await getAllLeaguePropsInfo(supabase);
};

export const syncGames = async (db, supabase) => {
    // TODO: Implement sync logic for games
};

export const syncBetTypes = async (db, supabase) => {
    // TODO: Implement sync logic for bet types
    const betTypes = await getAllBetTypes(supabase);
};

export const syncBetTargets = async (db, supabase) => {
    // TODO: Implement sync logic for bet targets
    const betTargets = await getAllBetTargets(supabase);
};

export const syncBetFormats = async (db, supabase) => {
    // TODO: Implement sync logic for bet formats
    const betFormats = await getAllBetFormats(supabase);
};

export const syncBetMarkets = async (db, supabase) => {
    // TODO: Implement sync logic for bet markets
};

export const syncGameResults = async (db, supabase) => {
    // TODO: Implement sync logic for game results
};

export const resyncGames = async (db, supabase) => {
    // TODO: Implement resync logic for games
    // Get all upcoming games from supabase
    // Add all that are not in the database
};

export const resyncBetMarkets = async (db, supabase) => {
    // TODO: Implement resync logic for bet markets
    // Get all bet markets for all upcoming games from supabase
    // Add all new bet market info to database
    // If there already is betMarket data available for a given game, clear it and replace it with the new data
};

export const resyncGameResults = async (db, supabase) => {
    // TODO: Implement resync logic for game results
    // Get all game results from the previous day from supabase
};

export const updateGameInfo = async (db, supabase) => {
    // TODO: Implement update logic for game info
    await resyncGames(db, supabase);
    await resyncBetMarkets(db, supabase);
};