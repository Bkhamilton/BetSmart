import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import StatCounter from './StatCounter';

export default function NoDetails({ betsWon, totalBets, amountBet, amountWon }) {

    const { text, greenText, redText } = useTheme();

    return (
        <>
            <ClearView style={styles.headerContainer}>
                <Text style={styles.smallText}>Main Info</Text>
                <ClearView style={{ width: 58, alignItems: 'flex-start' }}>
                    <Text style={[styles.smallText, { color: greenText }]}>Show More</Text>
                </ClearView>
            </ClearView>
            <ClearView style={[styles.spreadContainer, { paddingHorizontal: 12 }]}>
                <ClearView style={[styles.infoContainer, { flex: 0.3 }]}>
                    <Text style={{ fontSize: 38, fontWeight: '700' }}>{`${betsWon}/${totalBets}`}</Text>
                    <Text style={[styles.mediumText, { marginBottom: 6 }]}> bets</Text>
                </ClearView>
                <ClearView style={[styles.infoContainer, { marginBottom: 6, flex: 0.35, marginLeft: 16 }]}>
                    <Text style={styles.mediumText}>Bet:</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: redText, marginBottom: -2 }}>{`$${amountBet.toFixed(2)}`}</Text>
                </ClearView>
                <ClearView style={[styles.infoContainer, { marginBottom: 6, flex: 0.35, marginLeft: 16  }]}>
                    <Text style={styles.mediumText}>Won:</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: greenText, marginBottom: -2 }}>{`$${amountWon.toFixed(2)}`}</Text>
                </ClearView>
            </ClearView>
            <ClearView style={{ paddingHorizontal: 4, paddingTop: 8, opacity: 0.4 }}>
                <Text style={styles.smallText}>Details</Text>
            </ClearView>
            <View style={styles.divider} />
            <ClearView style={styles.spreadContainer}>
                <StatCounter title="SPREAD" won={3} total={3} />
                <StatCounter title="ML" won={2} total={3} />
                <StatCounter title="PLAYER" won={8} total={12} />
                <StatCounter title="TOTAL" won={16} total={26} />
            </ClearView>  
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        opacity: 0.4, 
        paddingHorizontal: 4, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingBottom: 2,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    divider: {
        height: 1,
        marginHorizontal: 4,
        borderTopWidth: 1,
        opacity: 0.2,
        marginBottom: 6,
    },
    spreadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallText: {
        fontSize: 10,
        fontWeight: '500'
    },
    mediumText: {
        fontSize: 16,
        fontWeight: '600'
    },
});