import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function InsightIntro({ props }) {
  return (
    <View style={styles.container}>
      <View style={{ borderWidth: 1 }}>
        <Text style={{ fontSize: 16 }}>Hot Streak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 1,
  },
});