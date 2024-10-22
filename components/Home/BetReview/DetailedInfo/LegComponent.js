import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { getLogoUrl } from '@/db/general/Teams';
import { displayLeg } from '@/utils/betSlipFunctions';
import { getTeamAbbreviationByName } from '@/db/general/Teams';

export default function LegComponent({ leg, children }) {

    const { db } = useContext(DBContext);

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
            };
        };

        fetchTargetLogo(db, betTarget);
    }, [betTarget]);

    return (
        <ClearView>
            <ClearView style={styles.container}>
                {
                    targetLogo == '' ? 
                    <View style={[styles.targetIcon, { borderWidth: 1 }]} /> 
                    : 
                    <Image style={styles.targetIcon} source={{uri: targetLogo}}/>
                }
                <ClearView style={{ paddingLeft: 4 }}>
                    <Text style={{ fontWeight: '600' }}>{getTargetHeader()}</Text>
                    <Text>{displayLeg(leg, betTargetName)}</Text>
                </ClearView>
            </ClearView>
            {children}
        </ClearView>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    targetIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 4,
    },
});