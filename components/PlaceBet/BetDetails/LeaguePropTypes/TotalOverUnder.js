import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import PropBanner from './PropBanner/PropBanner';

import { getTotalOverUnder, getBetMarketByGame } from "@/db/api/BetMarkets";
import { groupByTimestampAndBookie, sortBetMarkets } from '@/utils/betMarketHelpers';

export default function TotalOverUnder({ info }) {

    const { league, currentGame } = useContext(BetContext);

    const title = 'Total Over/Under';

    const { db } = useContext(DBContext);

    const [totalOverUnderData, setTotalOverUnderData] = useState([]);

    // use useEffect to grab all Total Over/Under values for the currentGame
    useEffect(() => {
        const fetchTotalOverUnder = async () => {
            const totalOverUnder = await getBetMarketByGame(db, currentGame.gameId, 'totals');
            const groupedTotalOverUnder = groupByTimestampAndBookie(totalOverUnder, currentGame);
            const sortedTotalOverUnder = sortBetMarkets(groupedTotalOverUnder);
            setTotalOverUnderData(sortedTotalOverUnder);
        }
        fetchTotalOverUnder();
    }, [currentGame]);

    return (
        <>
            <PropBanner title={title} type={"Total"} stat={"totals"} data={totalOverUnderData}/>
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