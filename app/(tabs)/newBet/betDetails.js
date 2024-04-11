import { StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';

export default function BetDetailsScreen({ game }) {

  function GameDetails({ game, handleClose }) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={{ flex: 0.2, alignItems: 'center' }}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="return-up-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{game.league}</Text>
          </View>
          <View style={{ flex: 0.2, alignItems: 'center' }}>
            
          </View>                
        </View>
        <View>
          <Text>Bet Details</Text>
        </View>
      </View>
    );
  }
  
  function NoGameDetails({ handleClose }) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={{ flex: 0.2 }}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="return-up-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>League</Text>
          </View>
          <View style={{ flex: 0.2, alignItems: 'center' }}>
            
          </View>                
        </View>
        <View>
          <Text>No Game Selected</Text>
        </View>
      </View>
    );
  }

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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});