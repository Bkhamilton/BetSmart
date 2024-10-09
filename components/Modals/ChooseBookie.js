import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, Text, View, Modal, ClearView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { bookieImages } from '@/constants/bookieConstants';
import useTheme from '@/hooks/useTheme';

export default function ChooseBookie({ visible, close, selectBookie, extra }) {

    const { mainGreen, grayBackground, grayBorder, bookieColors, bookieBorderColors } = useTheme();

    const { userBalance } = useContext(UserContext);

    const getBalance = (bookieName) => {
        const bookie = userBalance.find((b) => b.bookieName === bookieName);
        return bookie ? bookie.balance : 0;
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

    // button to select 'Total' balance
    const TotalButton = () => {
        return (
            <TouchableOpacity 
                style={[styles.bookieButton, { backgroundColor: mainGreen, borderColor: mainGreen }]}
                onPress={() => selectBookie({ bookieId: 0, bookieName: 'Total' })}           
            >
                <Text style={styles.balanceText}>${userBalance.reduce((acc, b) => acc + b.balance, 0).toFixed(2)}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total</Text>
            </TouchableOpacity>
        );
    }

    const AddBookieButton = () => {
        return (
            <TouchableOpacity 
                style={[styles.addBookieButton, { backgroundColor: grayBackground, borderColor: grayBorder }]}
                onPress={() => selectBookie({ bookieId: -1, bookieName: 'Add' })}           
            >
                <Text style={styles.addBookieText}>Add Bookie</Text>
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
                        {
                            extra && (
                                <ClearView style={{ paddingVertical: 4 }}>
                                    <TotalButton />
                                    <AddBookieButton />
                                </ClearView>
                            )
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
    addBookieButton: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    addBookieText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});