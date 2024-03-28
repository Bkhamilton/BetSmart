import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, TextInput } from '../Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/constants/Colors';

export default function BuildABet() {

  //dummy example sports bet about the NBA with 3 legs
  const bets = [
    {
      bet: 'Bet 1',
      odds: 1.5
    },
    {
      bet: 'Bet 2',
      odds: 2.0
    },
    {
      bet: 'Bet 3',
      odds: 3.0
    }
  ];

  //function to calculate the total odds of the bet
  const calculateTotalOdds = (bets) => {
    let totalOdds = 1;
    bets.forEach(bet => {
      totalOdds *= bet.odds;
    });
    return totalOdds;
  };
  
  //function to calculate the moneyline odds of the bet
  const calculateMoneylineOdds = (decimalOdds) => {
    let moneylineOdds;
    if (decimalOdds >= 2.0) {
      moneylineOdds = (decimalOdds - 1) * 100;
    } else {
      moneylineOdds = -100 / (decimalOdds - 1);
    }
  
    // Round to the nearest whole number and add a plus or minus sign
    moneylineOdds = Math.round(moneylineOdds);
    return moneylineOdds > 0 ? `+${moneylineOdds}` : `${moneylineOdds}`;
  };
  
  // Usage:
  let totalOdds = calculateTotalOdds(bets);
  let moneylineOdds = calculateMoneylineOdds(totalOdds);

  return (
    <View style={styles.container}>
      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>Build A Bet</Text>
      </View>
      <View style={styles.splitView}>
        <View style={styles.leftView}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} />
            <Text> legs</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} />
            <Text> odds</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} />            
            <Text> sport</Text>
          </View>
        </View>
        <View style={styles.rightView}>
            <Text style={{ textAlign: 'right' }}>{moneylineOdds}</Text>
          {bets.map((bet, index) => (
            <Text key={index} style={styles.betList}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text> {bet.bet}</Text>
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.generateButtonContainer}>
        <TouchableOpacity style={styles.generateButton}>
          <FontAwesome name="refresh" size={20} color={'black'} />
          <Text>Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleTextContainer: {
    alignItems: 'center',
    paddingVertical: 4
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  splitView: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
  },
  leftView: {
    flex: 1,
    paddingTop: 10,
  },
  rightView: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: 'flex-start',
    padding: 10,
  },
  betList: {
    flexDirection: 'row',
  },
  bullet: {
    width: 10,
  },
  generateButtonContainer: {
    paddingTop: 16
  },
  generateButton: {
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    width: 50,
    marginLeft: 10,
  },
});