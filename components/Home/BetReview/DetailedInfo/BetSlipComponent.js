import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView, TouchableOpacity } from '@/components/Themed';
import BetComponent from './BetComponent';
import { bookieImages } from '@/constants/bookieConstants';
import { Feather } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function BetSlipComponent({ betSlip, details, confirm, openOptions }) {

    const { iconColor, mainGreen } = useTheme();

    const confirmBetSlip = () => {
        confirm(betSlip);
    };

    return (
        <ClearView>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{betSlip.date}</Text>
            </View>
            <View style={styles.spreadContainer}>
                <Text style={styles.betText}>{betSlip.odds}</Text>
                <TouchableOpacity 
                    style={{ backgroundColor: 'transparent' }}
                    onPress={() => openOptions(betSlip, ['Edit', 'Delete'])}
                >
                    <Feather name="more-vertical" size={20} color={iconColor} />
                </TouchableOpacity>
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
            {
                details && (
                    <TouchableOpacity 
                        style={[styles.confirmButton, {backgroundColor: mainGreen}]}
                        onPress={confirmBetSlip}
                    >
                        <Text>Confirm Bet</Text>
                    </TouchableOpacity>
                )
            }
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
    dateText: {
        fontSize: 12,
        fontWeight: '400',
        opacity: 0.6,
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
    },
    bookieImage: {
        width: 20,
        height: 20,
        borderRadius: 2,
    },
    dateContainer: {
        padding: 4,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
});