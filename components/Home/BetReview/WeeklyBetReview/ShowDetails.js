import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import StatCounter from './StatCounter';

export default function ShowDetails({ betSlips, betsWon, totalBets, marketTypes }) {
    const { text, greenText, redText } = useTheme();

    return (
        <ClearView style={styles.container}>
            <ClearView style={styles.headerContainer}>
                <Text style={styles.smallText}>WEEKLY REVIEW</Text>
                <Text style={[styles.smallText, { color: greenText }]}>HIDE DETAILS</Text>
            </ClearView>
            <View style={styles.divider} />

            {totalBets === 0 ? (
                <ClearView style={styles.emptyState}>
                    <Text style={styles.emptyText}>No bets to review</Text>
                </ClearView>
            ) : (
                <>
                    <ClearView style={styles.summaryContainer}>
                        <ClearView style={styles.statContainer}>
                            <Text style={styles.largeStat}>{`${betsWon}/${totalBets}`}</Text>
                            <Text style={styles.statLabel}>BETS</Text>
                        </ClearView>
                        
                        <ClearView style={styles.amountContainer}>
                            <ClearView style={styles.amountGroup}>
                                <Text style={styles.amountLabel}>BET</Text>
                                {betSlips.map(bet => (
                                    <Text 
                                        key={bet.id} 
                                        style={[
                                            styles.betDetailValue, 
                                            { 
                                                color: bet.result === '1' ? text : redText,
                                                fontWeight: bet.result === '1' ? '500' : '700'
                                            }
                                        ]}
                                    >
                                        {`$${bet.betAmount.toFixed(2)}`}
                                    </Text>
                                ))}
                            </ClearView>
                            
                            <ClearView style={styles.amountGroup}>
                                <Text style={styles.amountLabel}>WON</Text>
                                {betSlips.map(bet => (
                                    <Text 
                                        key={bet.id} 
                                        style={[
                                            styles.betDetailValue, 
                                            { 
                                                color: bet.result === '1' ? greenText : text,
                                                fontWeight: bet.result === '1' ? '700' : '500'
                                            }
                                        ]}
                                    >
                                        {`$${bet.winnings.toFixed(2)}`}
                                    </Text>
                                ))}
                            </ClearView>
                        </ClearView>
                    </ClearView>

                    <Text style={styles.sectionLabel}>BY MARKET TYPE</Text>
                    <View style={styles.divider} />

                    <ClearView style={styles.statsGrid}>
                        {marketTypes.map((stat, index) => (
                            <StatCounter 
                                key={index}
                                title={stat.marketType}
                                won={stat.won}
                                total={stat.total}
                            />
                        ))}
                    </ClearView>
                </>
            )}
        </ClearView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emptyState: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        opacity: 0.5,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingTop: 8,
    },
    statContainer: {
        alignItems: 'center',
        flex: 0.3,
    },
    amountContainer: {
        flex: 0.7,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amountGroup: {
        alignItems: 'center',
    },
    largeStat: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
    amountLabel: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
        marginBottom: 8,
    },
    amountValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    betDetailValue: {
        fontSize: 16,
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(83, 156, 216, 0.1)',
        marginVertical: 4,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '500',
        opacity: 0.4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    smallText: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});