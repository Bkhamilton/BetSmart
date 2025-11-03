import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import Bet from './Bet';

export default function BetSlip({ setBetSlipOdds, onRemove }) {

    const { betSlip } = useContext(BetContext);

    return (
        <>
            {betSlip.bets.map((bet, index) => (
                <Bet key={index} bet={bet} setBetSlipOdds={setBetSlipOdds} remove={onRemove} />
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});