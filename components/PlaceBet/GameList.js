import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity, Text, View } from '../Themed';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '@/data/teamAbbreviations';

import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function GameList({ games, selectGame, sport }) {

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
    };

    const getDate = (dateString) => {
      const date = new Date(dateString);
      const estDate = new Date(date.getTime() - (3600000 * 4)); // Subtract 4 hours from UTC to get EST
      return estDate.toISOString().split('T')[0]; // Returns the date part
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

    // Component for each game
    function GameComponent({ game }) {
        return (
          <TouchableOpacity 
            style={{ borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
            onPress={() => selectGame(game)}
          >
            <View style={{ flexDirection: 'row' }}>
                {/* Game Info. Team vs Team, Start Time */}
                <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 8 }}>
                        <View style={styles.gameTeamContainer}>
                            <View style={styles.teamIcon}/>
                            <Text>{getTeamAbbreviation(game.away_team, sport)}</Text>
                        </View>
                        <View style={styles.divider}/>
                        <View style={styles.gameTeamContainer}>
                            <View style={styles.teamIcon}/>
                            <Text>{getTeamAbbreviation(game.home_team, sport)}</Text>
                        </View>
                    </View>
                </View>
                {/* Odds for ML, Spread, Total */}
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {/* Moneyline */}
                    <View>
                        <View style={styles.propContainer}>
                            <Text>-195</Text>
                        </View>
                        <View style={styles.propContainer}>
                            <Text>+110</Text>
                        </View>
                    </View>
                    {/* Spread */}
                    <View>
                        <View style={styles.propContainer}>
                            <Text>-3.5</Text>
                        </View>
                        <View style={styles.propContainer}>
                            <Text>+3.5</Text>
                        </View>
                    </View>
                    {/* Total Pts */}
                    <View>
                        <View style={styles.propContainer}>
                            <Text>+218.5</Text>
                        </View>
                        <View style={styles.propContainer}>
                            <Text>-218.5</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 18 }}>{getTime(game.start_timestamp)}</Text>
                <Text style={{ fontSize: 12 }}>{getAmPm(game.start_timestamp)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {/* This is where I can include other info under bet buttons */}
              </View>
            </View>
          </TouchableOpacity>
        );
    }

    return (
        <View style={{ flexDirection: 'row', flex: 0.90, backgroundColor: 'transparent' }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 100 }}
                data={games}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <GameComponent game={item} />
                )}
            />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  sportContainer: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  gameRowContainer: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    borderWidth: 1,
    borderRadius: 0,
    width: 120,
    paddingVertical: 8,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  gameTeamContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  teamIcon: {
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    borderWidth: 1,
    marginRight: 8,
  },
  propContainer: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1, 
    borderBottomWidth: 1, 
    width: 150, 
    paddingTop: 4, 
    marginBottom: 4, 
    opacity: 0.1
  }
});
