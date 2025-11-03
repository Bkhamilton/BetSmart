import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';
import { Text, View } from '@/components/Themed';
import { getDate, getTime, getAmPm } from '@/utils/dateFunctions';

export default function IntroInfo() {

    const { currentGame } = useContext(BetContext);

    const { gameId, homeTeamName, awayTeamName, timestamp } = currentGame;

    return (
        <View>
            <View style={styles.dateTimeContainer}>
                <Text>{getDate(timestamp)}</Text>
                <Text>{getTime(timestamp)} {getAmPm(timestamp)}</Text>
            </View>
            <View style={styles.matchupContainer}>
                <Text style={styles.matchupTitle}>{awayTeamName}</Text>
                <Text>vs</Text>
                <Text style={styles.matchupTitle}>{homeTeamName}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    matchupContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
        matchupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
        dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    }
});