import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity, Text, View } from '../Themed';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '../../data/teamAbbreviations';

import Colors from '@/constants/Colors';

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

    function GameComponent({ game }) {
        return (
            <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}>
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
        );
    }

    return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 0 }}
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
