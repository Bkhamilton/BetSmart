import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from '../Themed';

import Colors from '@/constants/Colors';

export default function BuildABet() {
  return (
    <View style={{ borderWidth: 1, width: '100%', borderRadius: 16, paddingVertical: 8 }}>
        <View style={styles.titleTextContainer}>
            <Text>Build A Bet</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  titleTextContainer: {
    alignItems: 'center'
  }
});
