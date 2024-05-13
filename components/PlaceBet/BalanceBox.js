import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, Pressable, TouchableOpacity } from '@/components/Themed';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';
import useTheme from '@/hooks/useTheme';

export default function BalanceBox({ userBalance, bookie }) {

    const curBookie = userBalance.find(obj => obj.Bookie === bookie);

    const bookieImages = {
        'DraftKings': draftkings,
        'FanDuel': fanduel,
    };

    const { mainGreen } = useTheme();

    return (
        <TouchableOpacity 
            style={[styles.bankButton, { backgroundColor: mainGreen, borderColor: mainGreen }] }
            onLongPress={() => console.log('long press')}
        >
            <Text style={{ fontSize: 20, fontWeight: '500', marginRight: 8 }}>${curBookie.Balance.toFixed(2)}</Text>
            <Image source={bookieImages[bookie]} style={{ width: 32, height: 32, borderRadius: 8 }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 1,
  },
  bankButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: -8,
    paddingLeft: 8,
  },
});