import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { View } from '@/components/Themed';
import InsightHeader from '@/components/Insights/InsightHeader';
import ViewToggle from '@/components/Insights/ViewToggle';
import AnalysisView from './AnalysisView';
import TipsScreen from './TipsScreen';
import useHookInsightsPage from '@/hooks/useHookInsights';
import { SupabaseContext } from '@/contexts/SupabaseContext';
import { getLeagueByName } from '@/api/supabase/Leagues';
import { refreshBettingMarkets } from '@/api/supabase/markets';
import { fetchAndUpdateRoster } from '@/api/sportsdb/players';
import { getActionableInsights } from '@/utils/insights';
import { createTempTables } from '@/api/sqlite/createTables';
import useTheme from '@/hooks/useTheme';

export default function InsightScreen() {

    const { streak, cycleStreak, topBet } = useHookInsightsPage();

    const { db } = useContext(DBContext);

    const { supabase, leagues } = useContext(SupabaseContext);

    const { user } = useContext(UserContext);

    const { mainGreen } = useTheme();

    const [actionableInsights, setActionableInsights] = useState<{ message: string; priority: number; }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<'analysis' | 'tips'>('analysis');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            await createTempTables(db);
            setLoading(false);
        };
        initialize();
    }, []);

    useEffect(() => {
        const loadInsights = async () => {
            if (user) {
                const insights = await getActionableInsights(db, user.id);
                setActionableInsights(insights);
            }
        };
        loadInsights();
    }, [user, loading]);

    const refreshMarkets = async () => {
        const league = await getLeagueByName(supabase, 'NBA');

        await refreshBettingMarkets(supabase, league);
    }

    const refreshPlayers = async () => {
        await fetchAndUpdateRoster(db);
    }

    const tempFunction = async () => {
        
    }

    const handleViewChange = async (view: 'analysis' | 'tips') => {
        if (view === selectedView) return;
        
        setIsTransitioning(true);
        // Simulate loading delay for smooth transition
        setTimeout(() => {
            setSelectedView(view);
            setIsTransitioning(false);
        }, 300);
    };

    const renderContent = () => {
        if (isTransitioning) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={mainGreen} />
                </View>
            );
        }

        if (selectedView === 'analysis') {
            return (
                <AnalysisView 
                    streak={streak}
                    topBet={topBet}
                    actionableInsights={actionableInsights}
                />
            );
        }

        return <TipsScreen />;
    };

    return (
        <>
            <InsightHeader
                onPress={tempFunction}
            />
            <ViewToggle 
                selectedView={selectedView}
                onViewChange={handleViewChange}
            />
            {renderContent()}
        </>
    );
}