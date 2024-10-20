import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';
import { getLogoUrl } from '@/db/general/Teams';
import { retrieveMarketsDB } from '@/api/prop-odds/markets';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import MainBettingLines from './MainBettingLines/MainBettingLines';
import HeadToHead from './HeadToHead';
import DateTime from './DateTime';

export default function GameComponent({ game }) {

    const [homeLogo, setHomeLogo] = useState('');
    const [awayLogo, setAwayLogo] = useState('');

    const [marketProps, setMarketProps] = useState([]);

    const { gameId, homeTeamName, homeTeamAbv, awayTeamName, awayTeamAbv, timestamp } = game;

    const { grayBackground, grayBorder } = useTheme();

    const { handleSelectGame } = useRouting();

    const db = useSQLiteContext();

    const fetchLogos = async () => {
        getLogoUrl(db, homeTeamName).then((url) => setHomeLogo(url.logoUrl + '/preview'));
        getLogoUrl(db, awayTeamName).then((url) => setAwayLogo(url.logoUrl + '/preview'));
    };

    const fetchMarketProps = async () => {
        retrieveMarketsDB(db, gameId, ['spread', 'moneyline', 'total_over_under']).then((data) => {
            setMarketProps(data);
        });
    };

    useEffect(() => {
        fetchLogos();
        fetchMarketProps();
    }, [game]);

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: grayBackground, borderColor: grayBorder }]}
            onPress={() => handleSelectGame({ game })}
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
                <View style={{ backgroundColor: 'transparent' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' }}>
                        <View style={styles.bettingLineContainer}>
                            <Text style={styles.bettingLineTitle}>GAME</Text>
                        </View>
                        <View style={styles.bettingLineContainer}>
                            <Text style={styles.bettingLineTitle}>SPREAD</Text>
                        </View>
                        <View style={styles.bettingLineContainer}>
                            <Text style={styles.bettingLineTitle}>TOTAL</Text>
                        </View>
                    </View>
                    
                    <MainBettingLines 
                        game={game} 
                        marketProps={marketProps}
                    />
                </View>
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
    },
    bettingLineTitle: {
        fontSize: 10,
        fontWeight: '600',
    },
    bettingLineContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingTop: 2
    },
});