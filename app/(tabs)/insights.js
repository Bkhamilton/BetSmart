import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Header from '@/components/Header/Header';
import BuildABet from '@/components/Insights/BuildABet';
import RecommendedBets from '@/components/Insights/RecommendedBets/RecommendedBets';
import { useSQLiteContext } from 'expo-sqlite';
import { retrieveMarketsDB } from '@/api/prop-odds/markets';
import { createTables, createUserSessionsTable } from '@/api/sqlite';
import { insertLeague, getAllLeagues, getLeagueByName } from '@/db/general/Leagues';
import { getAllGames, getTodaysGameswithNames, deleteGame } from '@/db/general/Games';
import { NBAcategories, NHLcategories, MLBcategories } from '@/data/leagueCategoryData';
import { insertLeagueProp } from '@/db/bet-general/LeagueProps';
import { insertBookie } from '@/db/general/Bookies';
import { insertSeason } from '@/db/general/Seasons';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '@/data/teamAbbreviations';
import { insertUser, getUser } from '@/db/user-specific/Users';
import { insertTeam, getAllTeams } from '@/db/general/Teams';
import { getAllBetTargets } from '@/db/bet-general/BetTargets';
import { fetchAndUpdateLogos } from '@/api/sportsdb/logos';
import { getLeaguePropByName } from '@/db/bet-general/LeagueProps';
import { deleteLeaguePropInfoByPropValue, getLeaguePropsInfoByPropValue } from '@/db/bet-general/LeaguePropsInfo';
import { getMostRecentActiveUserSession } from '@/db/user-specific/UserSessions';

export default function InsightScreen() {
  
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

  const db = useSQLiteContext();

  return (
    <View style={styles.container}>
      <Header title={"Insights"} />
      {/* Insights Intro Info : Streak + Bets Placed to Money Won */}
      {/* Loss Analysis Dashboard */}
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