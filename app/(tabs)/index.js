import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, View, ScrollView } from '@/components/Themed';
import { myBetList, playoffBets } from '@/data/exampleBetData';
import ProfitDashboard from '@/components/Home/ProfitDashboard/ProfitDashboard';
import LoginPage from '@/components/Modals/LoginPage';
import SignUpPage from '@/components/Modals/SignUpPage';
import YesterdaysBets from '@/components/Home/BetReview/YesterdaysBets';
import TodaysBets from '@/components/Home/BetReview/TodaysBets';
import TransactionModal from '@/components/Modals/TransactionModal';
import { UserContext } from '@/contexts/UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import { getBalanceByUser, updateBalance } from '@/db/user-specific/Balance';
import { getAllBookies, getBookies } from '@/db/general/Bookies';
import { getUser } from '@/db/user-specific/Users';
import { insertTransaction, getTransactionsByUser } from '@/db/user-specific/Transactions';
import { insertUserSession } from '@/db/user-specific/UserSessions';
import useTheme from '@/hooks/useTheme';
import HomeHeader from '@/components/Home/HomeHeader';
import OpenBets from '../../components/Home/BetReview/OpenBets';
import { fillBetSlips } from '@/contexts/BetContext/betSlipHelpers';
import { getOpenBetSlips } from '@/db/betslips/BetSlips';
import ConfirmBetSlip from '../../components/Modals/ConfirmBetSlip';

export default function HomeScreen() {

  const db = useSQLiteContext();

  const { user, setUserBalance } = useContext(UserContext);

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [transactionTitle, setTransactionTitle] = useState('Deposit');
  const [transactionBookie, setTransactionBookie] = useState('DraftKings');
  const [transactionBookieId, setTransactionBookieId] = useState(1);

  const [confirmedBetSlip, setConfirmedBetSlip] = useState({});
  
  const [userBookies, setUserBookies] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  const [betSlips, setBetSlips] = useState([]);
  
  function openSignUpModal() {
    setSignUpModalVisible(true);
  }
  function closeSignUpModal() {
    setSignUpModalVisible(false);
  }

  function openLoginModal() {
    setLoginModalVisible(true);
  }
  function closeLoginModal() {
    setLoginModalVisible(false);
  }
  function openConfirmModal(betSlip) {
    setConfirmedBetSlip(betSlip);
    setConfirmModalVisible(true);
  }
  function closeConfirmModal() {
    setConfirmModalVisible(false);
  }

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

  function updateTransactionInfo(title, balance, bookie) {
    setTransactionTitle(title);
    setTransactionBookie(bookie);
    const curBookie = userBookies.find(item => item.name === bookie);
    setTransactionBookieId(curBookie.id);
    setUserBalance(balance);
  }

  function openTransactionModal(type, balance, bookie) {
    updateTransactionInfo(type, balance, bookie);
    setTransactionModalVisible(true);
  }
  function closeTransactionModal() {
    setTransactionModalVisible(false);
  }

  const router = useRouter();

  const handleBetHistory = () => {
    router.navigate('profile/betHistory');
  };

  useEffect(() => {
    getAllBookies(db).then((bookies) => {
      setUserBookies(bookies);
    });
  }, []);

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
  }, []);

  useEffect(() => {
    if (user) {
      getTransactionsByUser(db, user.id).then((transactions) => {
        setUserTransactions(transactions);
      });
    }
  }, [user]);

  const onConfirmTransaction = (bookieId, title, initialAmount, transactionAmount, updatedBalance) => {
    updateBalance(db, bookieId, updatedBalance, user.id).then(() => {
      setUserBalance(prevBalances => 
        prevBalances.map(item => 
          item.bookieId === bookieId ? { ...item, balance: Number(updatedBalance) } : item
        )
      );
      closeTransactionModal();
    });
    const timestamp = new Date().toISOString();
    const description = `${title} for ${transactionAmount} with ${transactionBookie}`;
    insertTransaction(db, bookieId, user.id, title, initialAmount, transactionAmount, updatedBalance, timestamp, description)
    getTransactionsByUser(db, user.id).then((transactions) => {
      setUserTransactions(transactions);
    });
  }

  // Dummy data for ProfitDashboard
  const amountWon = 240.00;
  const amountWagered = 120.00;

  return (
    <>
      <LoginPage visible={loginModalVisible} close={closeLoginModal} login={login}/>
      <SignUpPage visible={signUpModalVisible} close={closeSignUpModal}/>
      <TransactionModal 
        visible={transactionModalVisible} 
        close={closeTransactionModal}
        title={transactionTitle}
        bookie={transactionBookie}
        bookieId={transactionBookieId}
        onConfirm={onConfirmTransaction}
      />
      {
        confirmedBetSlip && confirmedBetSlip.bets && (
          <ConfirmBetSlip
            visible={confirmModalVisible}
            close={closeConfirmModal}
            betSlip={confirmedBetSlip}
          />
        )
      }
      <HomeHeader history={handleBetHistory} login={openLoginModal} signup={openSignUpModal} />
      <ScrollView
        showVerticalScrollIndicator={false}
      >
        <ProfitDashboard 
          wagered={amountWagered} 
          won={amountWon} 
          openTransaction={openTransactionModal} 
          bookies={userBookies}
          transactions={userTransactions}
        />
        { betSlips && betSlips.length > 0 && <OpenBets betSlips={betSlips} confirm={openConfirmModal}/> }
        <YesterdaysBets bets={myBetList}/>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
