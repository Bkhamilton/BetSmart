import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function FirstXInnings() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'First X Innings';

    return (
        <View style={styles.container}>
            <PropBanner title={"First 5 Innings Moneyline"} />
            <PropBanner title={"First 5 Innings Result"} />
            <PropBanner title={"First 5 Innings Alt Run Lines"} /> 
            <PropBanner title={"First 5 Innings Alt Total Runs"} />        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
});
