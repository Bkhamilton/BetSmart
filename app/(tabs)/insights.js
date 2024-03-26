import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Header from '../../components/Header/Header';
import RecentWinnings from '../../components/Insights/RecentWinnings';
import RecentBets from '../../components/Insights/RecentBets';
import BuildABet from '../../components/Insights/BuildABet';

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

  useEffect(() => {
    // Generate the random items when the component mounts
    const initialRecentBets = generateItems(recentBets);
    const initialRecentWinnings = generateItems(recentWinnings);

    setGeneratedRecentBets(initialRecentBets);
    setGeneratedRecentWinnings(initialRecentWinnings);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <View style={styles.container}>
      <Header title={"BetSmart"} />
      <View style={{ paddingHorizontal: 8, paddingVertical: 16 }}>
        <BuildABet />
      </View>
      <View>
        <View style={styles.insightsContainer}>
          <View style={styles.insightSection}>
            <RecentWinnings generatedBet={generatedRecentWinnings} />
          </View>
          <View style={styles.insightSection}>
            <RecentBets generatedBet={generatedRecentBets} />
          </View>
        </View>
      </View>
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