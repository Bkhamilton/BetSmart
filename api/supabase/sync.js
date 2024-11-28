import { getAllBookies } from './Bookies'; // DONE
import { getAllLeagues } from './Leagues'; // DONE
import { getAllSeasons } from './Seasons'; // DONE
import { getAllRelevantGames, getAllUpcomingGames } from './Games'; // DONE
import { getAllBetTypes } from './BetTypes'; // DONE
import { getAllRelevantBetTargets } from './BetTargets'; // 1/2 DONE
import { getAllBetFormats } from './BetFormats'; // DONE
import { getAllRelevantBetMarkets, getMarketsForGame } from './BetMarkets'; // 1/2 DONE
import { getAllRelevantGameResults } from './GameResults';
import { insertFullBetMarket } from '@/db/api/BetMarkets';
import { insertFullGame } from '@/db/general/Games';

// Description: Sync data from Supabase to SQLite database
export const syncBookies = async (db, supabase) => {
    try {
        const bookies = await getAllBookies(supabase);
        if (bookies.length === 0) {
            console.log('No bookies to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const bookie of bookies) {
                await tx.executeSql(
                    'INSERT INTO Bookies (id, name, description) VALUES (?, ?, ?)',
                    [bookie.id, bookie.name, bookie.description]
                );
            }
        });

        console.log('Bookies synced successfully');
    } catch (error) {
        console.error('Error syncing bookies:', error);
    }
};

export const syncLeagues = async (db, supabase) => {
    try {
        const leagues = await getAllLeagues(supabase);
        if (leagues.length === 0) {
            console.log('No leagues to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const league of leagues) {
                await tx.executeSql(
                    'INSERT INTO Leagues (id, leagueName, sport, description) VALUES (?, ?, ?, ?)',
                    [league.id, league.leagueName, league.sport, league.description]
                );
            }
        });

        console.log('Leagues synced successfully');
    } catch (error) {
        console.error('Error syncing leagues:', error);
    }
};

export const syncSeasons = async (db, supabase) => {
    try {
        const seasons = await getAllSeasons(supabase);
        if (seasons.length === 0) {
            console.log('No seasons to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const season of seasons) {
                await tx.executeSql(
                    'INSERT INTO Seasons (id, leagueId, year, description) VALUES (?, ?, ?, ?)',
                    [season.id, season.leagueId, season.year, season.description]
                );
            }
        });

        console.log('Seasons synced successfully');
    } catch (error) {
        console.error('Error syncing seasons:', error);
    }
};

export const syncGames = async (db, supabase) => {
    try {
        const games = await getAllRelevantGames(supabase);
        if (games.length === 0) {
            console.log('No games to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const game of games) {
                await tx.executeSql(
                    'INSERT INTO Games (id, gameId, seasonId, date, timestamp, homeTeamId, awayTeamId) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [game.id, game.gameId, game.seasonId, game.date, game.timestamp, game.homeTeamId, game.awayTeamId]
                );
            }
        });

        console.log('Games synced successfully');
    } catch (error) {
        console.error('Error syncing games:', error);
    }
};

export const syncBetTypes = async (db, supabase) => {
    try {
        const betTypes = await getAllBetTypes(supabase);
        if (betTypes.length === 0) {
            console.log('No bet types to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const betType of betTypes) {
                await tx.executeSql(
                    'INSERT INTO BetTypes (id, betType, description) VALUES (?, ?, ?)',
                    [betType.id, betType.betType, betType.description]
                );
            }
        });

        console.log('Bet types synced successfully');
    } catch (error) {
        console.error('Error syncing bet types:', error);
    }
};

export const syncBetTargets = async (db, supabase) => {
    try {
        const betTargets = await getAllRelevantBetTargets(supabase);
        if (betTargets.length === 0) {
            console.log('No bet targets to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const betTarget of betTargets) {
                await tx.executeSql(
                    'INSERT INTO BetTargets (id, targetType, targetName, teamId, gameId) VALUES (?, ?, ?, ?, ?)',
                    [betTarget.id, betTarget.targetType, betTarget.targetName, betTarget.teamId, betTarget.gameId]
                );
            }
        });

        console.log('Bet targets synced successfully');
    } catch (error) {
        console.error('Error syncing bet targets:', error);
    }
};

export const syncBetFormats = async (db, supabase) => {
    try {
        const betFormats = await getAllBetFormats(supabase);
        if (betFormats.length === 0) {
            console.log('No bet formats to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const betFormat of betFormats) {
                await tx.executeSql(
                    'INSERT INTO BetFormats (id, formatName, description) VALUES (?, ?, ?)',
                    [betFormat.id, betFormat.formatName, betFormat.description]
                );
            }
        });

        console.log('Bet formats synced successfully');
    } catch (error) {
        console.error('Error syncing bet formats:', error);
    }
};

export const syncBetMarkets = async (db, supabase) => {
    try {
        const betMarkets = await getAllRelevantBetMarkets(supabase);
        if (betMarkets.length === 0) {
            console.log('No bet markets to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const betMarket of betMarkets) {
                await tx.executeSql(
                    'INSERT INTO BetMarkets (id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [betMarket.id, betMarket.gameId, betMarket.marketType, betMarket.timestamp, betMarket.value, betMarket.odds, betMarket.overUnder, betMarket.betTargetId, betMarket.bookieId]
                );
            }
        });

        console.log('Bet markets synced successfully');
    } catch (error) {
        console.error('Error syncing bet markets:', error);
    }
};

export const syncGameResults = async (db, supabase) => {
    try {
        const gameResults = await getAllRelevantGameResults(supabase);
        if (gameResults.length === 0) {
            console.log('No game results to sync');
            return;
        }

        await db.transaction(async (tx) => {
            for (const gameResult of gameResults) {
                await tx.executeSql(
                    'INSERT INTO GameResults (id, gameId, homeScore, awayScore, winner) VALUES (?, ?, ?, ?, ?)',
                    [gameResult.id, gameResult.gameId, gameResult.homeScore, gameResult.awayScore, gameResult.winner]
                );
            }
        });

        console.log('Game results synced successfully');
    } catch (error) {
        console.error('Error syncing game results:', error);
    }
};

export const resyncGames = async (db, supabase, games) => {
    // TODO: Implement resync logic for games
    // Get all upcoming games from supabase
    // Add all that are not in the database
    // If a game is already in the database, do nothing
    try {

        await db.withTransactionAsync(async () => {
            for (const game of games) {
                const existingGame = await db.getAllAsync('SELECT * FROM Games WHERE gameId = ?', [game.gameId]);

                if (!existingGame) {
                    await insertFullGame(db, game.id, game.gameId, game.seasonId, game.date, game.timestamp, game.homeTeamId, game.awayTeamId);
                }
            }
        })

        console.log('Games resynced successfully');
    } catch (error) {
        console.error('Error resyncing games:', error);
    }
};

export const resyncBetMarkets = async (db, supabase, games) => {
    // TODO: Implement resync logic for bet markets
    // Get all bet markets for all upcoming games from supabase
    // Add all new bet market info to database
    // If there already is betMarket data available for a given game, clear it and replace it with the new data
    try {
        for (const game of games) {
            console.log(`Fetching bet markets for gameId: ${game.gameId}`);
            const gameMarkets = await getMarketsForGame(supabase, game.gameId);
            if (gameMarkets.length === 0) {
                console.log(`No bet markets to resync for gameId: ${game.gameId}`);
                continue;
            }

            await db.withTransactionAsync(async () => {
                await db.execAsync(
                    'DELETE FROM BetMarkets WHERE gameId = ?',
                    [game.gameId]
                );

                for (const market of gameMarkets) {
                    console.log('Params:', market.id, game.gameId, market.marketType, market.timestamp, market.value, market.odds, market.overUnder, market.betTargetId, market.bookieId);
                    await insertFullBetMarket(db, market.id, game.gameId, market.marketType, market.timestamp, market.value, market.odds, market.overUnder, market.betTargetId, market.bookieId);
                }
            });

            console.log(`Bet markets resynced successfully for gameId: ${game.gameId}`);
        }
    } catch (error) {
        console.error('Error resyncing bet markets:', error);
    }
};

export const resyncGameResults = async (db, supabase) => {
    // TODO: Implement resync logic for game results
    // Get all game results from the previous day from supabase
};

export const updateGameInfo = async (db, supabase) => {
    // TODO: Implement update logic for game info
    const games = await getAllUpcomingGames(supabase);
    if (games.length === 0) {
        console.log('No games to update');
        return;
    }
    await resyncGames(db, supabase, games);
    await resyncBetMarkets(db, supabase, games);
};

export const checkForUpdates = async (db, supabase) => {
    // TODO: Implement check for updates logic
    // Check for updates to game info
    // If there are updates, run the updateGameInfo function
    // Check for updates to game results
    // If there are updates, run the resyncGameResults function
}