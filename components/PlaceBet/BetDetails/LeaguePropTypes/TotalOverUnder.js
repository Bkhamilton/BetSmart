import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';

import { getTotalOverUnder } from "@/db/api/BetMarkets";
import { groupByTimestampAndBookie, sortBetMarkets } from '@/utils/betMarketHelpers';

export default function TotalOverUnder({ info }) {

    const { league, currentGame } = useContext(BetContext);

    const title = 'Total Over/Under';

    const [totalOverUnderData, setTotalOverUnderData] = useState([]);

    /*

    // use useEffect to grab all Total Over/Under values for the currentGame
    useEffect(() => {
        const fetchTotalOverUnder = async () => {
            const totalOverUnder = await getTotalOverUnder(db, currentGame.gameId);
            const groupedTotalOverUnder = groupByTimestampAndBookie(totalOverUnder, currentGame);
            const sortedTotalOverUnder = sortBetMarkets(groupedTotalOverUnder);
            setTotalOverUnderData(sortedTotalOverUnder);
        }
        fetchTotalOverUnder();
    }, [currentGame]);

    */

    return (
        <>
            <PropBanner title={title} type={"Main"} stat={"total_over_under"}/>
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