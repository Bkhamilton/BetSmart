import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function InsightIntro({ streak }) {

  const { redText, accentBlue } = useTheme();

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
          paddingHorizontal: '20%',
          opacity: 0.7,
        }}
      >
        {/* Bets Placed, Bets Won, Money Won */}
        <Text style={{ fontSize: 12 }}>5 Bets Placed</Text>
        <Text style={{ fontSize: 12 }}>1 Bet Won</Text>
        <Text style={{ fontSize: 12 }}>Profit: -$40</Text>
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