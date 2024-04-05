// Function to fetch game data from prop-odds api based on sport
import secrets from "../secrets";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getGames = async (sport) => {
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const response = await fetch(`https://api.prop-odds.com/beta/games/${sport}?date=${date}&tz=America/New_York&api_key=${secrets.PROP_ODDS_API_KEY}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
};

// Function to fetch game props from prop-odds api based on gameId
export const getGameProps = async (gameId) => {
  try {
    const response = await fetch(`https://api.prop-odds.com/beta/markets/${gameId}?api_key=${secrets.PROP_ODDS_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch game market props from prop-odds api based on gameId and market
export const getGameMarketProps = async (gameId, market) => {
  try {
    const response = await fetch(`https://api.prop-odds.com/beta/odds/${gameId}/${market}?api_key=${secrets.PROP_ODDS_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch data from API and store it in AsyncStorage
export const fetchData = async (sports) => {
    try {
      for (let sport of sports) {
        const data = await getGames(sport);
        await AsyncStorage.setItem(`${sport}Data`, JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
    }
};

// Function to retrieve data from AsyncStorage
export const retrieveData = async (sports) => {
  try {
    let data = [];
    for (let sport of sports) {
      const value = await AsyncStorage.getItem(`${sport}Data`);
      if (value !== null) {
        // We have data!!
        data.push({ sport, data: JSON.parse(value) });
      } else {
        // No data in AsyncStorage, fetch from API
        const fetchedData = await fetchData([sport]);
        data.push({ sport, data: fetchedData });
      }
    }
    return data;
  } catch (error) {
    // Error retrieving data
    console.error(error);
  }
};