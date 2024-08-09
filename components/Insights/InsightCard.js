import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function InsightCard({ title }) {

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 16 }}>{title}</Text>
        <Text style={{ fontSize: 14, fontWeight: '500' }}>This is where a description of the title will go.</Text>
      </View>
      <View>
        {/* Example Bets Here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
});