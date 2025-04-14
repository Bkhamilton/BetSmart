import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import StatCounter from './StatCounter';

export default function NoDetails({ betsWon, totalBets, amountBet, amountWon, marketTypes }) {
    const { text, greenText, redText } = useTheme();

    // Get top 2 market types plus TOTAL (if exists)
    const displayMarketTypes = [];
    const totalMarket = marketTypes.find(m => m.marketType === 'TOTAL');
    const otherMarkets = marketTypes.filter(m => m.marketType !== 'TOTAL');
    
    // Add up to 2 non-TOTAL markets
    displayMarketTypes.push(...otherMarkets.slice(0, 2));
    // Add TOTAL if it exists (will replace one if we already have 2)
    if (totalMarket) {
        displayMarketTypes.splice(2, 0, totalMarket).slice(0, 3);
    }

    return (
        <ClearView style={styles.container}>
            <ClearView style={styles.headerContainer}>
                <Text style={styles.smallText}>WEEKLY REVIEW</Text>
                <Text style={[styles.smallText, { color: greenText }]}>SHOW DETAILS</Text>
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
                                <Text style={[styles.amountValue, { color: redText }]}>{`$${amountBet.toFixed(2)}`}</Text>
                            </ClearView>
                            
                            <ClearView style={styles.amountGroup}>
                                <Text style={styles.amountLabel}>WON</Text>
                                <Text style={[styles.amountValue, { color: greenText }]}>{`$${amountWon.toFixed(2)}`}</Text>
                            </ClearView>
                        </ClearView>
                    </ClearView>

                    <Text style={styles.sectionLabel}>BY MARKET TYPE</Text>
                    <View style={styles.divider} />

                    <ClearView style={styles.statsGrid}>
                        {displayMarketTypes.map(stat => (
                            <StatCounter 
                                key={stat.marketType} 
                                title={stat.marketType} 
                                won={stat.won} 
                                total={stat.total} 
                                compact={true}
                            />
                        ))}
                        {marketTypes.length > 3 && (
                            <Text style={styles.moreText}>+{marketTypes.length - 3} more</Text>
                        )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    moreText: {
        fontSize: 12,
        opacity: 0.6,
        marginLeft: 8,
    },
    smallText: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});