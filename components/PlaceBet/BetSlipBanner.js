import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';

export default function BetSlipBanner({ onPress }) {

    const { betSlip } = useContext(BetContext);

    const { mainGreen } = useTheme();

    const totalLegs = betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0;

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onPress}
        >
            <View style={[styles.legsContainer, { backgroundColor: mainGreen }]}>
                <Text style={styles.bannerText}>{totalLegs}</Text>
            </View>
            <Text style={styles.bannerText}>Odds: {betSlip.odds}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1, 
        paddingVertical: 8, 
        paddingHorizontal: 20, 
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    legsContainer: {
        borderWidth: 1, 
        borderRadius: 20, 
        height: 40, 
        width: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    bannerText: {
        fontSize: 16, 
        fontWeight: 'bold'
    }
});