import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity, Text, View } from '../Themed';
import { nbaTeamAbbreviations } from '../../data/teamAbbreviations';

import Colors from '@/constants/Colors';

export default function SportList({ sports, selectSport }) {

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
                data={sports}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity 
                            style={[styles.sportContainer]} // Set your desired height here
                            onPress={() => selectSport(item)}
                            testID={`game_${item.title}`}
                        >
                            <Text style={styles.sportText}>{item.title}</Text>
                        </TouchableOpacity>
                    </View>
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
});
