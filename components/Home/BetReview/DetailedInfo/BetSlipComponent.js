import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView, TouchableOpacity } from '@/components/Themed';
import BetComponent from './BetComponent';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import { Feather } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function BetSlipComponent({ betSlip, details, confirm, openOptions }) {
    const { iconColor, mainGreen, grayBorder, backgroundColor, text } = useTheme();
    const { bookie } = useContext(UserContext);

    const confirmBetSlip = () => {
        confirm(betSlip);
    };

    return (
        <ClearView style={[styles.container]}>
            <ClearView style={styles.headerContainer}>
                <ClearView style={styles.dateOdds2Container}>
                    <Text style={styles.dateText}>{betSlip.date}</Text>
                    <Text style={styles.oddsText}>{betSlip.odds}</Text>
                </ClearView>
                <TouchableOpacity 
                    style={[styles.optionsButton, { backgroundColor: 'transparent' }]}
                    onPress={() => openOptions(betSlip, ['Edit', 'Delete'])}
                >
                    <Feather name="more-vertical" size={20} color={iconColor} />
                </TouchableOpacity>
            </ClearView>

            <ClearView style={styles.stakeContainer}>
                <View style={styles.stakeBox}>
                    <Text style={styles.stakeLabel}>Bet</Text>
                    <Text style={styles.stakeAmount}>${betSlip.betAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.stakeBox}>
                    <Text style={styles.stakeLabel}>To Win</Text>
                    <Text style={styles.stakeAmount}>${betSlip.winnings.toFixed(2)}</Text>
                </View>
            </ClearView>

            <View style={[
                styles.bookieContainer,
                betSlip.bookieName === bookie.name && { backgroundColor: grayBorder }
            ]}>
                <Image 
                    source={bookieImages[betSlip.bookieName]} 
                    style={styles.bookieImage} 
                />
                <Text style={styles.bookieText}>{betSlip.bookieName}</Text>
            </View>

            {betSlip.bets.map((betDetail, index) => (
                <BetComponent key={index} bet={betDetail} />
            ))}

            {details && (
                <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: mainGreen }]}
                    onPress={confirmBetSlip}
                >
                    <Text style={styles.buttonText}>Confirm Bet</Text>
                    <Feather name="arrow-right" size={18} color={backgroundColor} style={styles.buttonIcon} />
                </TouchableOpacity>
            )}
        </ClearView>      
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateOddsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 14,
        opacity: 0.7,
    },
    oddsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2ecc71',
    },
    optionsButton: {
        padding: 4,
    },
    stakeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    stakeBox: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    stakeLabel: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 4,
    },
    stakeAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    bookieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    bookieImage: {
        width: 24,
        height: 24,
        borderRadius: 4,
        marginRight: 8,
    },
    bookieText: {
        fontSize: 14,
        fontWeight: '500',
    },
    confirmButton: {
        width: '100%',
        borderRadius: 8,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    buttonIcon: {
        marginLeft: 8,
    },
});