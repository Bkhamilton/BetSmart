import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Pressable } from '@/components/Themed';

import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import useTheme from '@/hooks/useTheme';

export default function YesterdaysBets({ bets }) {
  const betSlipsRaw = [{
      id: 1,
      betAmount: 20,
      betWon: 40,
      betStatus: 'won'
  },
  {
      id: 2,
      betAmount: 30,
      betWon: 0,
      betStatus: 'lost'
  },
  {
      id: 3,
      betAmount: 10,
      betWon: 20,
      betStatus: 'won'
  },
  {
      id: 4,
      betAmount: 40,
      betWon: 0,
      betStatus: 'lost'
  },
  {
      id: 5,
      betAmount: 20,
      betWon: 40,
      betStatus: 'won'
  },
  {
      id: 6,
      betAmount: 30,
      betWon: 0,
      betStatus: 'lost'
  },
  {
      id: 7,
      betAmount: 10,
      betWon: 20,
      betStatus: 'won'
  },
  {
      id: 8,
      betAmount: 40,
      betWon: 0,
      betStatus: 'lost'
  }]

  // order betSlipsRaw by betStatus, betStatus: 'won' first
  const betSlips = betSlipsRaw.sort((a, b) => {
    if (a.betStatus === 'won' && b.betStatus === 'lost') return -1;
    if (a.betStatus === 'lost' && b.betStatus === 'won') return 1;
    return b.betWon - a.betWon;
  });

  const amountBet = betSlips.reduce((acc, bet) => acc + bet.betAmount, 0);
  const amountWon = betSlips.reduce((acc, bet) => acc + bet.betWon, 0);
  const totalBets = betSlips.length;
  const betsWon = betSlips.filter(bet => bet.betStatus === 'won').length;

  const [opacity, setOpacity] = useState(1);

  const handlePressIn = () => {
    setOpacity(0.5);
  };

  const handlePressOut = () => {
    setOpacity(1);
  };

  const [showDetails, setShowDetails] = useState(false);

  const handlePress = () => {
    setShowDetails(!showDetails);
  };

  const { text, borderColor, greenText } = useTheme();

  return (
    <View style={styles.container}>
        <View style={{ backgroundColor: 'transparent', paddingBottom: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Yesterday's Bets</Text>
        </View>
        <Pressable 
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handlePress}
              style={[styles.mainInfo, { borderColor: borderColor }]}
        >
          {showDetails ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.detailsContainer}>
                  <Text style={{ fontSize: 38, fontWeight: '700' }}>{`${betsWon}/${totalBets}`}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 18 }}> bets</Text>
                </View>
                <View style={[styles.detailsContainer, { marginBottom: 6 }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Bet:</Text>
                  <View>
                    {betSlips.map(bet => (
                      <Text key={bet.id} style={{ fontSize: 18, fontWeight: '700', color: bet.betStatus === 'won' ? text : 'red' }}>{`$${bet.betAmount.toFixed(2)}`}</Text>
                    ))}
                  </View>
                </View>
                <View style={[styles.detailsContainer, { marginBottom: 6 }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Won:</Text>
                  <View>
                    {betSlips.map(bet => (
                      <Text key={bet.id} style={{ fontSize: 18, fontWeight: '700', color: bet.betStatus === 'won' ? greenText : text }}>{`$${bet.betWon.toFixed(2)}`}</Text>
                    ))}
                  </View>
                </View>
              </View>            
            </>
          ) : (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.infoContainer}>
                  <Text style={{ fontSize: 38, fontWeight: '700' }}>{`${betsWon}/${totalBets}`}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6 }}> bets</Text>
                </View>
                <View style={[styles.infoContainer, { marginBottom: 6 }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Bet:</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: 'red' }}>{`$${amountBet.toFixed(2)}`}</Text>
                </View>
                <View style={[styles.infoContainer, { marginBottom: 6 }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Won:</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: 'green' }}>{`$${amountWon.toFixed(2)}`}</Text>
                </View>
              </View>
            </>

          )}
        </Pressable>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,   
    backgroundColor: 'transparent',
    paddingHorizontal: 10,  
  },
  mainInfo: {
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: Colors.light.mainBlue,
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  }
});