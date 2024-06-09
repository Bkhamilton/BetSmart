import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import MainBettingLines from './MainBettingLines';
import HeadToHead from './HeadToHead';
import DateTime from './DateTime';

export default function GameComponent({ game, selectGame, selectProp }) {

    const { homeTeamAbv, awayTeamAbv, timestamp } = game;

    const { grayBackground, grayBorder } = useTheme();

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: grayBackground, borderColor: grayBorder }]}
            onPress={() => selectGame(game)}
        >
            <View style={styles.mainBlock}>
                <HeadToHead
                    homeTeam={homeTeamAbv}
                    awayTeam={awayTeamAbv}
                />
                <MainBettingLines 
                    game={game} 
                    selectProp={selectProp}
                />
            </View>
            <DateTime timestamp={timestamp} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1, 
        borderRadius: 8, 
        paddingHorizontal: 12,
    },
    mainBlock: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    }
});