import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import useHookBetPreferences from '@/hooks/useHookBetPreferences';

export default function BettingPreferences() {

    const { iconColor, grayBorder, grayBackground } = useTheme();

    const { handleEditPreferences } = useRouting();

    const { db } = useContext(DBContext);
    const { user, signedIn } = useContext(UserContext);

    const { preferences, setPreferences } = useHookBetPreferences();

    const [tempPreferences, setTempPreferences] = useState({
        bankroll: 1000,
        dailyLimit: 100,
        unitSize: 'S ($5) M ($10) L ($20)',
        preferredLeagues: 'NBA, NFL',
        preferredBetTypes: 'ML, Spread, O/U',
        riskTolerance: 'Moderate',
        oddsFormat: 'American',
    });

    const setLeaguesString = (leagues) => {
        let leaguesString = '';
        leagues.forEach((league, index) => {
            leaguesString += league;
            if (index < leagues.length - 1) {
                leaguesString += ', ';
            }
        });
        return leaguesString;
    };

    const setBetTypesString = (betTypes) => {
        let betTypesString = '';
        betTypes.forEach((betType, index) => {
            betTypesString += betType;
            if (index < betTypes.length - 1) {
                betTypesString += ', ';
            }
        });
        return betTypesString;
    };

    const setRiskTolerance = (riskTolerance) => {
        if (riskTolerance > 85 ) {
            return 'Risky';
        } else if (riskTolerance > 60) {
            return 'Moderately Risky';
        } else if (riskTolerance > 40) {
            return 'Balanced';
        } else if (riskTolerance > 20) {
            return 'Somewhat Safe';
        } else {
            return 'Safe';
        }
    };
    
    useEffect(() => {
        // fetch user's betting preferences
        if (!signedIn) return;
        setTempPreferences({
            bankroll: preferences.bankroll,
            dailyLimit: preferences.dailyLimit,
            unitSize: preferences.unitSize,
            preferredLeagues: setLeaguesString(preferences.preferredLeagues),
            preferredBetTypes: setBetTypesString(preferences.preferredBetTypes),
            riskTolerance: setRiskTolerance(preferences.riskTolerance),
            oddsFormat: preferences.oddsFormat,
        });
    }, [user, signedIn, preferences]);

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Betting Preferences</Text>
            </View>
            <View style={[styles.mainContainer, { backgroundColor: grayBackground, borderColor: grayBorder }]}>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Bankroll:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>${tempPreferences.bankroll}</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Daily Limit:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>${tempPreferences.dailyLimit}</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Unit Size:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{tempPreferences.unitSize}</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Preferred Leagues:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{tempPreferences.preferredLeagues}</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Preferred Bet Types:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{tempPreferences.preferredBetTypes}</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Risk Tolerance:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{tempPreferences.riskTolerance}</Text>
                </ClearView>
                <ClearView style={styles.preferenceContainer}>
                    <Text style={{ fontSize: 16 }}>Odds Format:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{tempPreferences.oddsFormat}</Text>
                </ClearView>
                <TouchableOpacity
                    style={[styles.addBookieContainer, { backgroundColor: grayBorder }]}
                    onPress={handleEditPreferences}
                >
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Edit Preferences</Text>    
                </TouchableOpacity>                                                                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addBookieContainer: {
        marginTop: 10,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    mainContainer: {
        paddingVertical: 12,
        paddingHorizontal: 12, 
        marginHorizontal: 12, 
        marginVertical: 12, 
        borderWidth: 1, 
        borderRadius: 8,
    },
    preferenceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});