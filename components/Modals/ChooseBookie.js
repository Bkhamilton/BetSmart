import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import useTheme from '@/hooks/useTheme';

export default function ChooseBookie({ visible, close, selectBookie }) {

    const { mainGreen, accentGreen, mainBlue, accentBlue, iconColor, grayBackground } = useTheme();

    const { userBalance } = useContext(UserContext);

    const getBalance = (bookieName) => {
        const bookie = userBalance.find((b) => b.bookieName === bookieName);
        return bookie ? bookie.balance : 0;
    };

    const bookieColors = {
        'DraftKings': mainGreen,
        'FanDuel': mainBlue,
        'BetMGM': grayBackground,
    };

    const bookieBorderColors = {
        'DraftKings': accentGreen,
        'FanDuel': accentBlue,
        'BetMGM': iconColor,
    };

    const BookieButton = ({ balance }) => {
        return (
            <TouchableOpacity 
                style={[styles.bookieButton, {backgroundColor: bookieColors[balance.bookieName], borderColor: bookieBorderColors[balance.bookieName]}]}
                onPress={() => selectBookie(balance)}            
            >
                <Text style={styles.balanceText}>${getBalance(balance.bookieName).toFixed(2)}</Text>
                <Image source={bookieImages[balance.bookieName]} style={{ width: 40, height: 40, borderRadius: 8 }} />
            </TouchableOpacity>
        );
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback 
                onPress={close}
            >
                <View style={styles.container}>
                    <View style={{ marginTop: 110, backgroundColor: 'transparent' }}>
                        { 
                            userBalance.map((b) => {
                                return <BookieButton key={b.bookieId} balance={b} />
                            })
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookieButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    closeButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    balanceText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 80,
    },
});