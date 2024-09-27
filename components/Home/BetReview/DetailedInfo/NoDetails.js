import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import BetComponent from './BetComponent';
import { getDateFull } from '@/utils/dateFunctions';
import { bookieImages } from '@/constants/bookieConstants';

export default function NoDetails({ betSlip }) {
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
                <Image source={bookieImages[betSlip.bookieName]} style={styles.bookieImage} />
                <Text style={styles.betText}>{betSlip.bookieName}</Text>
            </View>
            {betSlip.bets.map((betDetail, index) => (
                <BetComponent key={index} bet={betDetail} />
            ))}
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
    spreadContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    bookieImage: {
        width: 20,
        height: 20,
        borderRadius: 2,
    }
});