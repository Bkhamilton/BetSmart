import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import CompactBetSlip from './CompactBetSlip';
import useTheme from '@/hooks/useTheme';

export default function TopBet({ betSlip }) {
    const { grayBackground, grayBorder, textMuted } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Top Bet</Text>
            </View>
            
            {betSlip ? (
                <View style={[styles.betSlipContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                    <CompactBetSlip betSlip={betSlip} />
                </View>
            ) : (
                <View style={[styles.emptyState, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                    <Text style={[styles.emptyText, { color: textMuted }]}>
                        Your most profitable bet of the week will appear here
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 16,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
    },
    betSlipContainer: {
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
    },
    emptyState: {
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});