// Function to fetch game data from prop-odds api based on sport
export const getGames = async (sport) => {
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const response = await fetch(`https://api.prop-odds.com/beta/games/${sport}?date=${date}&tz=America/New_York&api_key=${process.env.PROP_ODDS_API_KEY}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
};

// Function to fetch game props from prop-odds api based on gameId
export const getGameProps = async (gameId) => {
  try {
    const response = await fetch(`https://api.prop-odds.com/beta/markets/${gameId}?api_key=${process.env.PROP_ODDS_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch game market props from prop-odds api based on gameId and market
export const getGameMarketProps = async (gameId, market) => {
  try {
    const response = await fetch(`https://api.prop-odds.com/beta/odds/${gameId}/${market}?api_key=${process.env.PROP_ODDS_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};