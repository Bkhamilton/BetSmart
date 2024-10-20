import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { useSQLiteContext } from 'expo-sqlite';
import { getBetSlipsLast7Days, getBetSlipsByBookieLast7Days } from '@/db/betslips/BetSlips';
import { getWonBetSlipCountByBookieLast7Days, getProfitByBookieLast7Days } from '@/db/betslips/BetSlipsResults';
import { getWonBetSlipCountLast7Days, getProfitLast7Days } from '@/db/betslips/BetSlipsResults';

export default function InsightIntro({ streak }) {

  const db = useSQLiteContext();

  const { redText, accentBlue, greenText } = useTheme();

  const { user, signedIn } = useContext(UserContext);

  const [betsPlaced, setBetsPlaced] = useState(0);
  const [betsWon, setBetsWon] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (!user) return;
    getBetSlipsLast7Days(db, user.id).then((res) => {
      setBetsPlaced(res);
    });
    getWonBetSlipCountLast7Days(db, user.id).then((res) => {
      setBetsWon(res);
    });
    getProfitLast7Days(db, user.id).then((res) => {
      setProfit(res);
    });
  }, [user, signedIn]);

  const HotStreak = () => {
    return (
      <View style={styles.container}>
        <View style={[styles.streakContainer, { borderColor: redText }]}>
          <FontAwesome5 name="fire" size={20} color={redText} style={{ marginHorizontal: 2 }}/>
          <Text style={{ fontSize: 20, fontWeight: '500', color: redText }}>Hot Streak</Text>
        </View>
      </View>
    );
  }

  const ColdStreak = () => {
    return (
      <View style={styles.container}>
        <View style={[styles.streakContainer, { borderColor: accentBlue }]}>
          <FontAwesome5 name="snowflake" size={20} color={accentBlue} style={{ marginHorizontal: 2 }}/>
          <Text style={{ fontSize: 20, fontWeight: '500', color: accentBlue }}>Cold Streak</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 8 }}>
      {streak === 'hot' ? <HotStreak /> : streak === 'cold' ? <ColdStreak /> : null}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
          paddingHorizontal: '15%',
          opacity: 0.7,
        }}
      >
        {/* Bets Placed, Bets Won, Money Won */}
        <Text style={{ fontSize: 12 }}>{betsPlaced} Bet{betsPlaced > 0 ? 's' : ''} Placed</Text>
        <Text style={{ fontSize: 12 }}>{betsWon} Bet{betsWon > 0 ? 's' : ''} Won</Text>
        <Text style={{ fontSize: 12 }}>Profit: {profit > 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}</Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', opacity: 0.5, marginTop: 2 }}>
        <Text style={{ fontSize: 10 }}>Last 7 Days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  streakContainer: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  }
});