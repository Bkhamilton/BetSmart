import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function PassProps() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Run Props';

    return (
        <>
            <PropBanner title={'Player Pass Yards'} type={"Player"}/>
            <PropBanner title={'Player A - Alt Pass Yards'} type={"Player Alt"} player={"Player A"} stat={'Pass Yards'}/>
            <PropBanner title={'Player B - Alt Pass Yards'} type={"Player Alt"} player={"Player B"} stat={'Pass Yards'}/>
        </>
    );
}