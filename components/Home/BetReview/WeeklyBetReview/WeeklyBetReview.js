import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, Pressable, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { weeklyBets } from '@/data/weeklyBets';
import NoDetails from './NoDetails';
import ShowDetails from './ShowDetails';
import { countMarketTypes } from '@/utils/betSlipFunctions';

export default function YesterdaysBets({ bets }) {
    // order betSlipResults by result, result: 1 first
    const betSlips = bets.sort((a, b) => {
        if (a.result === 1 && b.result === 0) return -1;
        if (a.result === 0 && b.result === 1) return 1;
        return b.winnings - a.winnings;
    });
    
    const [amountBet, setAmountBet] = useState(0);
    const [amountWon, setAmountWon] = useState(0);
    const [totalBets, setTotalBets] = useState(0);
    const [betsWon, setBetsWon] = useState(0);
    const [marketTypes, setMarketTypes] = useState([]);

    useEffect(() => {
        setAmountBet(betSlips.reduce((acc, bet) => acc + bet.betAmount, 0));
        setAmountWon(betSlips.reduce((acc, bet) => bet.result === '1' ? acc + bet.winnings : acc, 0));
        setTotalBets(betSlips.length);
        setBetsWon(betSlips.filter(bet => bet.result === '1').length);
        setMarketTypes(countMarketTypes(betSlips));
    }, [betSlips]);

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
                        marketTypes={marketTypes}
                    /> 
                    : 
                    <NoDetails
                        amountBet={amountBet}
                        amountWon={amountWon}
                        betsWon={betsWon}
                        totalBets={totalBets}
                        marketTypes={marketTypes}
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