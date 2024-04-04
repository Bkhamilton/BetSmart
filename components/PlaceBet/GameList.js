import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity, Text, View } from '../Themed';
import { nbaTeamAbbreviations } from '../../data/teamAbbreviations';

import Colors from '@/constants/Colors';

export default function GameList({ games, selectGame }) {

    // Function to get the abbreviation for a team name
    const getTeamAbbreviation = (teamName) => {
        return nbaTeamAbbreviations[teamName] || teamName;
    };

    // Component to display a game
        function GameComponent({ game }) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity 
                    style={[styles.gameContainer]}
                    onPress={() => selectGame(game)}
                    testID={`game_${game.home_team}${game.away_team}`}
                >
                    <Text style={styles.gameText}>{getTeamAbbreviation(game.away_team)} vs {getTeamAbbreviation(game.home_team)}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={{ borderWidth: 1, alignItems: 'center', justifyContent: 'center', width: 48 }}>
                        <Text>{getTeamAbbreviation(game.away_team)}</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ width: 28, alignItems: 'center' }}>
                            <Text>+5</Text>
                        </View>
                        <View style={{borderLeftWidth: 1, height: 50}}/>
                        <View style={{ width: 56, alignItems: 'center' }}>
                            <Text>+215.5</Text>
                            <View style={{ height: 1, borderTopWidth: 1, width: 56 }}/>
                            <Text>-215.5</Text>
                        </View>
                        <View style={{borderLeftWidth: 1, height: 50}}/>
                        <View style={{ width: 28, alignItems: 'center' }}>
                            <Text>-5</Text>
                        </View>                          
                    </View>
                    <TouchableOpacity style={{ borderWidth: 1, alignItems: 'center', justifyContent: 'center', width: 48 }}>
                        <Text>{getTeamAbbreviation(game.home_team)}</Text>
                    </TouchableOpacity>     
                </View>
            </View>
        );
    }

    return (
        <View style={{ flexDirection: 'row' }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 50 }}
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
});
