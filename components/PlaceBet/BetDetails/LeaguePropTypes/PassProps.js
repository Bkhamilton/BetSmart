import React, { useState, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';

export default function PassProps() {

    const { league, currentGame } = useContext(BetContext);

    const title = 'Player Pass Yards';

    return (
        <>
            <PropBanner title={title} type={"Player"} stat={title} isOpen={true}/>
            <PropBanner title={'Player A - Alt Pass Yards'} type={"Player Alt"} player={"Player A"} stat={'Pass Yards'}/>
            <PropBanner title={'Player B - Alt Pass Yards'} type={"Player Alt"} player={"Player B"} stat={'Pass Yards'}/>
        </>
    );
}