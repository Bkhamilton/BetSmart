import React, { useContext } from 'react';
import { StyleSheet, Pressed } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';

import Colors from '@/constants/Colors';

export default function BetSlipBanner({ onPress }) {

    const { betSlip } = useContext(BetContext);

    const { mainGreen, iconColor } = useTheme();

    const totalLegs = betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0;

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onPress}
        >
            <View style={[styles.legsContainer, { backgroundColor: mainGreen }]}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{totalLegs}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Odds: {betSlip.odds}</Text>
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
  }
});