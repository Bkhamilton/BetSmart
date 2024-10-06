import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, ScrollView } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { useSQLiteContext } from 'expo-sqlite';
import InsightIntro from '@/components/Insights/InsightIntro/InsightIntro';
import BetAnalysis from '@/components/Insights/BetAnalysis/BetAnalysis';
import TopBet from '@/components/Insights/TopBet';
import { FontAwesome } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function InsightScreen() {

  const [streak, setStreak] = useState('hot');

  const tempFunction = () => {

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
      <ScrollView 
        style={styles.container}
      >
        <InsightIntro streak={streak}/>
        <BetAnalysis streak={streak}/>
        <TopBet />
        {/* BankRoll Management */}
        {/* Top Props / Top Bets */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});