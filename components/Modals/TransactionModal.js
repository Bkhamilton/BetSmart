import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { TouchableOpacity, Text, View, Modal, TextInput } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import useTheme from '@/hooks/useTheme';

export default function TransactionModal({ visible, close, title, bookie, onConfirm  }) {

    const { userBalance } = useContext(UserContext);

    const [amount, setAmount] = useState('');

    const { grayBorder, accentGreen } = useTheme();

    var selectedBookie = userBalance?.find(item => item.bookieId === bookie.id);
    if (!selectedBookie) {
        const totalBalance = userBalance ? userBalance.reduce((sum, item) => sum + item.balance, 0) : 0;
        selectedBookie = { bookie: 'Total', balance: totalBalance };
    }
    
    const initialAmount = selectedBookie.balance;

    const handleClose = () => {
        setAmount('');
        close();
    };

    const handleConfirm = () => {
        if (amount === '') {
        alert('Please enter an amount');
        return;
        }
    
        // Convert amount to a number
        const numericAmount = Number(amount);
        const numericInitialAmount = Number(initialAmount);
    
        let updatedBalance;
        if (title === 'Withdraw') {
        if (numericAmount > initialAmount) {
            alert('You cannot withdraw more than your current balance');
            return;
        }
        updatedBalance = numericInitialAmount - numericAmount;
        } else if (title === 'Deposit') {
        updatedBalance = numericInitialAmount + numericAmount;
        }

        updatedBalance = Number(updatedBalance.toFixed(2));
    
        onConfirm(bookie.id, title, numericInitialAmount, numericAmount, updatedBalance);
        setAmount('');
    };

    const Title = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity 
                    onPress={handleClose}
                >
                    <FontAwesome name='close' size={40} color={'red'}/>
                </TouchableOpacity>
            </View>
        );
    }

    const Bookie = () => {
        return (
            <View style={[styles.infoBox, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={styles.inputBox}>
                        <Image source={bookieImages[bookie.name]} style={{ width: 24, height: 24, borderRadius: 4 }} />
                    </View>
                    <Text style={[styles.BoxTitle, { marginLeft: 4 }]}>{bookie.name}</Text>
                </View>
                <View style={styles.inputBox}>
                    <Text>{initialAmount.toFixed(2)}</Text>
                </View>
            </View>
        );
    }

    const NewBalance = () => {
        return (
            <View style={[styles.infoBox, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View>
                    
                </View>
                <View>
                    <Text>{(selectedBookie.balance + (title === 'Deposit' ? +amount : -amount)).toFixed(2)}</Text>
                </View>
            </View>
        );
    }
    
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={close}
            style={styles.modalContainer}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                {/* Main Modal Box */}
                    <View style={[styles.mainPage, { borderColor: grayBorder }]}>
                        {/* Title */}
                        <Title />
                        <View style={styles.underline}></View>
                        
                        {/* Bookie */}
                        <Bookie />
                        <View style={styles.underline}></View>

                        {/* Amount */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.BoxTitle}>Amount</Text>
                            <View style={styles.inputBox}>
                                {amount !== '' && <Text style={styles.sign}>{title === 'Deposit' ? '+' : '-'}</Text>}
                                <TextInput
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={(text) => {
                                        if (/^\d*\.?\d{0,2}$/.test(text)) { // Check if text matches the desired format
                                        setAmount(text);
                                        }
                                    }}
                                    maxLength={10}
                                    // Add necessary props and event handlers for amount input
                                />
                            </View>
                        </View>
                        <View style={styles.underline}></View>
                        {/* New Balance */}
                        <NewBalance />

                        {/* Confirm Button */}
                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: accentGreen }]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmText}>Confirm</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainPage: {
        width: '80%',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        width: '100%',
        marginVertical: 10,
    },
    infoBox: {
        marginVertical: 0,
    },
    BoxTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 5,
    },
    confirmButton: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    confirmText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sign: {
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.7,
        marginRight: 2,
    },
});