import { getGamesForResults, getGameByTeams } from '@/db/general/Games.js';
import { getTeamId } from '@/db/general/Teams.js';
import { insertGameResult } from '@/db/api/GameResults.js';
/*
    Goal: Get the results of a specific match by using sportsDB Api

    example link
    https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=NBA_2024-10-28_Boston_Celtics_vs_Milwaukee_Bucks

    NEED:
    - League Name
    - Date (YYYY-MM-DD)
    - Home Team
    - Away Team

*/

const teamMapping = {
    'St Louis Blues': 'St. Louis Blues',
}

// Function to get the results from the SportsDB API
const getResultsData = async (league, date, homeTeam, awayTeam) => {
    // Check if teamMapping has the homeTeam and awayTeam, if so use the mapped value
    const formattedHomeTeam = teamMapping[homeTeam] ? teamMapping[homeTeam].replace(/\s/g, '_') : homeTeam.replace(/\s/g, '_');
    const formattedAwayTeam = teamMapping[awayTeam] ? teamMapping[awayTeam].replace(/\s/g, '_') : awayTeam.replace(/\s/g, '_');
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=${league}_${date}_${formattedHomeTeam}_vs_${formattedAwayTeam}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

// Function to print the results of a specific match
export async function displayResults(league, timestamp, date, homeTeam, awayTeam) {
    const results = await getResultsData(league, timestamp, homeTeam, awayTeam);
    if (!results.event) {
        console.log('No results found for ' + homeTeam + ' vs ' + awayTeam);
        return;
    }

    const game = results.event[0];

    // returning object with the results, including Spread and Total Points
    const homeScore = game.intHomeScore;
    const awayScore = game.intAwayScore;
    const winner = homeScore > awayScore ? game.strHomeTeam : game.strAwayTeam;
    const spread = winner === game.strHomeTeam ? '-' +  (game.intHomeScore - game.intAwayScore) : '-' + (game.intAwayScore - game.intHomeScore);
    const totalPoints = parseInt(game.intHomeScore) + parseInt(game.intAwayScore);

    const resultsObject = {
        homeTeam,
        awayTeam,
        date,
        homeScore,
        awayScore,
        winner,
        spread,
        totalPoints
    }

    return resultsObject;
}

export const fetchResults = async (db, leagueName, checkDate) => {
    let testGames = await getGamesForResults(db, checkDate, leagueName);
    const resultsArray = [];
    for (const game of testGames) {
        // First, convert timestamp to YYYY-MM-DD
        const date = game.timestamp.split('T')[0];
        // Get the results of the game
        const results = await displayResults(leagueName, date, game.date, game.homeTeamName, game.awayTeamName);
        resultsArray.push(results);
    }
    return resultsArray;
}

export const addResults = async (db, leagueName, checkDate) => {
    const results = await fetchResults(db, leagueName, checkDate);
    for (const result of results) {
        // Add the results to Game Results table
        const homeTeamId = await getTeamId(db, result.homeTeam);
        const awayTeamId = await getTeamId(db, result.awayTeam);
        const game = await getGameByTeams(db, homeTeamId.id, awayTeamId.id, result.date);
        await insertGameResult(db, game.gameId, result.homeScore, result.awayScore, result.winner, result.spread, result.totalPoints);
        console.log('Added results for ' + result.homeTeam + ' vs ' + result.awayTeam + ' on ' + game.gameId);
    }
    return results;
}