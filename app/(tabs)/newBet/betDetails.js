import { StyleSheet, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, Pressable, ScrollView } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '@/data/teamAbbreviations';
import CategorySlider from '../../../components/PlaceBet/BetDetails/CategorySlider';
import MainInfo from '../../../components/PlaceBet/BetDetails/MainInfo';

export default function BetDetailsScreen() {
  const { currentGame } = useContext(BetContext);
  const { league } = useContext(BetContext);
  const router = useRouter();

  const handleClose = () => {
    router.navigate('newBet/selectGame');
  };

  // Object mapping sports to their respective abbreviation objects
  const sportAbbreviations = {
      nba: nbaTeamAbbreviations,
      mlb: mlbTeamAbbreviations,
      nhl: nhlTeamAbbreviations,
  };

  // Function to get the abbreviation for a team name
  const getTeamAbbreviation = (teamName, sport) => {
      const abbreviations = sportAbbreviations[sport.toLowerCase()];
      return abbreviations ? (abbreviations[teamName] || teamName) : teamName;
  }
  
  const GameHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={{ flex: 0.2 }}>
          <TouchableOpacity onPress={handleClose}>
            <FontAwesome5 name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'flex-start5' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{league}</Text>
        </View>
        <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 20, fontWeight: '500', marginRight: 8 }}>$200</Text>
          <TouchableOpacity>
            <FontAwesome5 name="wallet" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <GameHeader />
      <ScrollView>
        <MainInfo currentGame={currentGame} />
        <CategorySlider />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 84, 
    paddingHorizontal: 20, 
    paddingTop: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});