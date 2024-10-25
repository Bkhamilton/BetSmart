import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import PropBanner from './PropBanner/PropBanner';

import { getBetMarketByGame } from "@/db/api/BetMarkets";
import { groupByTimestampAndBookie, sortBetMarkets } from '@/utils/betMarketHelpers';

export default function Moneyline() {

    const { currentGame } = useContext(BetContext);

    const { db } = useContext(DBContext);

    const [moneylineData, setMoneylineData] = useState([]);

    const title = 'Moneyline';

    // use useEffect to grab all ML values for the currentGame
    useEffect(() => {
        const fetchMoneyline = async () => {
            const moneyline = await getBetMarketByGame(db, currentGame.gameId, 'moneyline');
            const groupedMoneyline = groupByTimestampAndBookie(moneyline, currentGame);
            const sortedMoneyline = sortBetMarkets(groupedMoneyline);
            setMoneylineData(sortedMoneyline);
        }
        fetchMoneyline();
    }, [currentGame]);

    return (
        <>
            <PropBanner title={title} type={"Main"} stat={"moneyline"} data={moneylineData}/>
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