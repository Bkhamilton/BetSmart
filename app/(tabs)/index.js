import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'expo-router';
import { RefreshControl } from 'react-native';
import { ScrollView } from '@/components/Themed';
import { myBetList } from '@/data/exampleBetData';
import useTheme from '@/hooks/useTheme';
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
import { insertBalance, updateBalance, updateUserBalance } from '@/db/user-specific/Balance';
import { getUser } from '@/db/user-specific/Users';
import { insertTransaction, getTransactionsByUser } from '@/db/user-specific/Transactions';
import { insertUserSession } from '@/db/user-specific/UserSessions';
import { getOpenBetSlips } from '@/db/betslips/BetSlips';

import { confirmBetResults } from '@/utils/dbHelpers';
import useModalHome from '@/hooks/useModalHome';
import useConfirmationState from '@/hooks/useConfirmationState';
import ConfirmMessage from '@/components/Modals/ConfirmMessage';

export default function HomeScreen() {

  const db = useSQLiteContext();

  const { user, setUserBalance, trigger, setTrigger, userBalance, setBookie } = useContext(UserContext);

  const {
    loginModalVisible,
    signUpModalVisible,
    transactionModalVisible,
    confirmModalVisible,
    chooseBookieModalVisible,
    addBookieModalVisible,
    confirmMessageModalVisible,
    transactionTitle,
    transactionBookie,
    transactionBookieId,
    userTransactions, setUserTransactions,
    confirmedBetSlip,
    betSlips, setBetSlips,
    openConfirmMessageModal,
    closeConfirmMessageModal,
    openAddBookieModal,
    closeAddBookieModal,
    openChooseBookieModal,
    closeChooseBookieModal,
    openSignUpModal,
    closeSignUpModal,
    openLoginModal,
    closeLoginModal,
    openConfirmModal,
    closeConfirmModal,
    openTransactionModal,
    closeTransactionModal,
    selectBookie,
  } = useModalHome();

  const { confirmMessage, setMessage, confirmCallback, setCallback } = useConfirmationState();

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

  const router = useRouter();

  const handleBetHistory = () => {
    router.replace('profile/betHistory');
  };

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

  useEffect(() => {
    if (user) {
      getTransactionsByUser(db, user.id).then((transactions) => {
        setUserTransactions(transactions);
      });
    }
  }, [user]);

  const confirmTransaction = (bookieId, title, initialAmount, transactionAmount, updatedBalance) => {
    updateBalance(db, bookieId, updatedBalance, user.id).then(() => {
      setUserBalance(prevBalances => 
        prevBalances.map(item => 
          item.bookieId === bookieId ? { ...item, balance: Number(updatedBalance) } : item
        )
      );
    });
    const timestamp = new Date().toISOString();
    const description = `${title} for ${transactionAmount} with ${transactionBookie}`;
    insertTransaction(db, bookieId, user.id, title, initialAmount, transactionAmount, updatedBalance, timestamp, description);
    getTransactionsByUser(db, user.id).then((transactions) => {
      setUserTransactions(transactions);
    });
  }

  const onConfirmTransaction = (bookieId, title, initialAmount, transactionAmount, updatedBalance) => {
    confirmTransaction(bookieId, title, initialAmount, transactionAmount, updatedBalance);
    closeTransactionModal();
  }

  const onConfirmBetSlip = (betSlip) => {
    confirmBetResults(db, betSlip, user);

    closeConfirmModal();

    setTriggerFetch(prev => !prev);
    setTrigger(prev => !prev);
  }

  const addBookie = (bookie) => {
    insertBalance(db, bookie.id, 0, user.id).then(() => {
      setUserBalance(prevBalances => [...prevBalances, { bookieId: bookie.id, bookieName: bookie.name, balance: 0 }]);
    });
    closeAddBookieModal();
  }; 

  const handleConfirm = (response) => {
    if (confirmCallback) {
      confirmCallback(response);
    }
    closeConfirmMessageModal();
  };

  const onAddBookie = async (bookie) => {
    closeAddBookieModal();
    setMessage(`add ${bookie.name} as a bookie?`);
    openConfirmMessageModal();

    const response = await new Promise((resolve) => {
      setCallback(() => resolve);
    });

    if (response) {
      addBookie(bookie);
    }
  };

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
        bookieId={transactionBookieId}
        onConfirm={onConfirmTransaction}
      />
      <AddBookie
        visible={addBookieModalVisible}
        close={closeAddBookieModal}
        addBookie={onAddBookie}
      />
      <ConfirmMessage
        visible={confirmMessageModalVisible}
        close={closeConfirmMessageModal}
        message={confirmMessage}
        confirm={handleConfirm}
      />
      {
        user && userBalance && (
          <ChooseBookie 
            visible={chooseBookieModalVisible} 
            close={closeChooseBookieModal} 
            selectBookie={selectBookie}
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