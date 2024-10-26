import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import PropBanner from './PropBanner/PropBanner';
import useTheme from '@/hooks/useTheme';

export default function AltSpread() {

    const { league, currentGame } = useContext(BetContext);

    const { iconColor } = useTheme();

    const title = 'Alternate Spread';

    const [altSpreadData, setAltSpreadData] = useState([]);

    /*

    // use useEffect to grab all Alt Spread values for the currentGame
    useEffect(() => {
        const fetchAltSpread = async () => {
            const altSpread = await getSpread(db, currentGame.gameId);
            const groupedAltSpread = groupByTimestampAndBookie(altSpread, currentGame);
            const sortedAltSpread = sortBetMarkets(groupedAltSpread);
            setSpreadData(sortedAltSpread);
        }
        fetchAltSpread();
    }, [currentGame]);

    */

    return (
        <View style={styles.container}>
            <PropBanner title={title} type={"Alt"} stat={"Spread"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
});