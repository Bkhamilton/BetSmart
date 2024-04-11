import { StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '@/components/Header/Header';
import React, { useState, useEffect } from 'react';

function GameDetails({ game, handleClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{game.league}</Text>
      </View>
      <View>
        <Text>Bet Details</Text>
        <TouchableOpacity onPress={handleClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function NoGameDetails({ handleClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>League</Text>
      </View>
      <View>
        <Text>No Game Selected</Text>
        <TouchableOpacity onPress={handleClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function BetDetailsScreen({ game }) {

  const [newGame, setNewGame] = useState({ away_team: 'Team 1', home_team: 'Team 2' });

  useEffect(() => {
    if (game) {
      setNewGame(game);
    }
  }, [game]);

  const router = useRouter();

  const handleClose = () => {
    router.navigate('newBet/selectGame');
  };

  return game ? <GameDetails game={game} handleClose={handleClose} /> : <NoGameDetails handleClose={handleClose} />;
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
    alignItems: 'center',
  },
});