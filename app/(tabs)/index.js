import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView } from '@/components/Themed';
import Header from '../../components/Header/Header';

export default function HomeScreen() {
  
  const [winnings, setWinnings] = useState(130);

  function LegComponent({ leg }) {
    const { betTarget, line, alt, overUnder, stat } = leg;
  
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
      <View style={styles.legComponent}>
        {alt && <Text>{formatBetTarget(betTarget)} | {line}+ alt {abbreviateStat(stat)}</Text>}
        {!alt && <Text>{formatBetTarget(betTarget)} | {formatOverUnder(overUnder)} {line} {abbreviateStat(stat)}</Text>}
      </View>
    );
  }

  function BetComponent({ bet }) {
    return (
      <View style={styles.betComponent}>
        <Text>{bet.sport} - {bet.date}</Text>
        <Text>{bet.home} vs {bet.away}</Text>
        <Text style={styles.odds}>{bet.odds}</Text>
        <View style={styles.legComponent}>
          <Text>{bet.legs.length} legs</Text>
        </View>
      </View>
    );
  }
  
  function MyBet({ myBet }) {
    return (
      <View style={styles.myBet}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> 
          <Text>{myBet.date}</Text>
          <Text style={styles.odds}>{myBet.odds}</Text>
        </View>
        {myBet.bets.map((bet, index) => (
          <BetComponent key={index} bet={bet} />
        ))}
      </View>
    );
  }
  
  function MyBets({ myBets }) {
    return (
      <View style={styles.myBets}>
        {myBets.map((bet, index) => (
          <MyBet key={index} myBet={bet} />
        ))}
      </View>
    );
  } 

  const myBetList = [
    {
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
              betTarget: 'Lebron James',
              stat: 'Points',
              alt: true,
              line: 20,
              overUnder: 'over'
            },
            {
              betTarget: 'Lebron James',
              stat: 'Assists',
              alt: false,
              line: 5.5,
              overUnder: 'over'
            },
            {
              betTarget: 'Nikola Jokic',
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
              betTarget: 'Alperen Sengun',
              stat: 'Points',
              alt: true,
              line: 18,
              overUnder: 'over'
            },
            {
              betTarget: 'Alperen Sengun',
              stat: 'Assists',
              alt: false,
              line: 3.5,
              overUnder: 'over'
            },
            {
              betTarget: 'Fred VanVleet',
              stat: 'Threes',
              alt: true,
              line: 2,
              overUnder: 'over'
            }   
          ]
        }, 
      ]
    },
    {
      date: '3/2/24',
      odds: '+200',
      bets: [
        {
          date: '3/2/24',
          sport: 'NBA',
          home: 'BOS',
          away: 'MIA',
          odds: '+120',
          legs: [
            {
              betTarget: 'Jayson Tatum',
              stat: 'Points',
              alt: true,
              line: 25,
              overUnder: 'over'
            },
            {
              betTarget: 'Jayson Tatum',
              stat: 'Rebounds',
              alt: false,
              line: 7.5,
              overUnder: 'over'
            },
            {
              betTarget: 'Bam Adebayo',
              stat: 'Assists',
              alt: false,
              line: 5.5,
              overUnder: 'over'
            }   
          ]
        },
        {
          date: '3/2/24',
          sport: 'NBA',
          home: 'GSW',
          away: 'UTA',
          odds: '+180',
          legs: [
            {
              betTarget: 'Stephen Curry',
              stat: 'Threes',
              alt: true,
              line: 4,
              overUnder: 'over'
            },
            {
              betTarget: 'Stephen Curry',
              stat: 'Assists',
              alt: false,
              line: 6.5,
              overUnder: 'over'
            },
            {
              betTarget: 'Rudy Gobert',
              stat: 'Blocks',
              alt: true,
              line: 2.5,
              overUnder: 'over'
            }   
          ]
        }, 
      ]
    }
  ];

  const mainLegs = myBetList[0].bets[0].legs; 

  const amountWon = 140; // Dummy data
  const amountWagered = 120; // Dummy data
  const profit = amountWon - amountWagered;

  const DATA = [
    { value: amountWon, color: 'green', label: 'Amount Won' },
    { value: amountWagered, color: 'black', label: 'Amount Wagered' },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 1,
  };

  return (
    <View style={styles.container}>
      <Header title={'BetSmart'}/>
      <ScrollView>
        <StatusBar style="auto" backgroundColor='transparent'/>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity style={styles.winningsContainer}>
            <View style={styles.chartContainer}>
              <PieChart
                data={DATA}
                width={180}
                height={180}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                center={[0, 0]}
                paddingLeft='45'
                absolute
                hasLegend={false}
              />
              <Text style={styles.profitText}>+${profit}</Text>
            </View>
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
    marginTop: 24, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  profitText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  legComponent: {
    marginLeft: 20,
  },
  betComponent: {
    marginLeft: 10,
    marginBottom: 10,
  },
  myBet: {
    marginBottom: 20,
  },
  myBets: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  odds: {
    textAlign: 'right',
  },
});
