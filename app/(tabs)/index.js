import React, { useState, useEffect, useContext } from 'react';
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
import HomeHeader from '@/components/Home/HomeHeader';
import OpenBets from '@/components/Home/BetReview/OpenBets';
import ConfirmBetSlip from '@/components/Modals/ConfirmBetSlip';
import { useSQLiteContext } from 'expo-sqlite';
import { UserContext } from '@/contexts/UserContext';
import { fillBetSlips } from '@/contexts/BetContext/betSlipHelpers';
import { getUser } from '@/db/user-specific/Users';
import { insertUserSession } from '@/db/user-specific/UserSessions';
import { getOpenBetSlips } from '@/db/betslips/BetSlips';
import { confirmBetResults } from '@/utils/dbHelpers';
import useModalHome from '@/hooks/useModalHome';
import useConfirmationState from '@/hooks/useConfirmationState';
import useUserBalDataState from '@/hooks/useUserBalDataState';
import useRouting from '@/hooks/useRouting';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';

export default function HomeScreen() {

  const db = useSQLiteContext();

  const { user, trigger, setTrigger, userBalance, setBookie } = useContext(UserContext);

  const {
    loginModalVisible,
    signUpModalVisible,
    confirmModalVisible,
    chooseBookieModalVisible,
    confirmedBetSlip,
    betSlips, setBetSlips,
    openChooseBookieModal,
    closeChooseBookieModal,
    openSignUpModal,
    closeSignUpModal,
    openLoginModal,
    closeLoginModal,
    openConfirmModal,
    closeConfirmModal,
  } = useModalHome();

  const { 
    confirmationModalVisible,
    openConfirmationModal,
    closeConfirmationModal,
    confirmMessage, 
    setMessage, 
    handleConfirmCallback, 
    onHandleConfirm, 
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
    handleBetHistory,
  } = useRouting();

  const [triggerFetch, setTriggerFetch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Add your data reloading logic here
    setTriggerFetch(prev => !prev);
    setRefreshing(false);
  };

  async function login(username, password) {
    
    // Check if the username and password match
    const user = await getUser(db, username, password);

    if (!user) {
      return false;
    }

    // If the username and password match, create a new session
    const today = new Date().toISOString();
    await insertUserSession(db, user.id, today);

    closeLoginModal();

    return true;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const betSlips = await getOpenBetSlips(db);
        const betSlipsWithBets = await fillBetSlips(db, betSlips);
        setBetSlips(betSlipsWithBets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [triggerFetch, trigger]);

  const onConfirmBetSlip = (betSlip) => {
    confirmBetResults(db, betSlip, user);

    closeConfirmModal();

    setTriggerFetch(prev => !prev);
    setTrigger(prev => !prev);
  }

  const onAddBookie = async (bookie) => {
    closeAddBookieModal();
    setMessage(`add ${bookie.name} as a bookie?`);
    openConfirmationModal();

    const response = await new Promise((resolve) => {
      handleConfirmCallback(() => resolve);
    });

    if (response) {
      addBookie(bookie);
    }
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

  return (
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
      {
        user && userBalance && (
          <ChooseBookie 
            visible={chooseBookieModalVisible} 
            close={closeChooseBookieModal} 
            selectBookie={onSelectBookie}
            extra={true}
          />
        )
      }
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
      <HomeHeader 
        history={handleBetHistory} 
        login={openLoginModal} 
        signup={openSignUpModal} 
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
            />
          ) 
        }
        <YesterdaysBets bets={myBetList}/>
      </ScrollView>
    </>
  );
}