import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function HRProps() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    return (
        <>
            <PropBanner title={"To Hit A Home Run"} type={"To Record"}/>
            <PropBanner title={"To Hit 2+ Home Runs"} type={"To Record"}/>
        </>
    );
}