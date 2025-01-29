import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '@/contexts/UserContext';
import useRouting from '@/hooks/useRouting';
import useTheme from '@/hooks/useTheme';
import EditProfileInfo from '@/components/Profile/EditProfile/EditProfileInfo';

export default function EditProfileScreen() {

    const { iconColor } = useTheme();

    const { handleSettings } = useRouting();

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={handleSettings}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 16, }}>
                    <Text style={styles.settingsHeaderText}>Edit Profile</Text> 
                </View>   
            </View>
            <EditProfileInfo />
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
