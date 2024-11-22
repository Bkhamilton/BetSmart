import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function HeadToHead({ homeLogo, homeTeam, awayLogo, awayTeam }) {

    const { grayBackground, grayBorder } = useTheme();

    return (
        <ClearView style={styles.container}>
            <ClearView style={styles.gameTeamContainer}>
                { 
                    awayLogo ?
                    <Image style={styles.teamIcon} source={{uri: awayLogo}}/>
                    : 
                    null 
                }
                <Text>{awayTeam}</Text>
            </ClearView>
            <ClearView style={styles.versusContainer}>
                <View style={styles.leftBar} />
                <Text style={styles.versusText}>@</Text>
                <View style={styles.rightBar} />
            </ClearView>
            <ClearView style={styles.gameTeamContainer}>
                { 
                    homeLogo ?
                    <Image style={styles.teamIcon} source={{uri: homeLogo}}/>
                    : 
                    null 
                }
                <Text>{homeTeam}</Text>
            </ClearView>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        paddingVertical: 8,
    },
    gameTeamContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    teamIcon: {
        width: 32, 
        height: 32,  
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
    versusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity: 0.5,
    },
    leftBar: {
        flex: 0.25, 
        height: 1, 
        borderBottomWidth: 1,
        marginHorizontal: 1,
    },
    versusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    rightBar: {
        flex: 0.40, 
        height: 1, 
        borderBottomWidth: 1,
        marginHorizontal: 1,
    }
});