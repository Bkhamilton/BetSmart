import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';
import { FontAwesome } from '@expo/vector-icons';

export default function ChooseBookie({ visible, close, selectBookie }) {

    const { mainGreen, accentGreen, mainBlue, accentBlue, iconColor } = useTheme();

    const { userBalance } = useContext(UserContext);
    const { bookies } = useContext(DBContext);

    const [balance, setBalance] = useState([]);

    useEffect(() => {
        const updatedBalance = userBalance.map((b) => {
            const bookie = bookies.find((bookie) => bookie.id === b.bookieId);
            return {
                bookie: bookie ? bookie.name : '',
                balance: b.balance,
            };
        });
        setBalance(updatedBalance);
    }, []);

    const getBalance = (bookieName) => {
        const bookie = balance.find((b) => b.bookie === bookieName);
        return bookie ? bookie.balance : 0;
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
                    <View style={{ marginTop: 110, backgroundColor: 'transparent' }}>
                        <TouchableOpacity 
                            onPress={() => {
                                const bookie = bookies.find((b) => b.name === 'DraftKings');
                                selectBookie(bookie);
                            }}
                            style={[styles.bookieButton, {backgroundColor: mainGreen, borderColor: mainGreen}]}
                        >
                            <Text style={styles.balanceText}>${getBalance('DraftKings').toFixed(2)}</Text>
                            <Image source={draftkings} style={{ width: 40, height: 40, borderRadius: 8 }} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {
                                const bookie = bookies.find((b) => b.name === 'FanDuel');
                                selectBookie(bookie);
                            }}
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