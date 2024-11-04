import secrets from "../../secrets";

// Function to fetch data from API
export const getLeagues = async () => {
  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${secrets.THE_ODDS_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}