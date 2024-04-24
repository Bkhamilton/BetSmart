import { StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, Pressable } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '@/data/teamAbbreviations';

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

  const getDate = (dateString) => {
    const date = new Date(dateString);
    const estDate = new Date(date.getTime() - (3600000 * 4)); // Subtract 4 hours from UTC to get EST
    const month = estDate.getMonth() + 1; // getMonth returns month index starting from 0
    const day = estDate.getDate();
    return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`; // Returns the date in MM/DD format
  };
  
  const getTime = (dateString) => {
    const date = new Date(dateString);
    const estDate = new Date(date.getTime() - (3600000 * 4)); // Subtract 4 hours from UTC to get EST
    let hours = estDate.getHours();
    const minutes = estDate.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr}`; // Returns the time part in 12-hour format
  };
  
  const getAmPm = (dateString) => {
    const date = new Date(dateString);
    const estDate = new Date(date.getTime() - (3600000 * 4)); // Subtract 4 hours from UTC to get EST
    const hours = estDate.getHours();
    return hours >= 12 ? 'PM' : 'AM';
  };

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
            <FontAwesome5 name="wallet" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <GameHeader />
      <View style={styles.dateTimeContainer}>
        <Text>{getDate(currentGame.start_timestamp)}</Text>
        <Text>{getTime(currentGame.start_timestamp)} {getAmPm(currentGame.start_timestamp)}</Text>
      </View>
      <View style={styles.matchupContainer}>
        <Text style={styles.matchupTitle}>{currentGame.away_team}</Text>
        <Text>vs</Text>
        <Text style={styles.matchupTitle}>{currentGame.home_team}</Text>
      </View>
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
  matchupContainer: {
    flex: 1,
    alignItems: 'center',
  },
  matchupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  }
});