import React, { useContext } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '@/contexts/UserContext';
import AccountInfo from '@/components/Profile/Settings/AccountInfo';
import SettingsOptions from '@/components/Profile/Settings/SettingsOptions';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';
import DoubleConfirm from '@/components/Modals/DoubleConfirm';
import useRouting from '@/hooks/useRouting';
import useConfirmationState from '@/hooks/useConfirmationState';
import useDatabaseFuncs from '@/hooks/useDatabaseFuncs';
import useHookSettings from '@/hooks/useHookSettings';
import useTheme from '@/hooks/useTheme';
import useAuthState from '@/hooks/useAuthState';
import AboutModal from '@/components/Modals/AboutModal';
import HelpModal from '@/components/Modals/HelpModal';
import PrivacySettings from '@/components/Modals/PrivacySettings';

export default function SettingsScreen() {

    const { iconColor } = useTheme();

    const { 
        confirmationModalVisible, 
        doubleConfirmModalVisible,
        closeConfirmationModal, 
        openDoubleConfirmModal,
        closeDoubleConfirmModal,
        confirmMessage, 
        onHandleConfirm,
        onHandleDoubleConfirm,
        handleConfirmNoModal,
        handleDoubleConfirmation,
    } = useConfirmationState();

    const {
        clearUserData,
        clearBettingData,
    } = useDatabaseFuncs();

    const {
        helpModalVisible,
        aboutModalVisible,
        privacyModalVisible,
        handleHelpModal,
        handleAboutModal,
        handlePrivacyModal,
    } = useHookSettings();

    const { 
        handleProfilePage,
        handleEditProfile,
    } = useRouting();

    const {
        signOutUser,
    } = useAuthState();

    const { user } = useContext(UserContext);

    const handleSignOut = (user) => {
        signOutUser(user.id);
    }

    const handleSupport = () => {
        if (Platform.OS === 'ios') {
            alert('Support us by leaving a review on the App Store!');
        } else {
            // Handle Android and other platforms here
            console.log('Support for other platforms will be added later.');
        }
    };
    
    const handleSelect = (title) => {
        switch (title) {
            case 'Clear User Data':
                handleConfirmNoModal('clear all user data? This cannot be undone', clearUserData, user);
                break;
            case 'Clear Betting Data':
                handleConfirmNoModal('clear all betting data? This cannot be undone', clearBettingData, user);
                break;
            case 'Help':
                // Open Help Modal
                handleHelpModal();
                break;
            case 'About':
                // Open About Page or Modal
                handleAboutModal();
                break;
            case 'Support BetSmart':
                // Open Support Modal
                handleSupport();
                break;
            case 'Privacy Settings':
                // Open Privacy Settings
                handlePrivacyModal();
                break;
            case 'Log Out':
                handleConfirmNoModal('log out?', handleSignOut, user);
                break;
            default:
                console.log('default');
        }
    }

    return (
        <>
            <ConfirmMessage
                visible={confirmationModalVisible}
                close={closeConfirmationModal}
                message={confirmMessage}
                confirm={onHandleConfirm}
            />
            <DoubleConfirm 
                visible={doubleConfirmModalVisible}
                close={closeDoubleConfirmModal}
                confirm={onHandleDoubleConfirm}
            />
            <AboutModal
                visible={aboutModalVisible}
                close={handleAboutModal}
            />
            <HelpModal
                visible={helpModalVisible}
                close={handleHelpModal}
            />
            <PrivacySettings
                visible={privacyModalVisible}
                close={handlePrivacyModal}
            />
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    onPress={handleProfilePage}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                </TouchableOpacity>        
            </View>
            <ScrollView>
                <View style={styles.settingsHeader}>
                    <Text style={styles.settingsHeaderText}>Settings</Text>
                </View>
                <ClearView>
                    <View style={styles.accountHeader}>
                        <Text style={styles.accountHeaderText}>Account</Text>
                    </View>
                    <AccountInfo />
                    <SettingsOptions onSelect={handleSelect} />
                </ClearView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: 84, 
        paddingHorizontal: 20, 
        paddingTop: 48,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    settingsHeader: {
        paddingHorizontal: 20, 
        paddingTop: 48, 
        paddingBottom: 40
    },
    settingsHeaderText: {
        fontSize: 38, 
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
