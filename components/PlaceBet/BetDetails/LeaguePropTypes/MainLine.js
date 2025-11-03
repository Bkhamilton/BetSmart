import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';

export default function MainLine({ info }) {

    const { league, currentGame } = useContext(BetContext);

    const title = 'Main ' + info.propName + ' Lines';

    return (
        <>
            <PropBanner title={title} stat={info.propName} type={"Player"} isOpen={true}/>
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