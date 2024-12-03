import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView, ClearView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import AccountInfo from '@/components/Profile/Settings/AccountInfo';
import SettingsOptions from '@/components/Profile/Settings/SettingsOptions';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';
import OptionMenu from '@/components/Modals/OptionMenu';
import useRouting from '@/hooks/useRouting';
import useConfirmationState from '@/hooks/useConfirmationState';
import useTheme from '@/hooks/useTheme';

export default function SettingsScreen() {

    const { iconColor } = useTheme();

    const { 
        confirmationModalVisible, 
        closeConfirmationModal, 
        confirmMessage, 
        onHandleConfirm,
        confirmAction,
        handleConfirmation,
        handleConfirmNoModal,
    } = useConfirmationState();

    const { handleProfilePage } = useRouting();

    const onSelected = (title) => {
        console.log(title);
    }
    
    const handleSelect = (title) => {
        switch (title) {
            case 'Clear User Data':
                handleConfirmNoModal('clear user data?', onSelected, title);
            case 'Help':
                console.log('help');
                // Open Help Modal
            case 'About':
                console.log('about');
                // Open About Page or Modal
            case 'Support BetSmart':
                console.log('support');
                // Open Support Modal
            case 'Log Out':
                handleConfirmNoModal('log out?', onSelected, title);
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
