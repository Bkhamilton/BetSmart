import React, { useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
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

    const { db } = useContext(DBContext);

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