import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';
import ProgressBar from '../../Helpers/ProgressBar';

export default function BankrollManagement() {
    
    const { userBalance } = useContext(UserContext);
    const { grayBorder, grayBackground, bookieColors } = useTheme();

    const totalBankroll = 1000;
    const dailyLimit = 100;
    const totalAllocated = userBalance.reduce((total, balance) => total + balance.balance, 0);
    const unallocated = totalBankroll - totalAllocated;

    const segments = userBalance.map((balance) => {
        return {
            ...balance,
            percentage: (balance.balance / totalBankroll) * 100,
            color: bookieColors[balance.bookieName],
        };
    });

    const unallocatedPercentage = (unallocated / totalBankroll) * 100;

    return (
        <>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Bankroll Management</Text>
            </View>
            <View style={[styles.mainContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                {/* Add bankroll management components here */}
                <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 18, }}>Total Bankroll</Text>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>${totalBankroll}</Text>
                </ClearView>
                <ProgressBar
                    segments={segments}
                    unallocatedPercentage={unallocatedPercentage}
                />
                <ClearView style={styles.legendContainer}>
                    {
                        segments.map((segment, index) => (
                            <ClearView key={index} style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
                                <Text style={styles.legendText}>{segment.bookieName}</Text>
                                <Text style={[styles.legendText, { marginLeft: 4, opacity: 0.6, }]}>{segment.percentage.toFixed(1)}%</Text>
                            </ClearView>
                        ))
                    }
                </ClearView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        paddingVertical: 12,
        paddingHorizontal: 12, 
        marginHorizontal: 12, 
        marginVertical: 12, 
        borderWidth: 1, 
        borderRadius: 8,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
    },
});