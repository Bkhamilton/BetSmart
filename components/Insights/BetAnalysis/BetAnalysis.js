import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ScrollView } from '@/components/Themed';
import InsightCard from '@/components/Insights/InsightCard';

const winTitles = [
  "Value Victory",
  "Research Rewards",
  "Trend Spotting",
  "Discipline Decision",
  "Timing Triumphs",
  "Parlay Perfection"
];

const lossTitles = [
  "Bad Beats",
  "Longshots",
  "Chasing A Loss",
  "Overconfidence",
  "Parlay Pitfalls",
  "Bankroll Management",
  "Lack of Research"
];

export default function BetAnalysis({ streak }) {
  const titles = streak === 'hot' ? winTitles : lossTitles;
  const analysisTitle = streak === 'hot' ? 'Win Analysis' : 'Loss Analysis';

  return (
    <View style={styles.container}>
      <View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: '500' }}>{analysisTitle}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: 'row' }}
        >
          {titles.map((title, index) => (
            <InsightCard key={index} title={title} />
          ))}
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