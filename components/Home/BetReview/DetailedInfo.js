import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView, Pressable } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function DetailedInfo({ bets }) {

  const [showDetails, setShowDetails] = useState(false);

  const { iconColor, grayBackground, grayBorder, mainGreen } = useTheme();

  const BetLegsDetail = ({ legs }) => {

    const displayLegInfo = (leg) => {
      const isWholeNumber = 'line' in leg && (Number.isInteger(parseFloat(leg.line)) || parseFloat(leg.line) % 1 === 0);
    
      if ('overUnder' in leg && 'line' in leg) {
        if (isWholeNumber) {
          return `${leg.line}+ ${leg.stat}`;
        } else {
          return `${leg.overUnder} ${leg.line} ${leg.stat}`;
        }
      } else if ('line' in leg) {
        if (isWholeNumber) {
          return `${leg.line}+ ${leg.stat}`;
        } else {
          return `${leg.line} ${leg.stat}`;
        }
      } else {
        return `${leg.betTarget} ${leg.stat}`;
      }
    };

    return (
      <View style={{ backgroundColor: 'transparent' }}>
        {legs.map((leg, index) => (
          <View key={index} style={{ backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1 }}/>
              <View style={{ backgroundColor: 'transparent', paddingLeft: 4, }}>
                <Text style={{ fontWeight: '600' }}>{leg.betTarget}</Text>
                <Text>{displayLegInfo(leg)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }; 
  
  const BetListDetail = ({ bet }) => {
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <Text>{bet.sport}</Text>
          <Text>{bet.odds}</Text>
        </View>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{bet.home} vs {bet.away}</Text>
        </View>
        <BetLegsDetail legs={bet.legs} />
      </View>
    );
  };  

  const ShowDetails = ({ bet }) => {
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <Text style={styles.betText}>{bet.date}</Text>
          <Text style={styles.betText}>{bet.odds}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={styles.betText}>Bet</Text>
            <Text style={styles.betText}>${bet.betAmount.toFixed(2)}</Text>
          </View>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={styles.betText}>To Win</Text>
            <Text style={styles.betText}>${bet.winnings.toFixed(2)}</Text>
          </View>
        </View>
        {bet.bets.map((betDetail, index) => (
          <BetListDetail key={index} bet={betDetail} />
        ))}
      </View>
    );
  }

  const BetLegsNoDetail = ({ legs }) => {

    const displayLegInfo = (leg) => {
      const isWholeNumber = 'line' in leg && (Number.isInteger(parseFloat(leg.line)) || parseFloat(leg.line) % 1 === 0);
    
      if ('overUnder' in leg && 'line' in leg) {
        if (isWholeNumber) {
          return `${leg.line}+ ${leg.stat}`;
        } else {
          return `${leg.overUnder} ${leg.line} ${leg.stat}`;
        }
      } else if ('line' in leg) {
        if (isWholeNumber) {
          return `${leg.line}+ ${leg.stat}`;
        } else {
          return `${leg.line} ${leg.stat}`;
        }
      } else {
        return `${leg.betTarget} ${leg.stat}`;
      }
    };

    return (
      <View style={{ backgroundColor: 'transparent' }}>
        {legs.map((leg, index) => (
          <View key={index} style={{ backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1 }}/>
              <View style={{ backgroundColor: 'transparent', paddingLeft: 4, }}>
                <Text style={{ fontWeight: '600' }}>{leg.betTarget}</Text>
                <Text>{displayLegInfo(leg)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };   

  const BetListNoDetail = ({ bet }) => {
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <Text>{bet.sport}</Text>
          <Text>{bet.odds}</Text>
        </View>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{bet.home} vs {bet.away}</Text>
        </View>
        <BetLegsNoDetail legs={bet.legs} />
      </View>
    );
  };  

  const NoDetails = ({ bet }) => {
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <Text style={styles.betText}>{bet.date}</Text>
          <Text style={styles.betText}>{bet.odds}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={styles.betText}>Bet</Text>
            <Text style={styles.betText}>${bet.betAmount.toFixed(2)}</Text>
          </View>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={styles.betText}>To Win</Text>
            <Text style={styles.betText}>${bet.winnings.toFixed(2)}</Text>
          </View>
        </View>
        {bet.bets.map((betDetail, index) => (
          <BetListNoDetail key={index} bet={betDetail} />
        ))}
      </View>      
    );
  }

  const Bet = ({ bet, styles, grayBackground, grayBorder }) => {
    const [showDetails, setShowDetails] = React.useState(false);
  
    return (
      <Pressable 
        key={bet.id} 
        style={[styles.betContainer, { backgroundColor: showDetails ? grayBorder: grayBackground, borderColor: grayBorder }]}
        onPress={() => setShowDetails(!showDetails)}
      >
        {showDetails ? <ShowDetails bet={bet} /> : <NoDetails bet={bet} />}
      </Pressable>
    );
  };

  return (
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'flex-start' }}
        style={{ paddingLeft: 10 }}
      >
        {bets.map((bet) => (
          <Bet key={bet.id} bet={bet} styles={styles} grayBackground={grayBackground} grayBorder={grayBorder} />
        ))}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
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