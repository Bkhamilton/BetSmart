import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from '../Themed';

import Colors from '@/constants/Colors';

export default function RecentBets({ generatedBet, generate }) {
  return (
    <View style={styles.container}>
        <View>
            <Text>Recent Bets</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
