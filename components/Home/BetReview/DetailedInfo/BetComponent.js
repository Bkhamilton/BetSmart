import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import LegComponent from './LegComponent';
import useTheme from '@/hooks/useTheme';

export default function BetComponent({ bet }) {
    const { grayBorder } = useTheme();

    return (
        <View style={[styles.container, { borderColor: grayBorder }]}>
            <View style={styles.header}>
                <Text style={styles.leagueText}>{bet.league}</Text>
                <Text style={styles.oddsText}>{bet.odds}</Text>
            </View>
            <Text style={styles.dateText}>{bet.date}</Text>
            <Text style={styles.matchupText}>{bet.homeTeamAbv} vs {bet.awayTeamAbv}</Text>
            {bet.legs.map((leg, index) => (
                <LegComponent key={index} leg={leg} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    leagueText: {
        fontSize: 14,
        fontWeight: '600',
    },
    oddsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2ecc71',
    },
    dateText: {
        fontSize: 12,
        opacity: 0.7,
        marginBottom: 8,
    },
    matchupText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
});