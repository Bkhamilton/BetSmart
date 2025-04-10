import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import { getBetTarget } from '@/db/bet-general/BetTargets';
import { getTeamAbbreviationByName } from '@/db/general/Teams';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import useTheme from '@/hooks/useTheme';

export default function Leg({ leg, currentBet, onRemove }) {

    const db = useSQLiteContext();

    const { type, betTarget, stat, line, overUnder, odds } = leg;

    const [betTargetName, setBetTargetName] = useState('');

    const { grayBorder, redText } = useTheme();

    useEffect(() => {
        const fetchName = async () => {
            const name = await getName(leg.betTarget);
            setBetTargetName(name);
        };

        fetchName();
    }, [leg]);

    // function to condense full names to F. Lastname. Or if the last name is hyphenated, it will be F.L.L.
    const condenseName = (fullName) => {
        const parts = fullName.split(' ');
        if (parts.length < 2) return fullName; // Return as is if the name doesn't have at least two parts
    
        const firstInitial = parts[0][0]; // Get the first initial without a dot
        const lastName = parts[parts.length - 1];
    
        if (lastName.includes('-')) {
            const hyphenatedParts = lastName.split('-');
            const initials = hyphenatedParts.map(part => part[0]).join(''); // Concatenate initials without dots
            return `${firstInitial}${initials}`;
        }
    
        return `${firstInitial}. ${lastName}`; // Keep the dot for non-hyphenated last names
    };

    const displayLeg = () => {
        switch (type) {
        case 'Player Rebounds':
        case 'Player Assists':
        case 'Player Points':
        case 'Player Threes':
            return `${condenseName(betTargetName)} ${line}+ ${stat.toUpperCase()}`;
        case 'Main':
            switch (stat) {
            case 'moneyline':
                return `${betTargetName} ${stat.toUpperCase()}`;
            case 'spread':
                return `${betTargetName} ${stat} ${line}`;
            case 'totals':
                return `${betTargetName} ${overUnder} ${line} pts`;
            default:
                return '';
            }
        default:
            return `${betTarget} ${stat} ${line} ${overUnder}`;
        }
    }

    const getName = async (betTargetId) => {
        const target = await getBetTarget(db, betTargetId);
        if (target) {
            if (target.targetType === 'Team') {
                const team = await getTeamAbbreviationByName(db, target.targetName);
                return team.abbreviation;
            } else if (target.targetType === 'Game') {
                return 'Game';
            } else {
                return target.targetName;
            }
        } else {
            return '';
        }
    }

    return (
        <>
            <View style={[styles.container, { backgroundColor: grayBorder }]}>
                <ClearView>
                    <Text>{displayLeg()}</Text>
                    <Text style={{ marginLeft: 6 }}>{odds}</Text>
                </ClearView>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => onRemove(currentBet, leg)}>
                    <Ionicons name="close" size={16} color={redText} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        paddingHorizontal: 16, 
        paddingVertical: 6,
    },
});