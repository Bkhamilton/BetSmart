import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';

export default function BetDisplay({ type }) {
    const typeMap = {
      Today: 'Today\'s Bets',
      Settled: 'Settled Bets',
      Future: 'Future Bets',
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
