import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function ReceiveProps() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Receive Props';

    return (
        <>
            <PropBanner title={"To Record 50 Rec yds"}/>
            <PropBanner title={"To Record 100 Rec yds"}/>
            <PropBanner title={"To Record 150 Rec yds"}/>
        </>
    );
}