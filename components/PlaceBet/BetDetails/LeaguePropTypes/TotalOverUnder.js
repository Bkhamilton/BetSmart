import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';
import PropBanner from './PropBanner/PropBanner';

export default function TotalOverUnder({ info }) {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Total Over/Under';

    return (
        <>
            <PropBanner title={title} type={"Player"}/>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    mainLine: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
    }
});