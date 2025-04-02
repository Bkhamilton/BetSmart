import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView, TouchableOpacity } from '@/components/Themed';
import BetComponent from '@/components/Home/BetReview/DetailedInfo/BetComponent';
import CompactBet from './CompactBet';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import { Feather } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function CompactBetSlip({ betSlip }) {
    const { iconColor, grayBorder } = useTheme();
    const { bookie } = useContext(UserContext);

    return (
        <ClearView style={styles.container}>
            {/* Top Row - Date, Odds, Bookie, Options */}
            <ClearView style={styles.headerRow}>
                <Text style={styles.dateText}>{betSlip.date}</Text>
                <Text style={styles.oddsText}>{betSlip.odds}</Text>
                
                <ClearView style={styles.bookieContainer}>
                    <Image 
                        source={bookieImages[betSlip.bookieName]} 
                        style={styles.bookieImage} 
                    />
                </ClearView>
            </ClearView>

            {/* Middle Row - Bet Amounts */}
            <ClearView style={styles.amountsRow}>
                <View style={styles.amountPill}>
                    <Text style={styles.amountLabel}>Bet</Text>
                    <Text style={styles.amountValue}>${betSlip.betAmount? betSlip.betAmount.toFixed(2) : ''}</Text>
                </View>
                
                <View style={styles.amountPill}>
                    <Text style={styles.amountLabel}>Win</Text>
                    <Text style={styles.amountValue}>${betSlip.winnings? betSlip.winnings.toFixed(2) : ''}</Text>
                </View>
            </ClearView>

            {/* Bets List - Compact Version */}
            <ClearView style={styles.betsContainer}>
                {betSlip.bets?.map((betDetail, index) => (
                    <CompactBet 
                        key={index} 
                        bet={betDetail}
                    />
                ))}
            </ClearView>
        </ClearView>      
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 12,
        opacity: 0.7,
        flex: 1,
    },
    oddsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2ecc71',
        marginHorizontal: 8,
    },
    bookieContainer: {
        width: 24,
        height: 24,
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookieImage: {
        width: 20,
        height: 20,
        borderRadius: 3,
    },
    optionsButton: {
        padding: 2,
    },
    amountsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    amountPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    amountLabel: {
        fontSize: 12,
        opacity: 0.7,
        marginRight: 6,
    },
    amountValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    betsContainer: {
        marginTop: 4,
    },
});