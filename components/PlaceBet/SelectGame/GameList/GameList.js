import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { View, Text } from '@/components/Themed'
import GameComponent from '@/components/PlaceBet/SelectGame/GameList/GameComponent/GameComponent';

export default function GameList({ games }) {
    const renderItem = useCallback(({ item }) => (
        <GameComponent 
          game={item} 
        />
    ), [games]);

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    const ItemSeparatorComponent = useCallback(() => (
        <View style={styles.separator} />
    ), []);

    return (
        <View style={styles.container}>
        {  
            games && games.length > 0 ? 
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 100 }}
                data={games}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={ItemSeparatorComponent}
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={21}
                getItemLayout={(data, index) => (
                  { length: 140, offset: 140 * index, index }
                )}
            />
            : 
            <View style={styles.noGameContainer}>
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
  },
  noGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
