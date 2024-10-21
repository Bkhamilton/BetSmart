import React from 'react';
import { ScrollView } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';
import InsightIntro from '@/components/Insights/InsightIntro/InsightIntro';
import BetAnalysis from '@/components/Insights/BetAnalysis/BetAnalysis';
import TopBet from '@/components/Insights/TopBet';
import InsightHeader from '@/components/Insights/InsightHeader';

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