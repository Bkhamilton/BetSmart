import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { View } from '@/components/Themed'
import GameComponent from '@/components/PlaceBet/SelectGame/GameList/GameComponent/GameComponent';

export default function GameList({ games, selectGame, selectProp }) {
    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 100 }}
                data={games}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <GameComponent 
                        game={item} 
                        selectGame={selectGame}
                        selectProp={selectProp}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
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
