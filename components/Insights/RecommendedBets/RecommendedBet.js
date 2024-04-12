import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';

export default function RecommendedBet({ type }) {
  
    const typeMap = {
      Wins: 'Recent Wins',
      Losses: 'Recent Losses',
      Recent: 'Recent Bets',
    };
  
    return (
      <View style={styles.container}>
          <View>
              <Text style={{ fontSize: 16 }}>{typeMap[type]}</Text>
          </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
    },
  });
