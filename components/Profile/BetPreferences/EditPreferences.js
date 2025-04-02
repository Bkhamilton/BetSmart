import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { TouchableOpacity, Text, View, ScrollView, TextInput, ClearView } from '@/components/Themed';
import Slider from '@react-native-community/slider';
import useTheme from '@/hooks/useTheme';

export default function EditPreferences({ userPreferences, setUserPreferences, updatePreferences }) {

    const betTypes = ['ML', 'SPREAD', 'O/U', 'PLAYER', 'GAME', 'TEAM'];

    const { iconColor, grayBackground, grayBorder, backgroundColor } = useTheme();
    
    const { user, signedIn } = useContext(UserContext);
    const { leagues } = useContext(DBContext);

    const [preferences, setPreferences] = useState({
        bankroll: 0,
        dailyLimit: 0,
        unitSize: '',
        preferredLeagues: [],
        preferredBetTypes: [],
        riskTolerance: 0,
        oddsFormat: '',
    });

    const [unitSizes, setUnitSizes] = useState({
        'S': 0,
        'M': 0,
        'L': 0,
    });

    useEffect(() => {
        if (userPreferences.bankRoll === 0) return;
        setPreferences(userPreferences);
        if (preferences.unitSize !== '') {
            const unitSizes = userPreferences.unitSize.match(/\$\d+/g).map(size => size.replace('$', ''));
            setUnitSizes({
                'S': unitSizes[0],
                'M': unitSizes[1],
                'L': unitSizes[2],
            });
        }
    }, [userPreferences]);

    useEffect(() => {
        setPreferences({
            ...preferences,
            unitSize: 'S ($' + unitSizes['S'] + ') M ($' + unitSizes['M'] + ') L ($' + unitSizes['L'] + ')',
        });
    }, [unitSizes]);

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
        updatePreferences(preferences);
    };

    const handleRiskTextStyle = (value) => {
        const calculateFontWeight = (distance) => {
            return 900 - Math.min(Math.floor(distance / 10) * 100, 500);
        };
    
        const safeWeight = calculateFontWeight(Math.abs(value - 0));
        const balancedWeight = calculateFontWeight(Math.abs(value - 50));
        const riskyWeight = calculateFontWeight(Math.abs(value - 100));
    
        return {
            safe: { fontWeight: safeWeight.toString() },
            balanced: { fontWeight: balancedWeight.toString() },
            risky: { fontWeight: riskyWeight.toString() },
        };
    };

    const riskTextStyle = handleRiskTextStyle(preferences.riskTolerance);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.editOptionsContainer, { backgroundColor: grayBackground }]}>
                    {/* Bankroll */}
                    <ClearView style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Bankroll</Text>
                        <ClearView style={styles.currencyInputContainer}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={[styles.currencyInput, { backgroundColor: grayBorder }]}
                                placeholder={'0.00'}
                                value={preferences.bankroll}
                                onChangeText={(value) => handleInputChange('bankroll', value)}
                                keyboardType={'numeric'}
                            />
                        </ClearView>
                    </ClearView>

                    {/* Daily Limit */}
                    <ClearView style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Daily Limit</Text>
                        <ClearView style={styles.currencyInputContainer}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={[styles.currencyInput, { backgroundColor: grayBorder }]}
                                placeholder={'0.00'}
                                value={preferences.dailyLimit}
                                onChangeText={(value) => handleInputChange('dailyLimit', value)}
                                keyboardType={'numeric'}
                            />
                        </ClearView>
                    </ClearView>

                    {/* Unit Size */}
                    <ClearView style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Unit Size</Text>
                        <ClearView style={styles.unitSizeContainer}>
                            {['S', 'M', 'L'].map((size) => (
                                <ClearView key={size} style={styles.unitSizeInputContainer}>
                                    <Text style={styles.unitSizeLabel}>{size}</Text>
                                    <TextInput
                                        style={[styles.unitSizeInput, { backgroundColor: grayBorder }]}
                                        placeholder={'0.00'}
                                        value={unitSizes[size]}
                                        onChangeText={(value) => setUnitSizes({ ...unitSizes, [size]: value })}
                                        keyboardType={'numeric'}
                                    />
                                </ClearView>
                            ))}
                        </ClearView>
                    </ClearView>

                    {/* Preferred Leagues */}
                    <ClearView style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Preferred Leagues</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={{ backgroundColor: 'transparent' }}
                            contentContainerStyle={styles.horizontalScrollContent}
                        >
                            {leagues.map((league) => (
                                <TouchableOpacity 
                                    key={league.leagueName}
                                    style={[
                                        styles.optionButton,
                                        { 
                                            backgroundColor: preferences.preferredLeagues.includes(league.leagueName) 
                                                ? backgroundColor 
                                                : grayBorder 
                                        }
                                    ]}
                                    onPress={() => handleAddOption('preferredLeagues', league.leagueName)}
                                >
                                    <Text style={styles.optionButtonText}>{league.leagueName}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </ClearView>

                    {/* Preferred Bet Types */}
                    <ClearView style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Preferred Bet Types</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={{ backgroundColor: 'transparent' }}
                            contentContainerStyle={styles.horizontalScrollContent}
                        >
                            {betTypes.map((betType) => (
                                <TouchableOpacity 
                                    key={betType}
                                    style={[
                                        styles.optionButton,
                                        { 
                                            backgroundColor: preferences.preferredBetTypes.includes(betType) 
                                                ? backgroundColor 
                                                : grayBorder 
                                        }
                                    ]}
                                    onPress={() => handleAddOption('preferredBetTypes', betType)}
                                >
                                    <Text style={styles.optionButtonText}>{betType}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </ClearView>

                    {/* Risk Tolerance */}
                    <ClearView style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Risk Tolerance</Text>
                        <ClearView style={styles.riskToleranceContainer}>
                            <ClearView style={styles.riskLabelsContainer}>
                                <Text style={[styles.riskLabel, riskTextStyle.safe]}>Safe</Text>
                                <Text style={[styles.riskLabel, riskTextStyle.balanced]}>Balanced</Text>
                                <Text style={[styles.riskLabel, riskTextStyle.risky]}>Risky</Text>
                            </ClearView>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={100}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                onValueChange={(value) => handleInputChange('riskTolerance', value)}
                                value={preferences.riskTolerance}
                            />
                        </ClearView>
                    </ClearView>

                    {/* Odds Format */}
                    <ClearView style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Odds Format</Text>
                        <ClearView style={styles.oddsFormatContainer}>
                            {['American', 'Decimal'].map((format) => (
                                <TouchableOpacity 
                                    key={format}
                                    style={[
                                        styles.oddsFormatButton,
                                        { 
                                            backgroundColor: preferences.oddsFormat === format 
                                                ? backgroundColor 
                                                : grayBorder 
                                        }
                                    ]}
                                    onPress={() => handleUpdateOption('oddsFormat', format)}
                                >
                                    <Text style={styles.oddsFormatButtonText}>{format}</Text>
                                </TouchableOpacity>
                            ))}
                        </ClearView>
                    </ClearView>
                </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveChanges}    
                >
                    <Text style={styles.saveButtonText}>Save Preferences</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    editOptionsContainer: {
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        opacity: 0.9,
    },
    currencyInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 20,
        marginRight: 8,
    },
    currencyInput: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    unitSizeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    unitSizeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    unitSizeLabel: {
        fontSize: 16,
        marginRight: 8,
        fontWeight: '600',
    },
    unitSizeInput: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    horizontalScrollContent: {
        paddingVertical: 4,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    optionButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    riskToleranceContainer: {
        marginTop: 8,
    },
    riskLabelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    riskLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    oddsFormatContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    oddsFormatButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    oddsFormatButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    saveButtonContainer: {
        paddingVertical: 16,
    },
    saveButton: {
        backgroundColor: '#00A86B',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});