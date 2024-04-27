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

  const { text, borderColor, greenText, mainGreen } = useTheme();

  // Function to determine font size
  const determineFontSize = (won, total) => {
    if (won.toString().length > 1 && total.toString().length > 1) {
      return 11;
    } else {
      return 12;
    }
  };

  const StatCounter = ({ title, won, total }) => {
    const fontSize = determineFontSize(won, total);
    
    return (
    <View style={styles.statCounterContainer}>
      <View style={styles.statCounterTitle}>
        <Text style={styles.statCounterTitleText}>{title}:</Text>
      </View>
      <View style={styles.statCounterTotal}>
        <Text style={[styles.statCounterTotalText, { fontSize: fontSize }]}>{`${won}/${total}`}</Text>
      </View>
    </View>
  )};

  return (
    <View style={styles.container}>
        <View style={{ backgroundColor: 'transparent', paddingBottom: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Yesterday's Bets</Text>
        </View>
        <Pressable 
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handlePress}
              style={[styles.mainInfo, { borderColor: borderColor, shadowColor: mainGreen }]}
        >
          {showDetails ? (
            <>
              <View style={{ opacity: 0.4, paddingHorizontal: 4, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 2 }}>
                <Text style={{ fontSize: 10, fontWeight: '500' }}>Main Info</Text>
                <View style={{ width: 58, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 10, fontWeight: '500', color: greenText }}>Show Less</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, }}>
                <View style={[styles.detailsContainer, { flex: 0.3 }]}>
                  <Text style={{ fontSize: 38, fontWeight: '700' }}>{`${betsWon}/${totalBets}`}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 18 }}> bets</Text>
                </View>
                <View style={[styles.detailsContainer, { marginBottom: 6, marginTop: 20, flex: 0.35, marginLeft: 16 }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Bet:</Text>
                  <View>
                    {betSlips.map(bet => (
                      <Text key={bet.id} style={{ fontSize: 18, fontWeight: bet.betStatus === 'won' ? '500' : '700', color: bet.betStatus === 'won' ? text : 'red' }}>{`$${bet.betAmount.toFixed(2)}`}</Text>
                    ))}
                  </View>
                </View>
                <View style={[styles.detailsContainer, { marginBottom: 6, marginTop: 20, flex: 0.35, marginLeft: 16 }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Won:</Text>
                  <View>
                    {betSlips.map(bet => (
                      <Text key={bet.id} style={{ fontSize: 18, fontWeight: bet.betStatus === 'won' ? '700' : '500', color: bet.betStatus === 'won' ? greenText : text }}>{`$${bet.betWon.toFixed(2)}`}</Text>
                    ))}
                  </View>
                </View>
              </View>
              <View style={{ paddingHorizontal: 4, paddingTop: 8, opacity: 0.4, }}>
                <Text style={{ fontSize: 10, fontWeight: '500' }}>Details</Text>
              </View>
              <View style={styles.divider} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                <StatCounter title="SPREAD" won={3} total={3} />
                <StatCounter title="ML" won={2} total={3} />
                <StatCounter title="O/U" won={3} total={8} />
                <StatCounter title="PTS" won={2} total={4} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                <StatCounter title="AST" won={3} total={3} />
                <StatCounter title="REB" won={2} total={3} />
                <StatCounter title="3PT" won={1} total={2} />
                <StatCounter title="TOTAL" won={16} total={26} />
              </View>               
            </>
          ) : (
            <>
              <View style={{ opacity: 0.4, paddingHorizontal: 4, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 2 }}>
                <Text style={{ fontSize: 10, fontWeight: '500' }}>Main Info</Text>
                <View style={{ width: 58, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 10, fontWeight: '500', color: greenText }}>Show More</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
                <View style={[styles.infoContainer, { flex: 0.3 }]}>
                  <Text style={{ fontSize: 38, fontWeight: '700' }}>{`${betsWon}/${totalBets}`}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6 }}> bets</Text>
                </View>
                <View style={[styles.infoContainer, { marginBottom: 6, flex: 0.35, marginLeft: 16 }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Bet:</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: 'red', marginBottom: -2 }}>{`$${amountBet.toFixed(2)}`}</Text>
                </View>
                <View style={[styles.infoContainer, { marginBottom: 6, flex: 0.35, marginLeft: 16  }]}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Won:</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: greenText, marginBottom: -2 }}>{`$${amountWon.toFixed(2)}`}</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 4, paddingTop: 8, opacity: 0.4, }}>
                <Text style={{ fontSize: 10, fontWeight: '500' }}>Details</Text>
              </View>
              <View style={styles.divider} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                <StatCounter title="SPREAD" won={3} total={3} />
                <StatCounter title="ML" won={2} total={3} />
                <StatCounter title="PLAYER" won={8} total={12} />
                <StatCounter title="TOTAL" won={16} total={26} />
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
    paddingTop: 4,
    paddingBottom: 8,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
  },
  statCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  statCounterTitle: {
    flex: 0.61,
    alignItems: 'flex-end',
  },
  statCounterTotal: {
    flex: 0.39,
    alignItems: 'flex-start',
  },  
  statCounterTitleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statCounterTotalText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginHorizontal: 4,
    borderTopWidth: 1,
    opacity: 0.2,
    marginBottom: 6,
  }
});