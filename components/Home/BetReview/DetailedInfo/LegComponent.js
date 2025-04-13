import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { getLogoUrl } from '@/db/general/Teams';
import { displayLeg } from '@/utils/betSlipFunctions';
import { getTeamAbbreviationByName } from '@/db/general/Teams';
import { getPlayerLogo } from '@/db/general/Players';
import useTheme from '@/hooks/useTheme';

export default function LegComponent({ leg, children }) {
    const { db } = useContext(DBContext);
    const { grayBorder } = useTheme();
    const { marketType, value, odds, overUnder, betTargetId, betTarget, targetType, betType } = leg;
    const [betTargetName, setBetTargetName] = useState('');
    const [targetLogo, setTargetLogo] = useState('');

    const getName = async () => {
        if (targetType === 'Team') {
            const team = await getTeamAbbreviationByName(db, betTarget);
            return team.abbreviation;
        } else if (targetType === 'Game') {
            return 'Game';
        } else {
            return betTarget;
        }
    }

    const getTargetHeader = () => {
        if (targetType === 'Team') {
            return betTarget;
        } else if (targetType === 'Game') {
            return 'Total';
        } else {
            return 'Player';
        }
    }

    useEffect(() => {
        const fetchName = async () => {
            const name = await getName(betTargetId);
            setBetTargetName(name);
        };
        fetchName();
    }, []);

    useEffect(() => {
        const fetchTargetLogo = async (db, betTarget) => {
            if (targetType === 'Team') {
                getLogoUrl(db, betTarget).then((url) => setTargetLogo(url.logoUrl + '/preview'));
            }
            else if (targetType === 'Player') {
                getPlayerLogo(db, betTarget).then((url) => setTargetLogo(url.image + '/preview'));
            }
        };
        fetchTargetLogo(db, betTarget);
    }, [betTarget]);

    return (
        <View style={[styles.container, { borderColor: grayBorder }]}>
            <View style={styles.legContent}>
                {targetLogo ? (
                    <Image style={styles.targetIcon} source={{uri: targetLogo}}/>
                ) : (
                    <View style={[styles.targetIcon, { borderWidth: 1, borderColor: grayBorder }]} />
                )}
                <View style={styles.legTextContainer}>
                    <Text style={styles.targetHeader}>{getTargetHeader()}</Text>
                    <Text style={styles.legDetails}>{displayLeg(leg, betTargetName)}</Text>
                </View>
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    legContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    targetIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    legTextContainer: {
        flex: 1,
    },
    targetHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    legDetails: {
        fontSize: 14,
        opacity: 0.9,
    },
});