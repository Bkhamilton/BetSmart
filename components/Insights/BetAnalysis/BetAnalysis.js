import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ScrollView } from '@/components/Themed';
import InsightCard from '@/components/Insights/InsightCard';

const winTitles = [
  { name: "Value Victory", description: "Bets where the user correctly identified undervalued odds and capitalized on them." },
  { name: "Research Rewards", description: "Wins that came from well-researched bets, showing the value of due diligence." },
  { name: "Trend Spotting", description: "Successful bets that capitalized on emerging trends in teams or players' performances." },
  { name: "Discipline Decision", description: "Wins that resulted from sticking to a predetermined strategy or bankroll management plan." },
  { name: "Timing Triumphs", description: "Wins from bets placed at the optimal time, taking advantage of line movements." },
  { name: "Parlay Perfection", description: "Successfully completed parlay bets, showcasing good multi-event analysis." }
];

const lossTitles = [
  { name: "Bad Beats", description: "Losing due to unexpected outcomes." },
  { name: "Longshots", description: "Losses from betting on longshots." },
  { name: "Chasing A Loss", description: "Losing by trying to recover previous losses." },
  { name: "Overconfidence", description: "Losses due to overestimating chances." },
  { name: "Parlay Pitfalls", description: "Failures with parlay bets." },
  { name: "Bankroll Management", description: "Losses that occurred when betting amounts were disproportionate to the user's overall bankroll." },
  { name: "Lack of Research", description: "Losing due to insufficient research." },
  { name: "Outpacing Unit Size", description: "Losing by betting too much on a single event." }
];

export default function BetAnalysis({ streak }) {
  const titles = streak === 'hot' ? winTitles : lossTitles;
  const analysisTitle = streak === 'hot' ? 'Win Analysis' : 'Loss Analysis';

  return (
    <View style={styles.container}>
      <View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>{analysisTitle}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: 'row', paddingVertical: 12, paddingLeft: 12 }}
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
    paddingTop: 8,
  },
});