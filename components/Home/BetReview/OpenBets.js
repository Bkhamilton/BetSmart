import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import DetailedInfo from '@/components/Home/BetReview/DetailedInfo/DetailedInfo';

export default function OpenBets({ betSlips, confirm, openOptions }) {

    const BigPictureInfo = ({ totalBets, betAmount, toWin }) => {
        return (
            <View style={styles.mainInfoContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 50, fontWeight: '700' }}>{totalBets}</Text>
                    <Text style={{ fontSize: 18, marginTop: 16, marginLeft: 4, marginBottom: 6, }}>bets</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, marginTop: 16, marginRight: 4 }}>Wager:</Text>
                        <Text style={{ fontSize: 24, fontWeight: '600' }}>${betAmount.toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, marginTop: 16, marginRight: 4 }}>To Win:</Text>
                        <Text style={{ fontSize: 24, fontWeight: '600' }}>${toWin.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
        );
    }

    const totalBets = betSlips.length;
    const totalBetAmount = betSlips.reduce((total, bet) => total + bet.betAmount, 0);
    const totalWinnings = betSlips.reduce((total, bet) => total + bet.winnings, 0);

    return (
        <View style={styles.container}>
            <ClearView style={{ paddingBottom: 8, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>Open Bets</Text>
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
        paddingBottom: 10,
        paddingTop: 4,
    },
    mainInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10
    },
});