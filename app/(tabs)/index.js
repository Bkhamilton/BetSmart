import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  
  const [winnings, setWinnings] = useState(130);

  // Component to render individual leg details
  function LegComponent({ leg }) {

    const { recip, stat, line, overUnder } = leg;

    return (
      <View>
        <Text>{recip} | {line} | {overUnder} | {stat}</Text>
      </View>
    );
  }

  // Component to render individual bet details
  function BetComponent({ bet }) {
    return (
      <View>
        <Text>{bet.sport} - {bet.date}</Text>
        <Text>{bet.home} vs {bet.away}</Text>
        <Text>Odds: {bet.odds}</Text>
        {bet.legs.map((leg, index) => (
          <LegComponent key={index} leg={leg} />
        ))}
      </View>
    );
  }

  // Main component to render myBets array
  function MyBet({ myBet }) {
    return (
      <View>
        <Text>{myBet.date} | {myBet.odds}</Text>
        {myBet.bets.map((bet, index) => (
          <BetComponent key={index} bet={bet} />
        ))}
      </View>
    );
  }

  // Main component to render myBets array
  function MyBets({ myBets }) {
    return (
      <View style={{ borderWidth: 1, borderRadius: 16, padding: 16, }}>
        {myBets.map((bet, index) => (
          <MyBet key={index} myBet={bet} />
        ))}
      </View>
    );
  }  

  const myBetList = [{
    date: '3/2/24',
    odds: '+543',
    bets: [
      {
        date: '3/2/24',
        sport: 'NBA',
        home: 'LAL',
        away: 'DEN',
        odds: '+168',
        legs: [
          {
            recip: 'Lebron James',
            stat: 'Points',
            alt: true,
            line: 20,
            overUnder: 'over'
          },
          {
            recip: 'Lebron James',
            stat: 'Assists',
            alt: false,
            line: 5.5,
            overUnder: 'over'
          },
          {
            recip: 'Nikola Jokic',
            stat: 'Points',
            alt: false,
            line: 26.5,
            overUnder: 'over'
          }   
        ]
      },
      {
        date: '3/2/24',
        sport: 'NBA',
        home: 'HOU',
        away: 'PHX',
        odds: '+140',
        legs: [
          {
            recip: 'Alperen Sengun',
            stat: 'Points',
            alt: true,
            line: 18,
            overUnder: 'over'
          },
          {
            recip: 'Alperen Sengun',
            stat: 'Assists',
            alt: false,
            line: 3.5,
            overUnder: 'over'
          },
          {
            recip: 'Fred VanVleet',
            stat: 'Threes',
            alt: true,
            line: 2,
            overUnder: 'over'
          }   
        ]
      }, 
    ]
  }]

  const mainLegs = myBetList[0].bets[0].legs; 

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', height: 84, paddingHorizontal: 20, borderWidth: 1 }}>
        <Text style={{ marginTop: 44, fontSize: 22, fontWeight: 'bold' }}>BetSmart</Text>
      </View>
      <ScrollView>
        <StatusBar style="auto" backgroundColor='transparent'/>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity style={styles.winningsContainer}>
            <Text>+${winnings}</Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 16, paddingTop: 24,}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>My Bets</Text>
          <MyBets myBets={myBetList}></MyBets>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  winningsContainer: {
    borderWidth: 1, 
    width: 160, 
    height: 160, 
    marginTop: 24, 
    borderRadius: 80, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
});
