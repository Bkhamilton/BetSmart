import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function AltLine({ info }) {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Alternate ' + info.propName + ' Lines';

    const pointLines = ["10", "15", "20", "25", "30"];
    const reboundLines = ["6", "8", "10", "12", "14"];
    const assistLines = ["4", "6", "8", "10"];
    const stealLines = ["1", "2", "3"];
    const blockLines = ["1", "2", "3"];
    const threesLines = ["1", "2", "3", "4", "5"];

    return (
        <View style={styles.container}>
            <PropBanner title={title} type={"Player Alt"} player={"Player"} stat={info.propName}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
});