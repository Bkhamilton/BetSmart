import React from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { ScrollView } from '@/components/Themed';
import InsightHeader from '@/components/Insights/InsightHeader';
import InsightIntro from '@/components/Insights/InsightIntro/InsightIntro';
import BetAnalysis from '@/components/Insights/BetAnalysis/BetAnalysis';
import TopBet from '@/components/Insights/TopBet';
import useHookInsightsPage from '@/hooks/useHookInsights';

export default function InsightScreen() {

  const { streak, cycleStreak } = useHookInsightsPage();

  const tempFunction = () => {

  }

  const db = useSQLiteContext();

  return (
    <>
      <InsightHeader
        onPress={cycleStreak}
      />
      <ScrollView>
        <InsightIntro streak={streak}/>
        <BetAnalysis streak={streak}/>
        <TopBet />
        {/* BankRoll Management */}
        {/* Top Props / Top Bets */}
      </ScrollView>
    </>
  );
}