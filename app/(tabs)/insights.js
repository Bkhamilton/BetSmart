import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Header from '@/components/Header/Header';
import BuildABet from '@/components/Insights/BuildABet';
import RecommendedBets from '@/components/Insights/RecommendedBets/RecommendedBets';
import { useSQLiteContext } from 'expo-sqlite';
import { retrieveGamesDB } from '@/api/prop-odds/games';
import { retrieveMarketsDB } from '@/api/prop-odds/markets';
import { createTables } from '@/api/sqlite';
import { insertLeague, getAllLeagues, getLeagueByName } from '@/db/general/Leagues';
import { getAllGames, getTodaysGameswithNames, deleteGame } from '@/db/general/Games';
import { NBAcategories, NHLcategories, MLBcategories } from '@/data/leagueCategoryData';
import { insertLeagueProp } from '@/db/bet-general/LeagueProps';
import { insertBookie } from '@/db/general/Bookies';
import { insertSeason } from '@/db/general/Seasons';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '@/data/teamAbbreviations';
import { insertUser, getUser } from '@/db/user-specific/Users';
import { insertTeam } from '@/db/general/Teams';
import { fetchAndUpdateLogos } from '@/api/sportsdb/logos';

export default function InsightScreen() {
  const recentBets = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const recentWinnings = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const [generatedRecentBets, setGeneratedRecentBets] = useState([]);
  const [generatedRecentWinnings, setGeneratedRecentWinnings] = useState([]);

  const generateItems = (data) => {
    const itemsCount = Math.floor(Math.random() * 2) + 3; // Random number between 3 and 4
    const shuffledData = data.sort(() => Math.random() - 0.5); // Shuffle the array
    return shuffledData.slice(0, itemsCount); // Return a new array with the random items
  };

  const saveForLater = () => {
    const date = '2024-05-27'
    getLeagueByName(db, "NBA").then((league) => {
      getSeasonByDate(db, league.id, date).then((season) => {
        getTodaysGameswithNames(db, date, season.id).then((games) => {
          retrieveMarketsDB(db, games[0].gameId, ['spread']).then((data) => {
            console.log(data);
          });
        });
      });
    });
  }

  const generateFunction = () => {
    try {
        fetchAndUpdateLogos(db);
      } catch (error) {
      console.error(error);
    }
  }

  const db = useSQLiteContext();

  useEffect(() => {
    // Generate the random items when the component mounts
    const initialRecentBets = generateItems(recentBets);
    const initialRecentWinnings = generateItems(recentWinnings);

    setGeneratedRecentBets(initialRecentBets);
    setGeneratedRecentWinnings(initialRecentWinnings);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <View style={styles.container}>
      <Header title={"Insights"} />
      <View style={{ paddingHorizontal: 10, paddingVertical: 12 }}>
        <BuildABet generate={generateFunction}/>
      </View>
      <RecommendedBets wins={generatedRecentBets} losses={generatedRecentBets} recent={generatedRecentBets}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightSection: {
    flex: 1,
    marginHorizontal: 8
  },
});