import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import DetailedInfo from '@/components/Home/BetReview/DetailedInfo/DetailedInfo';
import useTheme from '@/hooks/useTheme';

export default function OpenBets({ betSlips, confirm, openOptions }) {
    const { mainGreen, text, grayBackground, grayBorder } = useTheme();

    const BigPictureInfo = ({ totalBets, betAmount, toWin }) => {
        return (
            <ClearView style={[styles.mainInfoContainer, { borderColor: grayBorder }]}>
                <ClearView style={styles.countContainer}>
                    <Text style={styles.betCount}>{totalBets}</Text>
                    <Text style={styles.betLabel}>Open Bet{totalBets !== 1 ? 's' : ''}</Text>
                </ClearView>
                
                <ClearView style={styles.amountsContainer}>
                    <ClearView style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Total Wager:</Text>
                        <Text style={styles.amountValue}>${betAmount.toFixed(2)}</Text>
                    </ClearView>
                    <ClearView style={styles.amountRow}>
                        <Text style={styles.amountLabel}>To Win:</Text>
                        <Text style={[styles.amountValue, { color: mainGreen }]}>${toWin.toFixed(2)}</Text>
                    </ClearView>
                </ClearView>
            </ClearView>
        );
    }

    const totalBets = betSlips.length;
    const totalBetAmount = betSlips.reduce((total, bet) => total + bet.betAmount, 0);
    const totalWinnings = betSlips.reduce((total, bet) => total + bet.winnings, 0);

    return (
        <View style={styles.container}>
            <ClearView style={styles.header}>
                <Text style={styles.headerText}>Open Bets</Text>
            </ClearView>
            <BigPictureInfo 
                totalBets={totalBets} 
                betAmount={totalBetAmount} 
                toWin={totalWinnings} 
            />
            <DetailedInfo 
                betSlips={betSlips} 
                confirm={confirm} 
                openOptions={openOptions}
            />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        paddingBottom: 16,
        paddingTop: 8,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    mainInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 8,
        marginHorizontal: 10,
        borderBottomWidth: 1,
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    betCount: {
        fontSize: 42,
        fontWeight: '700',
        lineHeight: 42,
    },
    betLabel: {
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.8,
        marginLeft: 8,
        marginTop: 16,
    },
    amountsContainer: {
        alignItems: 'flex-end',
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 6,
    },
    amountLabel: {
        fontSize: 14,
        opacity: 0.8,
        marginRight: 8,
    },
    amountValue: {
        fontSize: 18,
        fontWeight: '600',
    },
});