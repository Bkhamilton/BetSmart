import React, { useState, useEffect, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { ScrollView, ClearView, Text, View } from '@/components/Themed';
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
import PreferenceAdherence from '@/components/Insights/PreferenceAdherence/PreferenceAdherence';
import { getActionableInsights } from '@/utils/insights';
import { createTempTables } from '@/api/sqlite/createTables';

export default function InsightScreen() {

    const { streak, cycleStreak, topBet } = useHookInsightsPage();

    const { db } = useContext(DBContext);

    const { supabase, leagues } = useContext(SupabaseContext);

    const { user } = useContext(UserContext);

    const [actionableInsights, setActionableInsights] = useState([]);

    useEffect(() => {
        const loadInsights = async () => {
            if (user) {
                const insights = await getActionableInsights(db, user.id);
                console.log(JSON.stringify(insights, null, 2));
                setActionableInsights(insights);
            }
        };
        loadInsights();
    }, [user]);

    const refreshMarkets = async () => {
        const league = await getLeagueByName(supabase, 'NBA');

        await refreshBettingMarkets(supabase, league);
    }

    const refreshPlayers = async () => {
        await fetchAndUpdateRoster(db);
    }

    const tempFunction = async () => {

    }

    const renderInsightCard = (insight, index) => (
        <ClearView key={index} style={{ 
            margin: 8, 
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
        }}>
            <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                color: getTextColor(insight.type),
                textAlign: 'center',
            }}>
                {insight.message}
            </Text>
        </ClearView>
    );

    const getTextColor = (type) => {
        switch(type) {
            case 'success': return '#2e7d32';
            case 'warning': return '#ed6c02';
            case 'improvement': return '#d32f2f';
            case 'strategy': return '#1565c0';
            default: return '#333333';
        }
    };

    return (
        <>
            <InsightHeader
                onPress={tempFunction}
            />
            <ScrollView>
                <InsightIntro streak={streak} />
                {/* Insight #1 - Top Performer */}
                {actionableInsights.length > 0 && (
                    <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                        {renderInsightCard(actionableInsights[0], 0)}
                    </View>
                )}
                <BetAnalysis streak={streak} />
                <TopBet betSlip={topBet}/>
                {actionableInsights.length > 1 && (
                    <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                        {renderInsightCard(actionableInsights[1], 1)}
                    </View>
                )}
                {/* Top Props */}
                <BankManagement streak={streak} />
                <PreferenceAdherence />
                {actionableInsights.length > 2 && (
                    <ClearView style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                        {renderInsightCard(actionableInsights[2], 2)}
                    </ClearView>
                )}
                {/* Behavioral Analysis */}
                {/* Learning Opportunities */}
                {/* Future: Comparative Analysis */}
            </ScrollView>
        </>
    );
}