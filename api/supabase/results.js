import { getGamesForResults, getGameByTeams } from '@/api/supabase/Games.js';
import { insertGameResult } from '@/api/supabase/GameResults.js';
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
export async function displayResults(league, date, game) {

    console.log('Getting results for ' + game.homeTeamName + ' vs ' + game.awayTeamName);

    const { timestamp, homeTeamName, awayTeamName, homeTeamId, awayTeamId  } = game;
    const results = await getResultsData(league, date, homeTeamName, awayTeamName);
    if (!results.event) {
        console.log('No results found for ' + homeTeamName + ' vs ' + awayTeamName);
        return;
    }

    const event = results.event[0];

    // returning object with the results, including Spread and Total Points
    const homeScore = event.intHomeScore;
    const awayScore = event.intAwayScore;
    const winner = homeScore > awayScore ? homeTeamId : awayTeamId;

    const resultsObject = {
        homeTeam: homeTeamName,
        homeTeamId,
        awayTeam: awayTeamName,
        awayTeamId,
        timestamp,
        homeScore,
        awayScore,
        winner
    }

    return resultsObject;
}

export const fetchResults = async (supabase, leagueName, checkDate) => {
    let testGames = await getGamesForResults(supabase, checkDate, leagueName);
    const resultsArray = [];
    for (const game of testGames) {
        // First, convert timestamp to YYYY-MM-DD
        const date = game.timestamp.split('T')[0];
        // Get the results of the game
        const results = await displayResults(leagueName, date, game);
        resultsArray.push(results);
    }
    return resultsArray;
}

export const addResults = async (supabase, leagueName, checkDate) => {
    const results = await fetchResults(supabase, leagueName, checkDate);
    for (const result of results) {
        // Add the results to Game Results table
        const game = await getGameByTeams(supabase, result.homeTeamId, result.awayTeamId, result.timestamp);
        //await insertGameResult(supabase, game.gameId, result.homeScore, result.awayScore, result.winner);
        console.log('Added results for ' + result.homeTeam + ' vs ' + result.awayTeam + ' on ' + game.gameId);
    }
    return results;
}