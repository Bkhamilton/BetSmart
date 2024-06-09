import { getAllTeams } from '@/db/general/Teams.js';

const teamNameMapping = {
    "LA Clippers": "Los_Angeles_Clippers",
    "Washington Football Team": "Washington_Commanders",
    // Add more mappings here if needed
};

// Function to get the logo of a team
export const getTeamInfo = async (team) => {
    const formattedTeam = teamNameMapping[team] || team.replace(/\s/g, '_');
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${formattedTeam}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Function to store the logo of a team in the SQLite DB
export const updateTeamLogo = async (db, teamId, logoUrl) => {
    await db.runAsync(`
      UPDATE Teams SET logoUrl = ? WHERE id = ?;
    `, [logoUrl, teamId]);
    console.log(`Logo URL updated for team ${teamId}`);
};

// Function to fetch logos of teams from API and store it in SQLite DB
export const fetchAndUpdateLogos = async (db) => {
    const teams = await getAllTeams(db);
    for (const team of teams) {
        if (team.logoUrl === null) {
            const teamInfo = await getTeamInfo(team.teamName);
            const logoUrl = teamInfo.teams[0].strTeamLogo;
            await updateTeamLogo(db, team.id, logoUrl);
        }
    }
    console.log('Logos updated');
};