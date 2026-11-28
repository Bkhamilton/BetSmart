import React, { useContext } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import { Text, View, ScrollView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import ProfileMainInfo from '@/components/Profile/ProfilePage/ProfileMainInfo';
import UserFavorites from '@/components/Profile/ProfilePage/UserFavorites';
import Achievements from '@/components/Profile/ProfilePage/Achievements';
import AddBookie from '@/components/Modals/AddBookie';
import LoginPage from '@/components/Modals/LoginPage';
import SignUpPage from '@/components/Modals/SignUpPage';
import ActiveBookies from '@/components/Profile/ProfilePage/ActiveBookies';
import useConfirmationState from '@/hooks/useConfirmationState';
import useUserBalDataState from '@/hooks/useUserBalDataState';
import useOptionsState from '@/hooks/useOptionsState';
import useAuthState from '@/hooks/useAuthState';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';
import OptionMenu from '@/components/Modals/OptionMenu';
import ProfilePageHeader from '@/components/Profile/ProfilePage/ProfilePageHeader';
import BettingPreferences from '@/components/Profile/ProfilePage/BettingPreferences';
import BankrollManagement from '@/components/Profile/ProfilePage/BankrollManagement';
import HistorySyncStatus from '@/components/Profile/HistorySyncStatus';
import { Bookie, Balance } from '@/constants/types';

export default function ProfileScreen() {
  
    const { user, signedIn } = useContext(UserContext);

    const { 
        confirmationModalVisible, 
        closeConfirmationModal, 
        confirmMessage, 
        onHandleConfirm,
        confirmAction,
        handleConfirmation,
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

    const {
        loginModalVisible,
        signUpModalVisible,
        login,
        signUp,
        openLoginModal,
        closeLoginModal,
        closeSignUpModal,
        handleSignUp,
        authError,
        isLoading,
        requestPasswordReset,
        resendConfirmation,
    } = useAuthState();

    const onAddBookie = async (bookie: Bookie) => {
        if (!signedIn) {
            alert('Please sign in to add a bookie');
            return;
        }
        handleConfirmation(`add ${bookie.name} as a bookie?`, closeAddBookieModal, addBookie, bookie);
    };

    const handleResponse = async (response: string, target: Balance) => {
        // if response is delete, confirm deletion
        if (response === 'Delete') {
            // if target is Balance object, delete balance
            if (target.balance >= 0) {
                handleConfirmation(`delete ${target.bookieName} as a bookie?`, closeConfirmationModal, deleteBalBookie, [target.bookieId, user!.id]);
            } else {
                console.log('delete bet');
                console.log(JSON.stringify(target));
            }
        }
    }

    const onOpenOptions = async (target: Balance, options: string[]) => {
        handleOpenOptions(target, options, handleResponse);
    };

    return (
        <>
            <ProfilePageHeader/>
            {authError ? <Text style={{ color: '#c62828', paddingHorizontal: 20 }}>{authError}</Text> : null}
            <LoginPage 
                visible={loginModalVisible} 
                close={closeLoginModal} 
                login={login}
                handleSignUp={handleSignUp}
                authError={authError}
                isLoading={isLoading}
                requestPasswordReset={requestPasswordReset}
                resendConfirmation={resendConfirmation}
            />
            <SignUpPage 
                visible={signUpModalVisible} 
                close={closeSignUpModal}
                signUp={signUp}
                authError={authError}
                isLoading={isLoading}
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
                <ProfileMainInfo 
                    handleSignIn={openLoginModal}
                /> 
                {signedIn && <HistorySyncStatus />}
                <UserFavorites player={"Zion Williamson"}/>
                <ActiveBookies 
                    addBookie={openAddBookieModal}
                    openOptions={onOpenOptions}
                />
                <BettingPreferences />
                <Achievements />
                <BankrollManagement />
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
