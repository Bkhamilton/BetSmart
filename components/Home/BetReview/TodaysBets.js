import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '../../Themed';

import Colors from '@/constants/Colors';

export default function TodaysBets({ bets }) {

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
              <Text style={{ fontSize: 24, fontWeight: '600' }}>${betAmount}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, marginTop: 16, marginRight: 4 }}>To Win:</Text>
              <Text style={{ fontSize: 24, fontWeight: '600' }}>${toWin}</Text>
          </View>
        </View>
      </View>
    );
  }

  const DetailedInfo = () => {
    return (
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {bets.map((bet) => (
          <View key={bet.id} style={styles.betContainer}>
            <Text style={styles.betText}>{bet.parlay}</Text>
            <Text style={styles.betText}>{bet.date}</Text>
            <Text style={styles.betText}>{bet.odds}</Text>
            <Text style={styles.betText}>${bet.betAmount}</Text>
            <Text style={styles.betText}>${bet.winnings}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const totalBetAmount = bets.reduce((total, bet) => total + bet.betAmount, 0);
  const totalWinnings = bets.reduce((total, bet) => total + bet.winnings, 0);

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: 'transparent', paddingBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>Today's Bets</Text>
      </View>
      <BigPictureInfo totalBets={10} betAmount={totalBetAmount} toWin={totalWinnings} />
      <DetailedInfo />
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    mainInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
    },
    betContainer: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    betText: {
        fontSize: 16,
        fontWeight: '600',
    },
  });