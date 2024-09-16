import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import BetComponent from './BetComponent';
import { getDateFull } from '@/utils/dateFunctions';

export default function NoDetails({ betSlip }) {

    const { iconColor, grayBackground, grayBorder, mainGreen } = useTheme();

    return (
        <View style={{ backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                <Text style={styles.betText}>{getDateFull(betSlip.date)}</Text>
                <Text style={styles.betText}>{betSlip.odds}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
                <View style={{ backgroundColor: 'transparent' }}>
                    <Text style={styles.betText}>Bet</Text>
                    <Text style={styles.betText}>${betSlip.betAmount.toFixed(2)}</Text>
                </View>
                <View style={{ backgroundColor: 'transparent' }}>
                    <Text style={styles.betText}>To Win</Text>
                    <Text style={styles.betText}>${betSlip.winnings.toFixed(2)}</Text>
                </View>
            </View>
            {betSlip.bets.map((betDetail, index) => (
                <BetComponent key={index} bet={betDetail} />
            ))}
        </View>      
    );
}

const styles = StyleSheet.create({
    betContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
    },
    betText: {
        fontSize: 16,
        fontWeight: '600',
    },
});