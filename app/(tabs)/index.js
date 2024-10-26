import React, { useContext } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView } from '@/components/Themed';
import { myBetList } from '@/data/exampleBetData';
import ProfitDashboard from '@/components/Home/ProfitDashboard/ProfitDashboard';
import LoginPage from '@/components/Modals/LoginPage';
import SignUpPage from '@/components/Modals/SignUpPage';
import YesterdaysBets from '@/components/Home/BetReview/YesterdaysBets/YesterdaysBets';
import TransactionModal from '@/components/Modals/TransactionModal';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import AddBookie from '@/components/Modals/AddBookie';
import OptionMenu from '@/components/Modals/OptionMenu';
import HomeHeader from '@/components/Home/HomeHeader';
import OpenBets from '@/components/Home/BetReview/OpenBets';
import ConfirmBetSlip from '@/components/Modals/ConfirmBetSlip/ConfirmBetSlip';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';
import { UserContext } from '@/contexts/UserContext';
import useHookHome from '@/hooks/useHookHome';
import useConfirmationState from '@/hooks/useConfirmationState';
import useUserBalDataState from '@/hooks/useUserBalDataState';
import useOptionsState from '@/hooks/useOptionsState';
import useRouting from '@/hooks/useRouting';
import useAuthState from '@/hooks/useAuthState';
import useDatabaseFuncs from '@/hooks/useDatabaseFuncs';
import ProfileOptions from '@/components/Modals/ProfileOptions';
import BankReview from '@/components/Home/BankReview/BankReview';

export default function HomeScreen() {

    const { user, userBalance, setBookie } = useContext(UserContext);

    const {
        confirmModalVisible,
        chooseBookieModalVisible,
        profileOptionsModalVisible,
        confirmedBetSlip,
        betSlips,
        refreshing,
        onRefresh,
        openChooseBookieModal,
        closeChooseBookieModal,
        openConfirmModal,
        closeConfirmModal,
        openProfileOptionsModal,
        closeProfileOptionsModal,
        onConfirmBetSlip,
    } = useHookHome();

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
        transactionModalVisible,
        transactionTitle,
        transactionBookie,
        userTransactions, 
        openAddBookieModal,
        closeAddBookieModal, 
        openTransactionModal,
        closeTransactionModal,
        addBookie, 
        onConfirmTransaction, 
    } = useUserBalDataState();

    const { 
        optionsModalVisible, 
        closeOptionsModal, 
        options, 
        onHandleOption,
        handleOpenOptions,
    } = useOptionsState();

    const {
        handleBetHistory,
    } = useRouting();

    const {
        loginModalVisible,
        signUpModalVisible,
        login,
        openLoginModal,
        closeLoginModal,
        openSignUpModal,
        closeSignUpModal,
        signOutUser,
    } = useAuthState();

    const {
        deleteUserBetSlip
    } = useDatabaseFuncs();

    const onAddBookie = async (bookie) => {
        handleConfirmation(`add ${bookie.name} as a bookie?`, closeAddBookieModal, addBookie, bookie);
    };

    const onSelectBookie = (balance) => {
        if (balance.bookieId === -1) {
            closeChooseBookieModal();
            openAddBookieModal();
        } else {
            setBookie({ id: balance.bookieId, name: balance.bookieName });
            closeChooseBookieModal();
        }
    }

    const handleResponse = async (response, target) => {
        // if response is delete, confirm deletion
        if (response === 'Delete') {
            // if target is Balance object, delete balance
            if (target.balance >= 0) {
                handleConfirmation(`delete ${target.bookieName} as a bookie?`, closeProfileOptionsModal, deleteBalBookie, [target.bookieId, user.id]);
            } else {
                if (target.bets) {
                    handleConfirmation(`delete bet slip?`, closeProfileOptionsModal, deleteUserBetSlip, [target, user.id], onRefresh);
                }
            }
        } else if (response === 'Edit') {
            // if target is Balance object, edit balance
            if (target.balance >= 0) {
                // open transaction modal
                console.log('edit balance');
            } else {
                // open bet slip modal
                if (target.bets) {
                    console.log('edit bet slip');
                }
            }
        }
    }

    const onOpenOptions = async (target, options) => {
        handleOpenOptions(target, options, handleResponse);
    };

    const onSignOut = async () => {
        handleConfirmation('sign out?', closeProfileOptionsModal, signOutUser, user.id);
    };

    return (
        <>
            <>
                <LoginPage 
                    visible={loginModalVisible} 
                    close={closeLoginModal} 
                    login={login}
                />
                <SignUpPage 
                    visible={signUpModalVisible} 
                    close={closeSignUpModal}
                />
                <TransactionModal 
                    visible={transactionModalVisible} 
                    close={closeTransactionModal}
                    title={transactionTitle}
                    bookie={transactionBookie}
                    onConfirm={onConfirmTransaction}
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
                <ProfileOptions
                    visible={profileOptionsModalVisible}
                    close={closeProfileOptionsModal}
                    onSignOut={onSignOut}
                />
                <ChooseBookie 
                    visible={chooseBookieModalVisible} 
                    close={closeChooseBookieModal} 
                    selectBookie={onSelectBookie}
                    extra={true}
                />
                {
                    confirmedBetSlip && confirmedBetSlip.bets && (
                    <ConfirmBetSlip
                        visible={confirmModalVisible}
                        close={closeConfirmModal}
                        betSlip={confirmedBetSlip}
                        confirm={onConfirmBetSlip}
                    />
                    )
                }
            </>
            <HomeHeader 
                history={handleBetHistory} 
                login={openLoginModal} 
                signup={openSignUpModal}
                openProfileOptions={openProfileOptionsModal} 
            />
            <ScrollView
                showVerticalScrollIndicator={false}
                refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh} 
                />
                }
            >
                <ProfitDashboard 
                    openTransaction={openTransactionModal} 
                    openChooseBookie={openChooseBookieModal}
                    transactions={userTransactions}
                />
                { 
                    betSlips && betSlips.length > 0 && (
                        <OpenBets 
                        betSlips={betSlips} 
                        confirm={openConfirmModal}
                        openOptions={onOpenOptions}
                        />
                    ) 
                }
                <YesterdaysBets bets={myBetList}/>
                <BankReview 
                    transactions={userTransactions} 
                    addBookie={openAddBookieModal}  
                />
            </ScrollView>
        </>
    );
}