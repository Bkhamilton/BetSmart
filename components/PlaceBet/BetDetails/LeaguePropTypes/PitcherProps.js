import React, { useState, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function PitcherProps() {

    const { league, currentGame } = useContext(BetContext);

    return (
        <>
            <PropBanner title={'Player Strikeouts'} type={"Player"}/>
            <PropBanner title={'Player A - Alt Strikeouts'} type={"Player Alt"} player={"Player A"} stat={'Strikeouts'}/>
            <PropBanner title={'Player B - Alt Strikeouts'} type={"Player Alt"} player={"Player B"} stat={'Strikeouts'}/>
            <PropBanner title={'Starting Pitcher Combined Strikeouts'} />
            <PropBanner title={'Starting Pitcher Combined Alt Strikeouts'} />
            <PropBanner title={"Player A Outs Recorded"} type={"Player Alt"} player={"Player A"} stat={'Outs'}/>
            <PropBanner title={"Player B Outs Recorded"} type={"Player Alt"} player={"Player B"} stat={'Outs'}/>
        </>
    );
}