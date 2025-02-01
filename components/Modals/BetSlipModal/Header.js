import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function Header({ totalLegs, onClose }) {

    const { betSlip } = useContext(BetContext);

    const { mainGreen, grayBorder } = useTheme();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.rowContainer}>
                <View style={[styles.legsContainer, { backgroundColor: mainGreen }]}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{totalLegs}</Text>
                </View>
                <Text style={styles.modalText}>Bet Slip</Text>
            </View>
            <View style={styles.rowContainer}>
                <Text>{betSlip.odds}</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
    },
    legsContainer: {
        borderWidth: 1, 
        borderRadius: 15, 
        height: 30, 
        width: 30, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modalText: {
        fontSize: 16,
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});