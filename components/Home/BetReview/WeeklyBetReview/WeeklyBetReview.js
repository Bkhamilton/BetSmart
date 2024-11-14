import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Pressable, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { betSlipResults, noDetailStats } from '@/data/exampleBetData';
import NoDetails from './NoDetails';
import ShowDetails from './ShowDetails';

export default function YesterdaysBets({ bets }) {
    // order betSlipResults by result, result: 1 first
    const betSlips = betSlipResults.sort((a, b) => {
        if (a.result === 1 && b.result === 0) return -1;
        if (a.result === 0 && b.result === 1) return 1;
        return b.winnings - a.winnings;
    });

    const amountBet = betSlips.reduce((acc, bet) => acc + bet.betAmount, 0);
    const amountWon = betSlips.reduce((acc, bet) => acc + bet.winnings, 0);
    const totalBets = betSlips.length;
    const betsWon = betSlips.filter(bet => bet.result === 1).length;

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

    const { mainGreen, grayBackground, grayBorder } = useTheme();

    return (
        <ClearView style={styles.container}>
            <View style={{ paddingBottom: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>Weekly Bet Review</Text>
            </View>
            <Pressable 
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                style={[styles.mainInfo, { borderColor: grayBorder, shadowColor: mainGreen, backgroundColor: grayBackground, opacity: opacity }]}
            >
                { 
                    showDetails ? 
                    <ShowDetails
                        betSlips={betSlips}
                        betsWon={betsWon}
                        totalBets={totalBets}
                    /> 
                    : 
                    <NoDetails
                        amountBet={amountBet}
                        amountWon={amountWon}
                        betsWon={betsWon}
                        totalBets={totalBets}
                        stats={noDetailStats}
                    />
                } 
            </Pressable>
        </ClearView>
    );
}
  
const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,   
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
});