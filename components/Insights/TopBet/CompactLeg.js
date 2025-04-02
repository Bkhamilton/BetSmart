import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { displayLeg } from '@/utils/betSlipFunctions';
import { getTeamAbbreviationByName } from '@/db/general/Teams';
import useTheme from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function CompactLegComponent({ leg }) {
    const { db } = useContext(DBContext);
    const { iconColor, grayBorder, mainGreen } = useTheme();
    const { betTargetId, betTarget, targetType } = leg;
    const [betTargetName, setBetTargetName] = useState('');

    const getName = async () => {
        if (targetType === 'Team') {
            const team = await getTeamAbbreviationByName(db, betTarget);
            return team.abbreviation;
        } else if (targetType === 'Game') {
            return 'Game';
        } else {
            return betTarget;
        }
    };

    useEffect(() => {
        const fetchName = async () => {
            const name = await getName(betTargetId);
            setBetTargetName(name);
        };
        fetchName();
    }, []);

    return (
        <View style={[styles.container, { borderColor: grayBorder }]}>
            <View style={styles.legContent}>
                {/* Oversized Check Mark Container */}
                <View style={styles.checkMarkContainer}>
                    <Feather 
                        name="check" 
                        size={32} 
                        color={mainGreen} 
                        style={styles.checkMark}
                    />
                    <View style={[styles.targetIcon, { borderColor: grayBorder }]} />
                </View>
                
                <Text 
                    style={styles.legText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {displayLeg(leg, betTargetName)}
                </Text>
                <Text style={styles.oddsText}>{leg.odds}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 6,
        marginBottom: 6,
    },
    legContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkMarkContainer: {
        width: 28,
        height: 24,
        marginRight: 6,
        position: 'relative',
    },
    targetIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        opacity: 1, // Make the circle very subtle
    },
    checkMark: {
        position: 'absolute',
        top: -5, // These negative values make it spill out
        left: -2,
        zIndex: 1,
    },
    legText: {
        flex: 1,
        fontSize: 12,
        marginRight: 6,
        opacity: 0.9,
    },
    oddsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2ecc71',
    },
});