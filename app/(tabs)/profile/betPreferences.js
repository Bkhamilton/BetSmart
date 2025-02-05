import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import EditPreferences from '@/components/Profile/BetPreferences/EditPreferences';
import useHookBetPreferences from '@/hooks/useHookBetPreferences';

export default function BetPreferencesScreen() {

    const { iconColor } = useTheme();

    const router = useRouter();

    const { preferences, setPreferences, updatePreferences } = useHookBetPreferences();

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 16, }}>
                    <Text style={styles.settingsHeaderText}>Edit Preferences</Text> 
                </View>   
            </View>
            <EditPreferences 
                userPreferences={preferences}
                setUserPreferences={setPreferences}
                updatePreferences={updatePreferences}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 84, 
        paddingHorizontal: 20, 
        paddingTop: 48,
        alignItems: 'center',
    },
    settingsHeader: {
        paddingHorizontal: 20, 
        paddingTop: 48, 
        paddingBottom: 40
    },
    settingsHeaderText: {
        fontSize: 32, 
        fontWeight: 'bold'
    },
    accountHeader: {
        paddingHorizontal: 20, 
        paddingVertical: 12
    },
    accountHeaderText: {
        fontSize: 24, 
        fontWeight: '500'
    },
});
