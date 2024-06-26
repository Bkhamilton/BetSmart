import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import useTheme from '@/hooks/useTheme';

export default function GameLines() {

    const { league, currentGame } = useContext(BetContext);

    const { gameId, homeTeamAbv, awayTeamAbv } = currentGame;

    const { iconColor } = useTheme();

    function BettingLine({ type, target, stat, value, odds }) {
        return (
            <TouchableOpacity 
                style={[styles.propContainer]}
            >
                {/[0-9]/.test(value) ? (
                    <>
                        <Text>{value}</Text>
                        <Text style={{ fontSize: 8 }}>{odds}</Text>
                    </>
                ) : (
                    <>
                        <Text>{odds}</Text>
                        <Text style={{ fontSize: 8 }}>{value}</Text>
                    </>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            {/* Moneyline */}
            <View>
                <BettingLine
                    type="Main"
                    target={awayTeamAbv} 
                    stat="moneyline"
                    value={awayTeamAbv} 
                    odds="-195"
                />
                <BettingLine
                    type="Main"
                    target={homeTeamAbv}
                    stat="moneyline" 
                    value={homeTeamAbv} 
                    odds="+110"
                />
            </View>
            {/* Spread */}
            <View>
                <BettingLine
                    type="Main"
                    target={awayTeamAbv}
                    stat="spread"
                    value="-3.5" 
                    odds="-110"  
                />
                <BettingLine 
                    type="Main"
                    target={homeTeamAbv}
                    stat="spread"
                    value="+3.5"
                    odds="-110"  
                />
            </View>
            {/* Total Pts */}
            <View>
                <BettingLine 
                    type="Main"
                    target={gameId}
                    stat="total_over_under"
                    value="O 218.5"
                    odds="+100"  
                />
                <BettingLine 
                    type="Main"
                    target={gameId}
                    stat="total_over_under"
                    value="U 218.5"
                    odds="-108"  
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'transparent', 
        paddingTop: 4
    },
    propContainer: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
});