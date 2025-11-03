import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import PropBanner from './PropBanner/PropBanner';

import { getSpread, getBetMarketByGame } from "@/db/api/BetMarkets";
import { groupByTimestampAndBookie, sortBetMarkets } from '@/utils/betMarketHelpers';

export default function Spread() {

    const { currentGame } = useContext(BetContext);

    const title = 'Spread';

    const { db } = useContext(DBContext);

    const [spreadData, setSpreadData] = useState([]);

    // use useEffect to grab all Spread values for the currentGame
    useEffect(() => {
        const fetchSpread = async () => {
            const spread = await getSpread(db, currentGame.gameId);
            const groupedSpread = groupByTimestampAndBookie(spread, currentGame);
            const sortedSpread = sortBetMarkets(groupedSpread);
            setSpreadData(sortedSpread);
        }
        fetchSpread();
    }, [currentGame]);

    return (
        <>
            <PropBanner title={title} type={"Spread"} stat={"spread"} data={spreadData}/>
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