import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function RecieveProps() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Run Props';

    return (
        <>
            <PropBanner title={"To Record 50 Rec yds"} type={"To Achieve"}/>
            <PropBanner title={"To Record 100 Rec yds"} type={"To Achieve"}/>
            <PropBanner title={"To Record 150 Rec yds"} type={"To Achieve"}/>
        </>
    );
}