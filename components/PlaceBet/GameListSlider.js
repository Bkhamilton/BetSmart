import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity, Text, View } from '../Themed';
import { nbaTeamAbbreviations } from '../../data/teamAbbreviations';

import Colors from '@/constants/Colors';

export default function GameListSlider({ games, selectGame }) {

    // Function to get the abbreviation for a team name
    const getTeamAbbreviation = (teamName) => {
        return nbaTeamAbbreviations[teamName] || teamName;
    };

    return (
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 0 }}
            data={games}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity 
                  style={[styles.gameRowContainer]} // Set your desired height here
                  onPress={() => selectGame(item)}
                  testID={`game_${item.home}${item.away}`}
                >
                  <Text style={styles.gameText}>{getTeamAbbreviation(item.away_team)} vs {getTeamAbbreviation(item.home_team)}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
  );
}

const styles = StyleSheet.create({
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
});
