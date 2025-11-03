import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function RunProps() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Run Props';

    return (
        <>
            <PropBanner title={"To Record A Run"} type={"To Record"}/>
            <PropBanner title={"To Record 2+ Runs"} type={"To Record"}/>
        </>
    );
}