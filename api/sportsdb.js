//SportsDB Api Functions

// function to get the team logo from the sportsdb API
export const getTeamLogoUrl = async (teamName, sport) => {
    try {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/2/searchteams.php?t=${teamName}`);
      const data = await response.json();
      const team = data.teams[0];
      return team.strTeamBadge;
    } catch (error) {
      console.error('Error fetching team logo:', error);
      return null;
    }
};