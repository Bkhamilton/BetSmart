import React, { useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { ScrollView, ClearView, Text } from '@/components/Themed';
import InsightHeader from '@/components/Insights/InsightHeader';
import InsightIntro from '@/components/Insights/InsightIntro/InsightIntro';
import BetAnalysis from '@/components/Insights/BetAnalysis/BetAnalysis';
import BankManagement from '@/components/Insights/BankManagement/BankManagement';
import TopBet from '@/components/Insights/TopBet/TopBet';
import useHookInsightsPage from '@/hooks/useHookInsights';
import { SupabaseContext } from '@/contexts/SupabaseContext';

import { getLeagueByName } from '@/api/supabase/Leagues';
import { refreshBettingMarkets } from '@/api/supabase/markets';
import { fetchAndUpdateRoster } from '@/api/sportsdb/players';

export default function InsightScreen() {

    const { streak, cycleStreak, topBet } = useHookInsightsPage();

    const refreshMarkets = async () => {
        const league = await getLeagueByName(supabase, 'NBA');

        await refreshBettingMarkets(supabase, league);
    }

    const refreshPlayers = async () => {
        await fetchAndUpdateRoster(db);
    }

    const tempFunction = async () => {

    }

    const { db } = useContext(DBContext);

    const { supabase, leagues } = useContext(SupabaseContext);

    const { user } = useContext(UserContext);

    return (
        <>
            <InsightHeader
                onPress={tempFunction}
            />
            <ScrollView>
                <InsightIntro streak={streak} />
                <BetAnalysis streak={streak} />
                <TopBet betSlip={topBet}/>
                {/* Top Props */}
                <BankManagement streak={streak} />
                <ClearView style={{ padding: 20 }}>
                    <Text style={{ fontSize: 22, fontWeight: '600', textAlign: 'center' }}>Insight Data Coming Soon...</Text>
                </ClearView>
            </ScrollView>
        </>
    );
}