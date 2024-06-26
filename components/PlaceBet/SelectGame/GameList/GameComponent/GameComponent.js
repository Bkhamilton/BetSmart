import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';
import { getLogoUrl } from '@/db/general/Teams';
import useTheme from '@/hooks/useTheme';
import MainBettingLines from './MainBettingLines';
import HeadToHead from './HeadToHead';
import DateTime from './DateTime';

export default function GameComponent({ game, selectGame, selectProp }) {

    const [homeLogo, setHomeLogo] = useState('');
    const [awayLogo, setAwayLogo] = useState('');

    const { homeTeamName, homeTeamAbv, awayTeamName, awayTeamAbv, timestamp } = game;

    const { grayBackground, grayBorder } = useTheme();

    const db = useSQLiteContext();

    const fetchLogos = async () => {
        getLogoUrl(db, homeTeamName).then((url) => setHomeLogo(url.logoUrl + '/preview'));
        getLogoUrl(db, awayTeamName).then((url) => setAwayLogo(url.logoUrl + '/preview'));
    };

    useEffect(() => {
        fetchLogos();
    }, [game]);

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: grayBackground, borderColor: grayBorder }]}
            onPress={() => selectGame(game)}
        >
            <View style={styles.mainBlock}>
                { homeLogo != '' && awayLogo != '' ?                 
                    <HeadToHead
                        homeLogo={homeLogo}
                        homeTeam={homeTeamAbv}
                        awayLogo={awayLogo}
                        awayTeam={awayTeamAbv}
                    /> : 
                    <Text>Loading...</Text>
                }
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