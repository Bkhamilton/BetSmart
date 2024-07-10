import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { useSQLiteContext } from 'expo-sqlite';
import { retrieveMarketsDB } from '@/api/prop-odds/markets';
import { getLeagueByName } from '@/db/general/Leagues';
import InsightIntro from '@/components/Insights/InsightIntro/InsightIntro';
import LossAnalysis from '@/components/Insights/LossAnalysis/LossAnalysis';
import { getTodaysGameswithNames } from '@/db/general/Games';
import WinAnalysis from '@/components/Insights/WinAnalysis/WinAnalysis';
import { FontAwesome } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function InsightScreen() {

  const [streak, setStreak] = useState('hot');

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
  
  // function to cycle betwen hot, cold, and no streaks
  const cycleStreak = () => {
    if (streak === 'hot') {
      setStreak('cold');
    } else if (streak === 'cold') {
      setStreak('');
    } else {
      setStreak('hot');
    }
  }

  const { iconColor } = useTheme();

  const db = useSQLiteContext();

  return (
    <>
      <Header title={"Insights"}>
        <TouchableOpacity
          onPress={cycleStreak}
          style={{ marginRight: 10 }}
        >
          <FontAwesome name="refresh" size={20} color={iconColor} />
        </TouchableOpacity>
      </Header>
      <View>
        {streak && <InsightIntro streak={streak}/>}
        {streak === 'hot' ? <WinAnalysis /> : <LossAnalysis />}
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