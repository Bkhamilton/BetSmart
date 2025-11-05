import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import useHookBetPreferences from '@/hooks/useHookBetPreferences';
import { FontAwesome6, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const ICON_LIBRARIES = {
    FontAwesome6,
    MaterialCommunityIcons,
    Ionicons,
};

const PreferenceItem = ({ icon, label, value, iconLib = 'FontAwesome6', iconColor, grayBorder }) => {
    const IconComponent = ICON_LIBRARIES[iconLib] || FontAwesome6;
    
    return (
        <ClearView style={styles.preferenceItem}>
            <ClearView style={styles.preferenceLeft}>
                <View style={[styles.iconContainer, { backgroundColor: grayBorder }]}>
                    <IconComponent name={icon} size={20} color={iconColor} />
                </View>
                <Text style={styles.preferenceLabel}>{label}</Text>
            </ClearView>
            <Text style={styles.preferenceValue} numberOfLines={1} ellipsizeMode="tail">
                {value}
            </Text>
        </ClearView>
    );
};

export default function BettingPreferences() {

    const { iconColor, grayBorder, grayBackground } = useTheme();

    const { handleEditPreferences } = useRouting();

    const { db } = useContext(DBContext);
    const { user, signedIn, preferences } = useContext(UserContext);

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
                <PreferenceItem 
                    icon="wallet" 
                    label="Bankroll" 
                    value={`$${tempPreferences.bankroll}`}
                    iconColor={iconColor}
                    grayBorder={grayBorder}
                />
                <View style={[styles.separator, { backgroundColor: grayBorder }]} />
                
                <PreferenceItem 
                    icon="calendar-day" 
                    label="Daily Limit" 
                    value={`$${tempPreferences.dailyLimit}`}
                    iconColor={iconColor}
                    grayBorder={grayBorder}
                />
                <View style={[styles.separator, { backgroundColor: grayBorder }]} />
                
                <PreferenceItem 
                    icon="chart-simple" 
                    label="Unit Size" 
                    value={tempPreferences.unitSize}
                    iconColor={iconColor}
                    grayBorder={grayBorder}
                />
                <View style={[styles.separator, { backgroundColor: grayBorder }]} />
                
                <PreferenceItem 
                    icon="trophy" 
                    label="Preferred Leagues" 
                    value={tempPreferences.preferredLeagues}
                    iconColor={iconColor}
                    grayBorder={grayBorder}
                />
                <View style={[styles.separator, { backgroundColor: grayBorder }]} />
                
                <PreferenceItem 
                    icon="ticket" 
                    iconLib="MaterialCommunityIcons"
                    label="Preferred Bet Types" 
                    value={tempPreferences.preferredBetTypes}
                    iconColor={iconColor}
                    grayBorder={grayBorder}
                />
                <View style={[styles.separator, { backgroundColor: grayBorder }]} />
                
                <PreferenceItem 
                    icon="speedometer" 
                    iconLib="Ionicons"
                    label="Risk Tolerance" 
                    value={tempPreferences.riskTolerance}
                    iconColor={iconColor}
                    grayBorder={grayBorder}
                />
                <View style={[styles.separator, { backgroundColor: grayBorder }]} />
                
                <PreferenceItem 
                    icon="calculator" 
                    label="Odds Format" 
                    value={tempPreferences.oddsFormat}
                    iconColor={iconColor}
                    grayBorder={grayBorder}
                />
                
                <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: grayBorder }]}
                    onPress={handleEditPreferences}
                >
                    <FontAwesome6 name="pen-to-square" size={16} color={iconColor} />
                    <Text style={{ fontSize: 16, fontWeight: '600', marginLeft: 8 }}>Edit Preferences</Text>    
                </TouchableOpacity>                                                                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        paddingVertical: 16,
        paddingHorizontal: 16, 
        marginHorizontal: 12, 
        marginVertical: 12, 
        borderWidth: 1, 
        borderRadius: 12,
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    preferenceLabel: {
        fontSize: 15,
        fontWeight: '500',
        opacity: 0.8,
    },
    preferenceValue: {
        fontSize: 15,
        fontWeight: '600',
        maxWidth: '45%',
        textAlign: 'right',
    },
    separator: {
        height: 1,
        opacity: 0.3,
        marginVertical: 4,
    },
    editButton: {
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});