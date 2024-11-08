import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';
import DisplayMarketLines from './DisplayMarketLines';

export default function MainBettingLines({ game, marketProps }) {
    return (
        <>
            <View style={styles.container}>
                <DisplayMarketLines game={game} marketProps={marketProps} marketType="moneyline" />
                <DisplayMarketLines game={game} marketProps={marketProps} marketType="spread" />
                <DisplayMarketLines game={game} marketProps={marketProps} marketType="totals" />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'transparent', 
    paddingTop: 2
  },
  propContainer: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});