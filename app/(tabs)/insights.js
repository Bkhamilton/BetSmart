import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { useSQLiteContext } from 'expo-sqlite';
import { retrieveMarketsDB } from '@/api/prop-odds/markets';
import { getLeagueByName } from '@/db/general/Leagues';
import InsightIntro from '@/components/Insights/InsightIntro/InsightIntro';
import LossAnalysis from '@/components/Insights/LossAnalysis/LossAnalysis';
import { getTodaysGameswithNames } from '@/db/general/Games';

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
    <>
      <Header title={"Insights"} />
      <View>
        <InsightIntro />
        <LossAnalysis />
      </View>
    </>
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