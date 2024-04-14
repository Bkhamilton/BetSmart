import { StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext';

export default function BetDetailsScreen({ game }) {
  const { currentGame } = useContext(BetContext);
  const router = useRouter();

  const handleClose = () => {
    router.navigate('newBet/selectGame');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flex: 0.2 }}>
          <TouchableOpacity onPress={handleClose}>
            <FontAwesome5 name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{currentGame?.league}</Text>
        </View>
        <View style={{ flex: 0.2, alignItems: 'center' }}></View>
      </View>
      <View>
        <Text>Game: {currentGame?.home_team} vs {currentGame?.away_team}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});