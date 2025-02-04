import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { TouchableOpacity, Text, View, ScrollView, TextInput, ClearView } from '@/components/Themed';
import Slider from '@react-native-community/slider';
import useTheme from '@/hooks/useTheme';

export default function EditPreferences() {

    const { iconColor, grayBackground, grayBorder, backgroundColor } = useTheme();
    
    const { user, signedIn } = useContext(UserContext);
    const { leagues } = useContext(DBContext);

    const [preferences, setPreferences] = useState({
        bankroll: '',
        dailyLimit: '',
        unitSize: '',
        preferredLeagues: '',
        preferredBetTypes: '',
        riskTolerance: '',
        oddsFormat: '',
    });

    const [unitSizes, setUnitSizes] = useState({
        'S': '',
        'M': '',
        'L': '',
    });

    const handleInputChange = (name, value) => {
        setPreferences({
            ...preferences,
            [name]: value,
        });
    };

    const handleUpdateOption = (name, value) => {
        if (preferences[name] === value) {
            handleInputChange(name, '');
        } else {
            handleInputChange(name, value);
        }
    };

    const handleAddOption = (name, value) => {
        if (preferences[name].includes(value)) {
            handleInputChange(name, preferences[name].filter((option) => option !== value));
        } else {
            handleInputChange(name, [...preferences[name], value]);
        }
    };

    const handleSaveChanges = () => {
        if (!signedIn) {
            alert('Please sign in to save changes');
            return;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                <View style={[styles.editOptionsContainer, { backgroundColor: grayBackground }]}>
                    {/* Bankroll */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Bankroll</Text>
                        <ClearView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: 8, fontSize: 20 }}>$</Text>
                            <TextInput
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                                placeholder={'0.00'}
                                autoCorrect={false}
                                value={preferences.bankroll}
                                onChangeText={(value) => handleInputChange('bankroll', value)}
                                keyboardType={'numeric'}
                            />
                        </ClearView>
                    </ClearView>
                    {/* Daily Limit */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Daily Limit</Text>
                        <ClearView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: 8, fontSize: 20 }}>$</Text>
                            <TextInput
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                                placeholder={'0.00'}
                                autoCorrect={false}
                                value={preferences.dailyLimit}
                                onChangeText={(value) => handleInputChange('dailyLimit', value)}
                                keyboardType={'numeric'}
                            />
                        </ClearView>
                    </ClearView>
                    {/* Unit Size */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Unit Size</Text>
                        <ClearView style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
                            <ClearView style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Text style={{ marginHorizontal: 4, fontSize: 20 }}>S</Text>
                                <TextInput
                                    style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder, flex: 1 }]}
                                    placeholder={'0.00'}
                                    autoCorrect={false}
                                    value={unitSizes['S']}
                                    onChangeText={(value) => setUnitSizes({ ...unitSizes, 'S': value })}
                                    keyboardType={'numeric'}
                                />
                            </ClearView>
                            <ClearView style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Text style={{ marginHorizontal: 4, fontSize: 20 }}>M</Text>
                                <TextInput
                                    style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder, flex: 1 }]}
                                    placeholder={'0.00'}
                                    autoCorrect={false}
                                    value={unitSizes['M']}
                                    onChangeText={(value) => setUnitSizes({ ...unitSizes, 'M': value })}
                                    keyboardType={'numeric'}
                                />
                            </ClearView>
                            <ClearView style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Text style={{ marginHorizontal: 4, fontSize: 20 }}>L</Text>
                                <TextInput
                                    style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder, flex: 1 }]}
                                    placeholder={'0.00'}
                                    autoCorrect={false}
                                    value={unitSizes['L']}
                                    onChangeText={(value) => setUnitSizes({ ...unitSizes, 'L': value })}
                                    keyboardType={'numeric'}
                                />
                            </ClearView>
                        </ClearView>
                    </ClearView>
                    {/* Preferred Leagues */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Preferred Leagues</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                            {
                                leagues.map((league, index) => (
                                    <TouchableOpacity 
                                        key={index}
                                        style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: preferences.preferredLeagues.includes(league.leagueName) ? backgroundColor : grayBorder }]}
                                        onPress={() => handleAddOption('preferredLeagues', league.leagueName)}
                                    >
                                        <Text style={{ color: iconColor }}>{league.leagueName}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </ClearView>
                    {/* Preferred Bet Types */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Preferred Bet Types</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                            {
                                ['ML', 'SPREAD', 'O/U', 'PLAYER', 'GAME', 'TEAM'].map((betType, index) => (
                                    <TouchableOpacity 
                                        key={index}
                                        style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: preferences.preferredLeagues.includes(betType) ? backgroundColor : grayBorder }]}
                                        onPress={() => handleAddOption('preferredLeagues', betType)}
                                    >
                                        <Text style={{ color: iconColor }}>{betType}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </ClearView>
                    {/* Risk Tolerance */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Risk Tolerance</Text>
                        <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                            <Text style={{ opacity: 0.6 }}>Safe</Text>
                            <Text style={{ opacity: 0.6 }}>Risky</Text>
                        </ClearView>
                        <Slider
                            style={{width: '100%', height: 40}}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            onValueChange={(value) => handleInputChange('riskTolerance', value)}
                        />
                    </ClearView>
                    {/* Odds Format */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Odds Format</Text>
                        <ClearView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity 
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: preferences.oddsFormat === 'American' ? backgroundColor : grayBorder, flex: 1, marginRight: 4 }]}
                                onPress={() => handleUpdateOption('oddsFormat', 'American')}
                            >
                                <Text style={{ color: iconColor, textAlign: 'center' }}>American</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: preferences.oddsFormat === 'Decimal' ? backgroundColor : grayBorder, flex: 1, marginLeft: 4 }]}
                                onPress={() => handleUpdateOption('oddsFormat', 'Decimal')}
                            >
                                <Text style={{ color: iconColor, textAlign: 'center' }}>Decimal</Text>
                            </TouchableOpacity>
                        </ClearView>
                    </ClearView>                                                    
                </View>
            </ScrollView>
            <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveChanges}    
                >
                    <Text>Save Preferences</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontalScrollView: {
        backgroundColor: 'transparent',
    },
    saveButton: {
        backgroundColor: '#00A86B',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 4,
    },
    profileIconContainer: {
        position: 'relative',
        alignItems: 'center',
        paddingTop: 12,
    },
    profileIcon: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: '#ccc',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 8,
        backgroundColor: '#00A86B',
        borderRadius: 50,
    },
    editOptionsContainer: {
        paddingVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 40,
    },
    editComponentInput: {
        padding: 12, 
        borderRadius: 16, 
        borderWidth: 1, 
        opacity: 0.8,
        marginTop: 8,
    }
});