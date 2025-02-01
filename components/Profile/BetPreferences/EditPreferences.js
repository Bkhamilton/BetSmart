import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { TouchableOpacity, Text, View, ScrollView, TextInput, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function EditPreferences() {

    const { iconColor, grayBackground, grayBorder, backgroundColor } = useTheme();
    
    const { user, signedIn } = useContext(UserContext);

    const [bankroll, setBankroll] = useState('');
    const [dailyLimit, setDailyLimit] = useState('');
    const [unitSize, setUnitSize] = useState('');
    const [preferredLeagues, setPreferredLeagues] = useState('');
    const [preferredBetTypes, setPreferredBetTypes] = useState('');
    const [riskTolerance, setRiskTolerance] = useState('');
    const [oddsFormat, setOddsFormat] = useState('');

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
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your total Bankroll'}
                            autoCorrect={false}
                            value={bankroll}
                            onChangeText={setBankroll}
                        />
                    </ClearView>
                    {/* Daily Limit */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Daily Limit</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your Daily Limit'}
                            autoCorrect={false}
                            value={dailyLimit}
                            onChangeText={setDailyLimit}
                        />
                    </ClearView>                    
                    {/* Unit Size */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Unit Size</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter a Unit Size'}
                            autoCorrect={false}
                            value={unitSize}
                            onChangeText={setUnitSize}
                        />
                    </ClearView>                    
                    {/* League */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Preferred Leagues</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your preferred leagues'}
                            autoCorrect={false}
                            value={preferredLeagues}
                            onChangeText={setPreferredLeagues}
                        />
                    </ClearView>
                    {/* Bet Types */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Preferred Bet Types</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your preferred bet types'}
                            autoCorrect={false}
                            value={preferredBetTypes}
                            onChangeText={setPreferredBetTypes}
                        />
                    </ClearView>
                    {/* Risk Tolerance */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Risk Tolerance</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your risk tolerance'}
                            autoCorrect={false}
                            value={riskTolerance}
                            onChangeText={setRiskTolerance}
                        />
                    </ClearView>   
                    {/* Odds Format */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Odds Format</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: backgroundColor, backgroundColor: grayBorder }]}
                            placeholder={'Enter your odds format'}
                            autoCorrect={false}
                            value={oddsFormat}
                            onChangeText={setOddsFormat}
                        />
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