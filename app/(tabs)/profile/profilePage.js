import React, { useContext } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import { Text, View, ScrollView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import ProfileMainInfo from '@/components/Profile/ProfilePage/ProfileMainInfo';
import UserFavorites from '@/components/Profile/ProfilePage/UserFavorites';
import Achievements from '@/components/Profile/ProfilePage/Achievements';
import AddBookie from '@/components/Modals/AddBookie';
import ActiveBookies from '@/components/Profile/ProfilePage/ActiveBookies';
import useHookProfilePage from '@/hooks/useHookProfilePage';
import useConfirmationState from '@/hooks/useConfirmationState';
import useUserBalDataState from '@/hooks/useUserBalDataState';
import useOptionsState from '@/hooks/useOptionsState';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';
import OptionMenu from '@/components/Modals/OptionMenu';
import ProfilePageHeader from '@/components/Profile/ProfilePage/ProfilePageHeader';

export default function ProfileScreen() {
  
    const { user } = useContext(UserContext);

    const { 
        confirmationModalVisible, 
        closeConfirmationModal, 
        confirmMessage, 
        onHandleConfirm,
        confirmAction,
    } = useConfirmationState();

    const { 
        addBookieModalVisible,
        openAddBookieModal,
        closeAddBookieModal,
        addBookie, 
        deleteBalBookie 
    } = useUserBalDataState();

    const { 
        optionsModalVisible, 
        closeOptionsModal, 
        options, 
        onHandleOption,
        handleOpenOptions,
    } = useOptionsState();

    const onAddBookie = async (bookie) => {
        closeAddBookieModal();
        const message = `add ${bookie.name} as a bookie?`;
        const response = await confirmAction(message);

        if (response) {
        addBookie(bookie);
        }
    };

    const handleResponse = async (response, target) => {
        // if response is delete, confirm deletion
        if (response === 'Delete') {
            // if target is Balance object, delete balance
            if (target.balance >= 0) {
            const message = `delete ${target.bookieName} as a bookie?`;
            const response = await confirmAction(message);

            if (response) {
                deleteBalBookie(target.bookieId, user.id);
            }
            } else {
            console.log('delete bet');
            console.log(JSON.stringify(target));
            }
        }
    }

    const onOpenOptions = async (target, options) => {
        handleOpenOptions(target, options, handleResponse);
    };

    return (
        <>
            <ProfilePageHeader
                user={user}
            />
            <AddBookie 
                visible={addBookieModalVisible} 
                close={closeAddBookieModal} 
                addBookie={onAddBookie}  
            />
            <ConfirmMessage
                visible={confirmationModalVisible}
                close={closeConfirmationModal}
                message={confirmMessage}
                confirm={onHandleConfirm}
            />
            <OptionMenu
                visible={optionsModalVisible}
                close={closeOptionsModal}
                options={options}
                selectOption={onHandleOption}
            />
            <ScrollView
                refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={() => console.log('refreshing')}
                />
                }
            >
                <ProfileMainInfo /> 
                <UserFavorites player={"Zion Williamson"}/>
                <ActiveBookies 
                addBookie={openAddBookieModal}
                openOptions={onOpenOptions}
                />
                <Achievements />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    {/* Add personal information components here */}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Betting Preferences</Text>
                    {/* Add betting preferences components here */}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bankroll Management</Text>
                    {/* Add bankroll management components here */}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy Settings</Text>
                    {/* Add privacy settings components here */}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support/Help</Text>
                    {/* Add support/help components here */}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    section: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    headerContainer: {
        height: 84, 
        paddingHorizontal: 20, 
        paddingTop: 48,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
