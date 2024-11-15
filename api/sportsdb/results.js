import { getGamesForResults } from '@/db/general/Games.js';
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
export async function displayResults(league, date, homeTeam, awayTeam) {
    const results = await getResultsData(league, date, homeTeam, awayTeam);
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
        homeScore,
        awayScore,
        winner,
        spread,
        totalPoints
    }

    return resultsObject;
}
