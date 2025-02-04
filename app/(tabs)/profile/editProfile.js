import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import useTheme from '@/hooks/useTheme';
import EditProfileInfo from '@/components/Profile/EditProfile/EditProfileInfo';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';
import useConfirmationState from '@/hooks/useConfirmationState';
import { updateUserPassword } from '@/db/user-specific/Users';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {

    const { iconColor } = useTheme();

    const { user, signedIn } = useContext(UserContext);
    const { db } = useContext(DBContext);

    const { 
        confirmationModalVisible, 
        closeConfirmationModal, 
        confirmMessage, 
        onHandleConfirm,
        handleConfirmation,
    } = useConfirmationState();

    const onChangePassword = (password) => {
        handleConfirmation('change password?', closeConfirmationModal, updateUserPassword, [db, user.id, password]);
    };

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
                changePassword={onChangePassword}
            />
            <ConfirmMessage 
                visible={confirmationModalVisible}
                close={closeConfirmationModal}
                message={confirmMessage}
                confirm={onHandleConfirm}
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
