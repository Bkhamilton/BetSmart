import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView, Pressable } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import ShowDetails from './ShowDetails';
import NoDetails from './NoDetails';

export default function DetailedInfo({ bets }) {

  const [showDetails, setShowDetails] = useState(false);

  const { grayBackground, grayBorder } = useTheme();

  const Bet = ({ bet }) => {
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
          <Bet key={bet.id} bet={bet}/>
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