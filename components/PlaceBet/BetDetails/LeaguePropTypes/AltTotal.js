import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function AltTotal() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Alternate Total';

    const [altTotalData, setAltTotalData] = useState([]);

    /*

    // use useEffect to grab all Alt Total values for the currentGame
    useEffect(() => {
        const fetchAltTotal = async () => {
            const altTotal = await getAltTotal(db, currentGame.gameId);
            const groupedTotal = groupByTimestampAndBookie(altTotal, currentGame);
            const sortedTotal = sortBetMarkets(groupedTotal);
            setAltTotalData(sortedTotal);
        }
        fetchAltTotal();
    }, [currentGame]);

    */

    return (
        <View style={styles.container}>
            <PropBanner title={title} type={"Alt"} stat={"Total"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
});