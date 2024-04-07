import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';

export default function TodaysBets({ bets }) {
  const numBets = bets.length;

  function formatBetTarget(betTarget) {
    if (betTarget.includes(' ')) {
      const [firstName, lastName] = betTarget.split(' ');
      return `${firstName.charAt(0)}. ${lastName}`;
    }
    return betTarget;
  }

  function formatOverUnder(overUnder) {
    return overUnder === 'over' ? 'O' : 'U';
  }

  function abbreviateStat(stat) {
    const abbreviations = {
      'Points': 'pts',
      'Assists': 'ast',
      'Rebounds': 'reb',
      'Threes': '3\'s',
      'Steals': 'stls',
      'Blocks': 'blks',
      'Goals': 'gls',
      'Saves': 'saves',
      'Shots': 'shots',
      'Penalties': 'pens',
      'Touchdowns': 'tds',
      'Passing Yards': 'pass yds',
      'Rushing Yards': 'rush yds',
      'Receiving Yards': 'rec yds',
      'Interceptions': 'ints',
      'Tackles': 'tackles',
      'Sacks': 'sacks',
      'Wins': 'wins',
      'Losses': 'losses',
      'Saves': 'saves',
      'Goals Against': 'GA',
      'Clean Sheets': 'CS',
    };
    return abbreviations[stat] || stat;
  }

  return (
    <View style={styles.container}>
      {numBets === 1 && (
        // Render display for one bet
        <Text>One bet today</Text>
      )}
      {numBets === 2 && bets.map((bet, index) => {
        const numCurrentBets = bet.bets.length;
        return (
          <View key={index} style={styles.betContainer}>
            <View style={{ flex: 0.4 }}>
              <Text>Date: {bet.date}</Text>
              <Text>Total Odds: {bet.odds}</Text>
              <Text>Total Legs: {numCurrentBets}</Text>
            </View>
            <View style={{ flex: 0.6, flexDirection: 'row' }}>
            {
                numCurrentBets === 1 && (() => {
                    // Render display for one bet
                    const currentBet = bet.bets[0];
                    return (
                    <View style={{ borderWidth: 1, flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{currentBet.sport} - {currentBet.date}</Text>
                            <Text>{currentBet.odds}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text>{currentBet.home} vs {currentBet.away}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                {currentBet.legs.map((leg, index) => (
                                    <View key={index} style={styles.legComponent}>
                                        {leg.alt && <Text style={{ fontSize: 10 }}>{formatBetTarget(leg.betTarget)} | {leg.line}+ alt {abbreviateStat(leg.stat)}</Text>}
                                        {!leg.alt && <Text style={{ fontSize: 10 }}>{formatBetTarget(leg.betTarget)} | {formatOverUnder(leg.overUnder)} {leg.line} {abbreviateStat(leg.stat)}</Text>}
                                    </View>
                                ))}
                            </View>                            
                        </View>
                    </View>
                    );
                })()
            }
              {numCurrentBets === 2 && bet.bets.map((currentBet, index) => (
                // Render display for two bets
                <View key={index} style={{ borderWidth: 1, flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>{currentBet.date}</Text>
                        <Text style={{ textAlign: 'right' }}>{currentBet.odds}</Text>
                    </View>
                    
                  <Text>{currentBet.sport}</Text>
                  <Text>{currentBet.home} vs {currentBet.away}</Text>
                  <View style={styles.legComponent}>
                    <Text>{currentBet.legs.length} legs</Text>
                  </View>
                </View>
              ))}
              {numCurrentBets > 2 && (
                // Render display for more than two bets
                <Text>More than two bets today</Text>
              )}
            </View>
          </View>
        );
      })}
      {numBets >= 3 && numBets <= 5 && (
        // Render display for 3 to 5 bets
        <Text>Between 3 and 5 bets today</Text>
      )}
      {numBets > 5 && (
        // Render display for more than five bets
        <Text>More than 5 bets today</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  betContainer: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row'
  },
});
