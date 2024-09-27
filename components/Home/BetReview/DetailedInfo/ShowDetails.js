import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import BetComponent from './BetComponent';
import { getDateFull } from '@/utils/dateFunctions';
import { bookieImages } from '@/constants/bookieConstants';

export default function ShowDetails({ betSlip, confirm }) {

    const { iconColor, grayBackground, grayBorder, mainGreen } = useTheme();

    const confirmBetSlip = () => {
        confirm(betSlip);
    };

    return (
        <ClearView>
            <View style={styles.spreadContainer}>
                <Text style={styles.betText}>{getDateFull(betSlip.date)}</Text>
                <Text style={styles.betText}>{betSlip.odds}</Text>
            </View>
            <View style={styles.spreadContainer}>
                <ClearView>
                    <Text style={styles.betText}>Bet</Text>
                    <Text style={styles.betText}>${betSlip.betAmount.toFixed(2)}</Text>
                </ClearView>
                <ClearView>
                    <Text style={styles.betText}>To Win</Text>
                    <Text style={styles.betText}>${betSlip.winnings.toFixed(2)}</Text>
                </ClearView>
            </View>
            <View style={styles.spreadContainer}>
                <Image source={bookieImages[betSlip.bookieName]} style={{ width: 20, height: 20, borderRadius: 2 }} />
                <Text style={styles.betText}>{betSlip.bookieName}</Text>
            </View>
            {betSlip.bets.map((betDetail, index) => (
                <BetComponent key={index} bet={betDetail} />
            ))}
            <TouchableOpacity 
                style={[styles.confirmButton, {backgroundColor: mainGreen}]}
                onPress={confirmBetSlip}
            >
                <Text style={{ color: iconColor }}>Confirm Bet</Text>
            </TouchableOpacity>
        </ClearView>
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
    confirmButton: {
        padding: 8, 
        borderRadius: 8, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 10,
    },
    spreadContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    }
});