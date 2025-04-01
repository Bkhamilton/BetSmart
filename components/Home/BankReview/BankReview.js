import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import { bookieImages } from '@/constants/bookieConstants';
import useUserBalDataState from '@/hooks/useUserBalDataState';
import { UserContext } from '@/contexts/UserContext';

export default function BankReview({ transactions, addBookie }) {
    const { signedIn, user } = useContext(UserContext);
    const { grayBackground, grayBorder, iconColor, mainGreen, redText } = useTheme();
    const { handleTransactions } = useRouting();
    const { monthlyDeposits, monthlyWithdrawals } = useUserBalDataState();

    const difference = monthlyDeposits - monthlyWithdrawals;
    const differenceColor = difference >= 0 ? mainGreen : redText;

    const onAddBookie = () => {
        if (!signedIn) {
            alert('You must be signed in to add a bookie.');
            return;
        }
        addBookie();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Bankroll</Text>
            </View>
            
            <View style={[styles.card, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                {/* Top Row - Key Metrics */}
                <ClearView style={styles.metricsRow}>
                    {/* Deposits */}
                    <ClearView style={styles.metricContainer}>
                        <Text style={styles.metricLabel}>Deposits</Text>
                        <Text style={styles.metricValue}>${monthlyDeposits.toFixed(2)}</Text>
                    </ClearView>
                    
                    {/* Withdrawals */}
                    <ClearView style={styles.metricContainer}>
                        <Text style={styles.metricLabel}>Withdrawals</Text>
                        <Text style={styles.metricValue}>${monthlyWithdrawals.toFixed(2)}</Text>
                    </ClearView>
                </ClearView>
                
                {/* Bottom Row - Secondary Info */}
                <ClearView style={styles.secondaryRow}>
                    {/* Top Bookie */}
                    <ClearView style={styles.bookieContainer}>
                        <Text style={styles.secondaryLabel}>Top Bookie</Text>
                        <ClearView style={styles.bookieInfo}>
                            <Image 
                                source={bookieImages['DraftKings']} 
                                style={styles.bookieImage} 
                            />
                            <Text style={styles.bookieProfit}>+$50</Text>
                        </ClearView>
                    </ClearView>
                    
                    {/* Difference */}
                    <ClearView style={styles.differenceContainer}>
                        <Text style={styles.secondaryLabel}>Net</Text>
                        <Text style={[styles.differenceValue, { color: differenceColor }]}>
                            ${Math.abs(difference).toFixed(2)}
                        </Text>
                    </ClearView>
                </ClearView>
                
                {/* Timeframe */}
                <Text style={styles.timeframeText}>Last 30 Days</Text>
                
                {/* Buttons */}
                <ClearView style={styles.buttonsRow}>
                    <TouchableOpacity 
                        style={[styles.button, { borderColor: grayBorder }]}
                        onPress={handleTransactions}
                    >
                        <Text style={styles.buttonText}>Transactions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, { borderColor: grayBorder }]}
                        onPress={onAddBookie}
                    >
                        <Text style={styles.buttonText}>Add Bookie</Text>
                    </TouchableOpacity>
                </ClearView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    header: {
        paddingBottom: 12,
        paddingLeft: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    metricContainer: {
        flex: 1,
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.8,
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 22,
        fontWeight: '700',
    },
    secondaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    bookieContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    secondaryLabel: {
        fontSize: 12,
        fontWeight: '500',
        opacity: 0.7,
        marginBottom: 4,
    },
    bookieInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookieImage: {
        width: 32,
        height: 32,
        borderRadius: 4,
        marginRight: 8,
    },
    bookieProfit: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2ecc71',
    },
    differenceContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    differenceValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    timeframeText: {
        fontSize: 10,
        opacity: 0.6,
        textAlign: 'center',
        marginBottom: 12,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: '48%',
        borderRadius: 8,
        paddingVertical: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});