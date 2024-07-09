import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import InsightCard from './InsightCard';

export default function LossAnalysis({  }) {
  return (
    <View style={styles.container}>
      <View>
        <View style={{ paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 16 }}>Loss Analysis</Text>
        </View>
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: 'row' }}
        >
            <InsightCard title="Bad Beats" />
            <InsightCard title="Longshots" />
            <InsightCard title="Chasing A Loss" />
            <InsightCard title="Overconfidence" />
            <InsightCard title="Parlay Pitfalls" />
            <InsightCard title="Bankroll Management" />
            <InsightCard title="Lack of Research" />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
  },
});