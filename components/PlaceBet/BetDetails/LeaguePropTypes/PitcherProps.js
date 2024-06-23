import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function PitcherProps() {

    const { league, currentGame } = useContext(BetContext);

    return (
        <>
            <PropBanner title={'Player Strikeouts'} type={"Player"}/>
            <PropBanner title={'Player A - Alt Strikeouts'} />
            <PropBanner title={'Player B - Alt Strikeouts'} />
            <PropBanner title={'Starting Pitcher Combined Strikeouts'} />
            <PropBanner title={'Starting Pitcher Combined Alt Strikeouts'} />
            <PropBanner title={"Player A Outs Recorded"} />
            <PropBanner title={"Player B Outs Recorded"} />
        </>
    );
}