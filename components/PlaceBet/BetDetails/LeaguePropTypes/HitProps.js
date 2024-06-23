import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function HitProps() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Hit Props';

    return (
        <>
            <PropBanner title={"To Record A Hit"} type={"To Achieve"}/>
            <PropBanner title={"To Record 2+ Hits"} type={"To Achieve"}/>
            <PropBanner title={"To Record 3+ Hits"} type={"To Achieve"}/>
        </>
    );
}