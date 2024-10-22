import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import useHookInsightsPage from '@/hooks/useHookInsights';
import HotStreak from './HotStreak';
import ColdStreak from './ColdStreak';

export default function InsightIntro({ streak }) {

    const { betsPlaced, betsWon, profit } = useHookInsightsPage();

    return (
        <View style={{ marginTop: 8 }}>
            {streak === 'hot' ? <HotStreak /> : streak === 'cold' ? <ColdStreak /> : null}
            <View style={styles.container}>
                {/* Bets Placed, Bets Won, Money Won */}
                <Text style={styles.infoText}>{betsPlaced} Bet{betsPlaced > 1 ? 's' : ''} Placed</Text>
                <Text style={styles.infoText}>{betsWon} Bet{betsWon > 1 ? 's' : ''} Won</Text>
                <Text style={styles.infoText}>Profit: {profit > 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}</Text>
            </View>
            <View style={styles.subHeaderContainer}>
                <Text style={{ fontSize: 10 }}>Last 7 Days</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        paddingHorizontal: '15%',
        opacity: 0.7,
    },
    subHeaderContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        opacity: 0.5, 
        marginTop: 2,
    },
    infoText: {
        fontSize: 12,
    }
});