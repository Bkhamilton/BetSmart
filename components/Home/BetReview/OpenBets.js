import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView, Pressable } from '../../Themed';
import useTheme from '@/hooks/useTheme';
import DetailedInfo from './DetailedInfo';

export default function OpenBets({ bets }) {

  const { iconColor, grayBackground, grayBorder, mainGreen } = useTheme();

  const BigPictureInfo = ({ totalBets, betAmount, toWin }) => {
    return (
      <View style={styles.mainInfoContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 50, fontWeight: '700' }}>{totalBets}</Text>
            <Text style={{ fontSize: 18, marginTop: 16, marginLeft: 4, marginBottom: 6, }}>bets</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, marginTop: 16, marginRight: 4 }}>Wager:</Text>
              <Text style={{ fontSize: 24, fontWeight: '600' }}>${betAmount.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, marginTop: 16, marginRight: 4 }}>To Win:</Text>
              <Text style={{ fontSize: 24, fontWeight: '600' }}>${toWin.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  }

  const totalBets = bets.length;
  const totalBetAmount = bets.reduce((total, bet) => total + bet.betAmount, 0);
  const totalWinnings = bets.reduce((total, bet) => total + bet.winnings, 0);

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: 'transparent', paddingBottom: 8, paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>Open Bets</Text>
      </View>
      <BigPictureInfo totalBets={totalBets} betAmount={totalBetAmount} toWin={totalWinnings} />
      <DetailedInfo bets={bets} />
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    mainInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10
    },
    betContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
    },
    betText: {
        fontSize: 16,
        fontWeight: '600',
    },
  });