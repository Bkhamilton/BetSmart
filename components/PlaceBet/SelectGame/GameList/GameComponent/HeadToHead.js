import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function HeadToHead({ homeTeam, awayTeam }) {

    return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <View style={{ paddingVertical: 8, backgroundColor: 'transparent' }}>
                <View style={styles.gameTeamContainer}>
                    <View style={styles.teamIcon}/>
                    <Text>{awayTeam}</Text>
                </View>
                <View style={styles.divider}/>
                <View style={styles.gameTeamContainer}>
                    <View style={styles.teamIcon}/>
                    <Text>{homeTeam}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        borderWidth: 1,
        paddingVertical: 1,
    },
    gameTeamContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    teamIcon: {
        width: 32, 
        height: 32, 
        borderRadius: 16, 
        borderWidth: 1,
        marginRight: 8,
    },
    divider: {
        height: 1, 
        borderBottomWidth: 1, 
        width: 150, 
        paddingTop: 4, 
        marginBottom: 4, 
        opacity: 0.4,
        backgroundColor: 'transparent'
    },
});