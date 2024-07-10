import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import InsightCard from '@/components/Insights/InsightCard';

export default function WinAnalysis({  }) {
  return (
    <View style={styles.container}>
      <View>
        <View style={{ paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 16 }}>Win Analysis</Text>
        </View>
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: 'row' }}
        >
            <InsightCard title="Value Victory" />
            <InsightCard title="Research Rewards" />
            <InsightCard title="Trend Spotting" />
            <InsightCard title="Discipline Decision" />
            <InsightCard title="Timing Triumphs" />
            <InsightCard title="Parlay Perfection" />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});