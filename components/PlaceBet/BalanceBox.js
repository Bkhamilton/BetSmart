import React, { useContext } from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';
import useTheme from '@/hooks/useTheme';

export default function BalanceBox({ userBalance, openModal }) {

    const { bookie, setBookie, bookieId, setBookieId } = useContext(BetContext);

    const curBookie = userBalance.length > 0 ? userBalance.find(obj => obj.bookieId === bookieId) : { balance: 0 };

    const bookieImages = {
        'DraftKings': draftkings,
        'FanDuel': fanduel,
    };

    const { mainGreen, mainBlue } = useTheme();

    // Function to switch between bookies
    const switchBookie = () => {
        const newBookie = bookie === 'DraftKings' ? 'FanDuel' : 'DraftKings';
        const newBookieId = bookieId === 1 ? 2 : 1;
        setBookie(newBookie);
        setBookieId(newBookieId);
    };

    const backgroundColor = bookie === 'DraftKings' ? mainGreen : mainBlue;
    const borderColor = bookie === 'DraftKings' ? mainGreen : mainBlue;

    return (
        <Pressable 
            style={({pressed}) => ({
                ...styles.bankButton,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                opacity: pressed ? 0.6 : 1,
            })}
            onPress={() => openModal()}
            onLongPress={() => switchBookie()}
        >
          <View style={{ backgroundColor: 'transparent', width: 75, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>${curBookie.balance.toFixed(2)}</Text>
          </View>
            <Image source={bookieImages[bookie]} style={{ width: 32, height: 32, borderRadius: 8 }} />
        </Pressable>
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