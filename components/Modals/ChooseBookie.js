import React from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';
import { FontAwesome } from '@expo/vector-icons';

export default function ChooseBookie({ userBalance, visible, close, selectBookie }) {

    const { mainGreen, accentGreen, mainBlue, accentBlue, iconColor } = useTheme();

    const getBalance = (bookieName) => {
        const bookie = userBalance.find((b) => b.Bookie === bookieName);
        return bookie ? bookie.Balance : 0;
    };

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
                    <View style={{ marginTop: 110, }}>
                        <TouchableOpacity 
                            onPress={() => selectBookie('DraftKings')}
                            style={[styles.bookieButton, {backgroundColor: mainGreen, borderColor: mainGreen}]}
                        >
                            <Text style={styles.balanceText}>${getBalance('DraftKings').toFixed(2)}</Text>
                            <Image source={draftkings} style={{ width: 40, height: 40, borderRadius: 8 }} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => selectBookie('FanDuel')}
                            style={[styles.bookieButton, {backgroundColor: mainBlue, borderColor: mainBlue}]}
                        >
                            <Text style={styles.balanceText}>${getBalance('FanDuel').toFixed(2)}</Text>
                            <Image source={fanduel} style={{ width: 40, height: 40, borderRadius: 8 }} />
                        </TouchableOpacity>
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