import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { getLogoUrl } from '@/db/general/Teams';
import { retrieveBig3Markets } from '@/api/the-odds/markets';
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

    const { db } = useContext(DBContext);

    const fetchLogos = async () => {
        getLogoUrl(db, homeTeamName).then((url) => setHomeLogo(url.logoUrl + '/preview'));
        getLogoUrl(db, awayTeamName).then((url) => setAwayLogo(url.logoUrl + '/preview'));
    };

    const fetchMarketProps = async () => {
        retrieveBig3Markets(db, gameId).then((data) => {
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
            <ClearView style={styles.mainBlock}>
                <HeadToHead
                    homeLogo={homeLogo}
                    homeTeam={homeTeamAbv}
                    awayLogo={awayLogo}
                    awayTeam={awayTeamAbv}
                />
                <ClearView>
                    <ClearView style={styles.titleContainer}>
                        <ClearView style={styles.bettingLineContainer}>
                            <Text style={styles.bettingLineTitle}>GAME</Text>
                        </ClearView>
                        <ClearView style={styles.bettingLineContainer}>
                            <Text style={styles.bettingLineTitle}>SPREAD</Text>
                        </ClearView>
                        <ClearView style={styles.bettingLineContainer}>
                            <Text style={styles.bettingLineTitle}>TOTAL</Text>
                        </ClearView>
                    </ClearView>
                    <MainBettingLines 
                        game={game} 
                        marketProps={marketProps}
                    />
                </ClearView>
            </ClearView>
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
    },
    bettingLineTitle: {
        fontSize: 10,
        fontWeight: '600',
    },
    bettingLineContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 2
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});