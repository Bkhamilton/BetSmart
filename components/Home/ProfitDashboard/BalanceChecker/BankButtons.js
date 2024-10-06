import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { bookieImages } from '@/constants/bookieConstants';

export default function BankButtons({ selectBookie, openTransaction, bookie }) {

    const { accentGreen, iconColor } = useTheme();

    const selectTransaction = (type) => {
      if (bookie.name === 'Total') return;
      openTransaction(type);
    };

    const TransactionType = ({ type }) => {
      return (
        <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
          <TouchableOpacity
            onPress={() => selectTransaction(type)}
            style={{ backgroundColor: 'transparent', paddingHorizontal: 10 }}
          >
            <FontAwesome6 name={type === 'Deposit' ? 'sack-dollar' : 'hand-holding-dollar'} size={24} color={iconColor}/>
          </TouchableOpacity>
          <Text style={{ fontSize: 8, opacity: 0.7, fontWeight: '600' }}>{type}</Text>
        </View>
      );
    };

    return (
        <View style={[styles.box, { overflow: 'hidden', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, flex: 0.28, }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent', transform: [{ translateY: 8 }] }}>
            <TransactionType type='Deposit'/>
            <TransactionType type='Withdraw'/>
          </View>
          <TouchableOpacity 
            onLongPress={() => selectBookie(bookie.id)}
            style={[styles.dollarContainer, { borderColor: accentGreen, borderWidth: bookie.name === 'Total' ? 10 : 2 }]}
          >
            {bookie.name === 'Total' ? (
              <FontAwesome name="dollar" size={60} color={accentGreen}/>
            ) : (
              <Image source={bookieImages[bookie.name]} style={{ width: 100, height: 100, borderRadius: 50 }}/>
            )}
          </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'transparent'
    },
    dollarContainer: {
        alignItems: 'center', 
        justifyContent: 'center',
        height: 100, 
        width: 100, 
        borderRadius: 55, 
        transform: [{ translateY: 20 }],
        opacity: 0.3,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
});