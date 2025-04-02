import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, View, ScrollView, ClearView } from '@/components/Themed';
import InsightCard from '@/components/Insights/InsightCard';
import useTheme from '@/hooks/useTheme';

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

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_SPACING = 16;

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
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + CARD_SPACING}
                    snapToAlignment="start"
                    contentContainerStyle={styles.scrollContainer}
                    decelerationRate="fast"
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
    scrollContainer: {
        paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
        paddingVertical: 8,
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginRight: CARD_SPACING,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '400',
        maxWidth: CARD_WIDTH - CARD_SPACING, // Adjusted for padding
    },
});