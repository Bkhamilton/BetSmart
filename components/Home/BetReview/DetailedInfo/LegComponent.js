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
    const { betTarget, targetType } = leg;
    const [betTargetName, setBetTargetName] = useState('');
    const [targetLogo, setTargetLogo] = useState('');

    const getName = async () => {
        if (targetType === 'Team') {
            const team = await getTeamAbbreviationByName(db, betTarget);
            return team?.abbreviation ?? betTarget;
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
        let active = true;
        const fetchName = async () => {
            const name = await getName();
            if (active) setBetTargetName(name);
        };
        fetchName().catch((error) => console.error('Unable to load bet target name:', error));
        return () => { active = false; };
    }, [db, betTarget, targetType]);

    useEffect(() => {
        let active = true;
        const fetchTargetLogo = async (db, betTarget) => {
            let url;
            if (targetType === 'Team') {
                url = (await getLogoUrl(db, betTarget))?.logoUrl;
            }
            else if (targetType === 'Player') {
                url = (await getPlayerLogo(db, betTarget))?.image;
            }
            if (active) setTargetLogo(url ? url + '/preview' : '');
        };
        fetchTargetLogo(db, betTarget).catch((error) => console.error('Unable to load bet target logo:', error));
        return () => { active = false; };
    }, [db, betTarget, targetType]);

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
                    <Text style={styles.legDetails}>
                        {leg.marketType && (targetType !== 'Player' || betTarget)
                            ? displayLeg(leg, betTargetName)
                            : 'Selection details unavailable'}
                    </Text>
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