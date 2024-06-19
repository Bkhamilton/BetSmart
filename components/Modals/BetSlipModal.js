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
                <Text>{bet.date}</Text>
                <Text>{bet.league}</Text>
                <Text>{bet.home}</Text>
                <Text>{bet.away}</Text>
                <Text>{bet.odds}</Text>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.modalText}>
                                {getDate(betSlip.date) + ' ' + getTime(betSlip.date) + ' ' + getAmPm(betSlip.date)}
                            </Text>
                            <Text style={styles.modalText}>
                                {betSlip.odds}
                            </Text>
                        </View>
                        <Text style={styles.modalText}>{betSlip.type}</Text>
                        <Text style={styles.modalText}>{betSlip.betAmount}</Text>
                        <Text style={styles.modalText}>{getTime(betSlip.date) + ' ' + getAmPm(betSlip.date) + ' ' + getDate(betSlip.date)}</Text>
                        {betSlip.bets.map((bet, index) => (
                            <Bet key={index} bet={bet} />
                        ))}
                        <TouchableOpacity style={styles.closeButton} onPress={close}>
                            <Text style={styles.closeButtonText}>Close</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '100%',
        height: '95%',
        marginTop: 'auto',
        paddingTop: 20,
        borderRadius: 10,
        alignItems: 'center',
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