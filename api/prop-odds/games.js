import secrets from "../secrets";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllGames, insertGame } from "../../db/general/Games";

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

// Function to fetch data from API and store it in AsyncStorage
export const fetchData = async (sports) => {
    try {
      for (let sport of sports) {
        const data = await getGames(sport);
        await AsyncStorage.setItem(`${sport}Data`, JSON.stringify(data));
        return data;
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
        const parsedValue = JSON.parse(value);
        // Check if the date is from a previous day
        const today = new Date();
        today.setHours(0, 0, 0, 0); // set the time to 00:00:00
        const valueDate = new Date(parsedValue.date);
        if (valueDate.getTime() === today.getTime()) {
          // If the date is today, use the data from AsyncStorage
          data.push({ sport, data: parsedValue });
        } else {
          // If the date is from a previous day, fetch the data again
          const fetchedData = await fetchData([sport]);
          data.push({ sport, data: fetchedData });
        }
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