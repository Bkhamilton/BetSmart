import secrets from '@/secrets';
import { getTeamsByLeagueName } from '@/db/general/Teams.js';
import { insertPlayer } from '@/db/general/Players';
import { insertBetTarget } from '@/db/bet-general/BetTargets';

const teamNameMapping = {
    "LA Clippers": "Los_Angeles_Clippers",
    "Washington Football Team": "Washington_Commanders",
    "Arizona Coyotes": "Utah_Hockey_Club",
    // Add more mappings here if needed
};

// Function to get the players on the team
export const getPlayerInfo = async (team) => {
    const formattedTeam = teamNameMapping[team] || team.replace(/\s/g, '_');
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${secrets.SPORTSDB_API_KEY}/searchplayers.php?t=${formattedTeam}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

// Usage with async/await:
export async function displayTeamInfo() {
    const players = await getPlayerInfo('Boston Celtics');
    
    players.player.forEach(player => {
        // insert into Players table strPlayer, strPosition, strNumber, strCutout, teamId (grab teamId from Teams table)
        console.log(`${player.strPlayer} (#${player.strNumber}) - ${player.strPosition}`);
    });
}

// Functin to fetch the players from the API and store it in the SQLite DB
export const fetchAndUpdateRoster = async (db) => {
    const teams = await getTeamsByLeagueName(db, "MLB");
    for (const team of teams) {
        // Get the players on the team
        const playerInfo = await getPlayerInfo(team.teamName);
        if (!playerInfo.player) {
            console.log(`No players found for ${team.teamName}`);
            //break and end for testing purposes
            continue;
        }
        playerInfo.player.forEach(player => {
            // Update the player info in the SQLite DB
            if (player.strPosition === 'Manager') return;
            insertPlayer(db, player.strPlayer, player.strPosition, player.strNumber, player.strCutout, team.id);
        });
        console.log(`Players for ${team.teamName} updated`);
        // Loop through the players and store their info in the SQLite DB
    }
    console.log('MLB Bet Targets updated');
};