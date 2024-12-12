import { getAllBookies } from './Bookies'; // DONE
import { getAllLeagues } from './Leagues'; // DONE
import { getAllSeasons } from './Seasons'; // DONE
import { getAllTeams } from './Teams'; // DONE
import { getAllPlayers } from './Players'; // DONE
import { getAllLeagueProps } from './LeagueProps'; // DONE
import { getAllLeaguePropsInfo } from './LeaguePropsInfo'; // DONE
import { getAllRelevantGames, getAllUpcomingGames } from './Games'; // DONE
import { getAllBetTypes } from './BetTypes'; // DONE
import { getAllRelevantBetTargets } from './BetTargets'; // DONE
import { getAllBetFormats } from './BetFormats'; // DONE
import { getAllRelevantBetMarkets, getMarketsForGame } from './BetMarkets'; // 1/2 DONE
import { getAllRelevantGameResults, getGameResultsForGame } from './GameResults'; // DONE
import { insertFullBetMarket } from '@/db/api/BetMarkets';
import { insertFullGame } from '@/db/general/Games';
import { insertFullGameResult } from '@/db/api/GameResults';

// Description: Sync data from Supabase to SQLite database
export const syncBookies = async (db, supabase) => {
    try {
        const bookies = await getAllBookies(supabase);
        if (bookies.length === 0) {
            console.log('No bookies to sync');
            return;
        }

        await db.withTransactionAsync(async () => {
            for (const bookie of bookies) {
                await db.runAsync(
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

        await db.withTransactionAsync(async () => {
            for (const league of leagues) {
                await db.runAsync(
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

        await db.withTransactionAsync(async () => {
            for (const season of seasons) {
                await db.runAsync(
                    'INSERT INTO Seasons (id, leagueId, season, games, description, seasonType, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [season.id, season.leagueId, season.season, season.games, season.description, season.seasonType, season.startDate, season.endDate]
                );
            }
        });

        console.log('Seasons synced successfully');
    } catch (error) {
        console.error('Error syncing seasons:', error);
    }
};

export const syncTeams = async (db, supabase) => {
    try {
        const teams = await getAllTeams(supabase);
        if (teams.length === 0) {
            console.log('No teams to sync');
            return;
        }

        await db.withTransactionAsync(async () => {
            for (const team of teams) {
                await db.runAsync(
                    'INSERT INTO Teams (id, teamName, abbreviation, leagueId, logoUrl) VALUES (?, ?, ?, ?, ?)',
                    [team.id, team.teamName, team.abbreviation, team.leagueId, team.logoUrl]
                );
            }
        });

        console.log('Teams synced successfully');
    } catch (error) {
        console.error('Error syncing teams:', error);
    }
};

export const syncPlayers = async (db, supabase) => {
    try {
        const players = await getAllPlayers(supabase);
        if (players.length === 0) {
            console.log('No players to sync');
            return;
        }

        await db.withTransactionAsync(async () => {
            for (const player of players) {
                await db.runAsync(
                    'INSERT INTO Players (id, name, position, number, image, teamId) VALUES (?, ?, ?, ?, ?, ?)',
                    [player.id, player.name, player.position, player.number, player.image, player.teamId]
                );
            }
        });

        console.log('Players synced successfully');
    } catch (error) {
        console.error('Error syncing players:', error);
    }
}

export const syncLeagueProps = async (db, supabase) => {
    try {
        const leagueProps = await getAllLeagueProps(supabase);
        if (leagueProps.length === 0) {
            console.log('No league props to sync');
            return;
        }

        await db.withTransactionAsync(async () => {
            for (const prop of leagueProps) {
                await db.runAsync(
                    'INSERT INTO LeagueProps (id, propName, leagueId) VALUES (?, ?, ?)',
                    [prop.id, prop.propName, prop.leagueId]
                );
            }
        });

        console.log('League props synced successfully');
    } catch (error) {
        console.error('Error syncing league props:', error);
    }
};

export const syncLeaguePropsInfo = async (db, supabase) => {
    try {
        const leaguePropsInfo = await getAllLeaguePropsInfo(supabase);
        if (leaguePropsInfo.length === 0) {
            console.log('No league props info to sync');
            return;
        }

        await db.withTransactionAsync(async () => {
            for (const info of leaguePropsInfo) {
                await db.runAsync(
                    'INSERT INTO LeaguePropsInfo (id, propValue, leaguePropId) VALUES (?, ?, ?)',
                    [info.id, info.propValue, info.leaguePropId]
                );
            }
        });

        console.log('League props info synced successfully');
    } catch (error) {
        console.error('Error syncing league props info:', error);
    }
};

export const syncGames = async (db, supabase) => {
    try {
        const games = await getAllRelevantGames(supabase);
        if (games.length === 0) {
            console.log('No games to sync');
            return;
        }

        await db.withTransactionAsync(async () => {
            for (const game of games) {
                await db.runAsync(
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

        await db.withTransactionAsync(async () => {
            for (const betType of betTypes) {
                await db.runAsync(
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

        await db.withTransactionAsync(async () => {
            for (const betTarget of betTargets) {
                await db.runAsync(
                    'INSERT INTO BetTargets (id, targetType, targetName, teamId, gameId) VALUES (?, ?, ?, ?, ?)',
                    [betTarget.id, betTarget.targettype, betTarget.targetname, betTarget.teamid, betTarget.gameid]
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

        await db.withTransactionAsync(async () => {
            for (const betFormat of betFormats) {
                await db.runAsync(
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

        await db.withTransactionAsync(async () => {
            for (const betMarket of betMarkets) {
                await db.runAsync(
                    'INSERT INTO BetMarkets (id, gameId, marketType, timestamp, value, odds, overUnder, betTargetId, bookieId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [betMarket.id, betMarket.game_id, betMarket.market_type, betMarket.time_stamp, betMarket.value, betMarket.odds, betMarket.over_under, betMarket.bet_target_id, betMarket.bookie_id]
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

        await db.withTransactionAsync(async () => {
            for (const gameResult of gameResults) {
                await db.runAsync(
                    'INSERT INTO GameResults (id, gameId, homeScore, awayScore, winner) VALUES (?, ?, ?, ?, ?)',
                    [gameResult.id, gameResult.game_id, gameResult.home_score, gameResult.away_score, gameResult.winner]
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

                if (existingGame.length === 0) {
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
            const gameMarkets = await getMarketsForGame(supabase, game.gameId);
            if (gameMarkets.length === 0) {
                console.log(`No bet markets to resync for gameId: ${game.gameId}`);
                continue;
            }

            await db.withTransactionAsync(async () => {
                await db.runAsync(
                    'DELETE FROM BetMarkets WHERE gameId = ?',
                    [game.gameId]
                );

                for (const market of gameMarkets) {
                    const identicalMarket = await db.getAllAsync('SELECT * FROM BetMarkets WHERE gameId = ? AND marketType = ? AND timestamp = ? AND value = ? AND odds = ? AND overUnder = ? AND betTargetId = ? AND bookieId = ?', [game.gameId, market.marketType, market.timestamp, market.value, market.odds, market.overUnder, market.betTargetId, market.bookieId]);
                    if (identicalMarket.length > 0) {
                        continue;
                    }
                    await insertFullBetMarket(db, market.id, game.gameId, market.marketType, market.timestamp, market.value, market.odds, market.overUnder, market.betTargetId, market.bookieId);
                }
            });
        }
        console.log('Bet markets resynced successfully');
    } catch (error) {
        console.error('Error resyncing bet markets:', error);
    }
};

export const resyncGameResults = async (db, supabase, games) => {
    // TODO: Implement resync logic for game results
    // Get all game results from the previous day from supabase
    // const games = getGamesFromYesterday();
    try {
        for (const game of games) {
            console.log(`Fetching game results for gameId: ${game.gameId}`);
            const gameResults = await getGameResultsForGame(supabase, game.gameId);
            if (!gameResults) {
                console.log(`No game results to resync for gameId: ${game.gameId}`);
                continue;
            } else {
                await insertFullGameResult(db, gameResults.id, game.gameId, gameResults.homeScore, gameResults.awayScore, gameResults.winner);
            }

            console.log(`Game results resynced successfully for gameId: ${game.gameId}`);
        }
    } catch (error) {
        console.error('Error resyncing game results:', error);
    }
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

export const updateMarkets = async (db, supabase) => {
    const games = await getAllUpcomingGames(supabase);
    await resyncBetMarkets(db, supabase, games);
}