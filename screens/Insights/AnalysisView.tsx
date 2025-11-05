import React from 'react';
import { ScrollView, ClearView, Text, View } from '@/components/Themed';
import InsightIntro from '@/components/Insights/InsightIntro/InsightIntro';
import BetAnalysis from '@/components/Insights/BetAnalysis/BetAnalysis';
import BankManagement from '@/components/Insights/BankManagement/BankManagement';
import TopBet from '@/components/Insights/TopBet/TopBet';
import PreferenceAdherence from '@/components/Insights/PreferenceAdherence/PreferenceAdherence';

interface AnalysisViewProps {
    streak: any;
    topBet: any;
    actionableInsights: { message: string; priority: number; }[];
}

export default function AnalysisView({ streak, topBet, actionableInsights }: AnalysisViewProps) {
    
    const renderInsightCard = (insight : any, index : number) => (
        <ClearView key={index} style={{ 
            margin: 8,
        }}>
            <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                textAlign: 'center',
            }}>
                {insight.message}
            </Text>
        </ClearView>
    );

    return (
        <ScrollView>
            <InsightIntro streak={streak} />
            <BetAnalysis streak={streak} />
            {/* Insight #1 - Top Performer */}
            {actionableInsights.length > 0 && (
                <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                    {renderInsightCard(actionableInsights[0], 0)}
                </View>
            )}
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
    );
}
