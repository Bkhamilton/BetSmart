import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { View, Text } from '@/components/Themed'
import GameComponent from '@/components/PlaceBet/SelectGame/GameList/GameComponent/GameComponent';

export default function GameList({ games, selectGame }) {
    return (
        <View style={styles.container}>
          {  
            games && games.length > 0 ? 
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 100 }}
                data={games}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <GameComponent 
                    game={item} 
                    selectGame={selectGame}
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            : 
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No games available</Text>
              </View>
          }
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  separator: {
    height: 4,
    backgroundColor: 'transparent',
  }
});
