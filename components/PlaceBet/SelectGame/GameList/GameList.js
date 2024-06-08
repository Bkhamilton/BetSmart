import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed'
import GameComponent from './GameComponent';

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
            />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  }
});
