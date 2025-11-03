import React, { useContext } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView } from '@/components/Themed';
import { myBetList } from '@/data/exampleBetData';
import ProfitDashboard from '@/components/Home/ProfitDashboard/ProfitDashboard';
import WeeklyBetReview from '@/components/Home/BetReview/WeeklyBetReview/WeeklyBetReview';
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
import { LocationModal } from '@/components/Modals/LocationModal';
import { Bookie, Balance, DBBetSlip, DBBetSlipWithBets, Bet } from '@/constants/types';

export default function HomeScreen() {

    const { user, setBookie, signedIn, locationStatus } = useContext(UserContext);

    const {
        confirmModalVisible,
        chooseBookieModalVisible,
        profileOptionsModalVisible,
        confirmedBetSlip,
        betSlips,
        weeklyBets,
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
        handleConfirmation,
    } = useConfirmationState();

    const {
        addBookieModalVisible,
        transactionModalVisible,
        transactionTitle,
        transactionBookie,
        userTransactions,
        topBookie, 
        openAddBookieModal,
        closeAddBookieModal, 
        openTransactionModal,
        closeTransactionModal,
        addBookie, 
        onConfirmTransaction, 
        deleteBalBookie,
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
        signOutUser,
    } = useAuthState();

    const {
        deleteUserBetSlip
    } = useDatabaseFuncs();

    const onAddBookie = async (bookie: Bookie) => {
        handleConfirmation(`add ${bookie.name} as a bookie?`, closeAddBookieModal, addBookie, bookie);
    };

    const onSelectBookie = (balance: Balance) => {
        if (balance.bookieId === -1) {
            closeChooseBookieModal();
            if (!signedIn) {
                alert('You must be signed in to add a bookie.');
                return;
            }
            openAddBookieModal();
        } else {
            setBookie({ id: balance.bookieId, name: balance.bookieName });
            closeChooseBookieModal();
        }
    }

    const handleResponse = async (response: string, target: Balance | DBBetSlipWithBets) => {
        // if response is delete, confirm deletion
        if (response === 'Delete') {
            // if target is Balance object, delete balance
            if ('balance' in target && target.balance >= 0) {
                handleConfirmation(`delete ${target.bookieName} as a bookie?`, closeProfileOptionsModal, deleteBalBookie, [target.bookieId, user!.id]);
            } else {
                if ('id' in target) {
                    handleConfirmation(`delete bet slip?`, closeProfileOptionsModal, deleteUserBetSlip, [target, user!.id], onRefresh);
                }
            }
        } else if (response === 'Edit') {
            // if target is Balance object, edit balance
            if ('balance' in target && target.balance >= 0) {
                // open transaction modal
                console.log('edit balance');
            } else {
                // open bet slip modal
                if ('id' in target) {
                    console.log('edit bet slip');
                }
            }
        }
    }

    const onOpenOptions = async (target: Balance | DBBetSlipWithBets, options: string[]) => {
        handleOpenOptions(target, options, handleResponse);
    };

    const onSignOut = async () => {
        handleConfirmation('sign out?', closeProfileOptionsModal, signOutUser, user!.id);
    };

    return (
        <>
            <>
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
                <LocationModal />
                {
                    confirmedBetSlip && (confirmedBetSlip as DBBetSlipWithBets).bets && (
                    <ConfirmBetSlip
                        visible={confirmModalVisible}
                        close={closeConfirmModal}
                        betSlip={confirmedBetSlip as DBBetSlipWithBets}
                        confirm={onConfirmBetSlip}
                    />
                    )
                }
            </>
            <HomeHeader 
                history={handleBetHistory}
                openProfileOptions={openProfileOptionsModal} 
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
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
                            betSlips={betSlips as DBBetSlipWithBets[]} 
                            confirm={openConfirmModal}
                            openOptions={onOpenOptions}
                        />
                    ) 
                }
                <WeeklyBetReview bets={weeklyBets as DBBetSlipWithBets[]}/>
                <BankReview 
                    transactions={userTransactions} 
                    topBookie={topBookie}
                    addBookie={openAddBookieModal}  
                />
            </ScrollView>
        </>
    );
}