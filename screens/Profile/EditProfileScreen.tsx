import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';
import EditProfileInfo from '@/components/Profile/EditProfile/EditProfileInfo';
import { useRouter } from 'expo-router';
import useAuthState from '@/hooks/useAuthState';

export default function EditProfileScreen() {

    const { iconColor } = useTheme();

    const { updateProfile, updatePassword, authError, isLoading } = useAuthState();
    const router = useRouter();

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 16, }}>
                    <Text style={styles.settingsHeaderText}>Edit Profile</Text> 
                </View>   
            </View>
            <EditProfileInfo 
                updateProfile={updateProfile}
                updatePassword={updatePassword}
                authError={authError}
                isLoading={isLoading}
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
