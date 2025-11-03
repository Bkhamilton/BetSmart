import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { BetContext } from '@/contexts/NewBetContext/BetContext/BetContext';

export default function BettingLine({ game, betLine, type }) {

    const { selectProp } = useContext(BetContext);

    const { gameId, homeTeamAbv, awayTeamAbv, homeTeamName, awayTeamName } = game;

    const { betTargetId, marketType, value, overUnder, odds, bookieId } = betLine;

    const { grayBorder } = useTheme();

    const exceptions = ["San Francisco 49ers", "Philadelphia 76ers"]

    const getValue = (value, overUnder) => {

        if (exceptions.includes(value)) {
            const teamName = value.split(' ')[1];

            if (homeTeamName.includes(teamName)) {
                return homeTeamAbv;
            }

            if (awayTeamName.includes(teamName)) {
                return awayTeamAbv;
            }

            return value;
        }

        // If value is a number, return it as is
        if (/[0-9]/.test(value)) {
            if (overUnder) {
                return overUnder.charAt(0) + ' ' + value;
            } else {
                return value;
            }
        }
        
        // If value is a string, it will be in the form "LOC TeamName". Return TeamName
        const teamName = value.split(' ')[1];

        // if teamName is included in homeTeamName, return homeTeamAbv
        if (homeTeamName.includes(teamName)) {
            return homeTeamAbv;
        }

        // if teamName is included in awayTeamName, return awayTeamAbv
        if (awayTeamName.includes(teamName)) {
            return awayTeamAbv;
        }

        return value;
    }

    return (
        <TouchableOpacity 
            style={[styles.propContainer, { borderColor: grayBorder }]}
            onPress={() => selectProp({ game, type, betTargetId, marketType, value, overUnder, odds, bookieId })}
        >
            {/[0-9]/.test(value) ? (
                <>
                    <Text>{getValue(value, overUnder)}</Text>
                    <Text style={{ fontSize: 8 }}>{odds}</Text>
                </>
            ) : (
                <>
                    <Text>{odds}</Text>
                    <Text style={{ fontSize: 8 }}>{getValue(value, overUnder)}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    propContainer: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
});