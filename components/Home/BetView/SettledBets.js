import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';

export default function SettledBets({ bets }) {
    return (
      <View style={styles.container}>
          <View>
              <Text style={{ fontSize: 16 }}>Settled Bets</Text>
          </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
    },
  });