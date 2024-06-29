import React, { useContext } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { View, Text, TouchableOpacity, Modal } from '@/components/Themed';
import { getDate, getTime, getAmPm } from '@/utils/dateFunctions';

export default function BetSlipModal({ visible, close }) {

    const { betSlip } = useContext(BetContext);

    const Leg = ({ leg }) => {
        return (
            <View>
                <Text>{leg.type}</Text>
                <Text>{leg.betTarget} {leg.stat} {leg.line}</Text>
                <Text>{leg.odds}</Text>
            </View>
        );
    }

    const Bet = ({ bet }) => {
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text>{bet.date}</Text>
                    <Text>{bet.league}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{bet.away} vs {bet.home}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text>{bet.odds}</Text>
                </View>
                {bet.legs.map((leg, index) => (
                    <Leg key={index} leg={leg} />
                ))}
            </View>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback
                onPress={close}
            >
                <View style={styles.container}>
                    <View style={styles.modalContent}>
                        <View style={styles.headerContainer}>
                            <View>
                                <Text style={styles.modalText}>Bet Slip</Text>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={close}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {betSlip.bets.map((bet, index) => (
                            <Bet key={index} bet={bet} />
                        ))}
                        <View>
                            <View>
                                <Text>Amount</Text>
                            </View>
                            <View>
                                <Text>Winnings</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        height: '95%',
        marginTop: 'auto',
        paddingTop: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'green',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: 'pink',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});