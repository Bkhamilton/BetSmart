import React, { useState, useEffect, useCallback } from 'react';
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
import { useSQLiteContext } from 'expo-sqlite';
import { getBalanceByUser, updateBalance } from '@/db/user-specific/Balance';
import { getAllBookies, getBookies } from '@/db/general/Bookies';
import { getUser } from '@/db/user-specific/Users';
import { insertTransaction, getTransactionsByUser } from '@/db/user-specific/Transactions';
import { insertUserSession } from '@/db/user-specific/UserSessions';
import useTheme from '@/hooks/useTheme';
import HomeHeader from '@/components/Home/HomeHeader';

export default function HomeScreen() {

  const db = useSQLiteContext();

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  const [transactionTitle, setTransactionTitle] = useState('Deposit');
  const [transactionBookie, setTransactionBookie] = useState('DraftKings');
  const [transactionBookieId, setTransactionBookieId] = useState(1);
  
  const [userBalance, setUserBalance] = useState([{ bookieId: 1, balance: 0 }, { bookieId: 2, balance: 0 }])
  const [userBookies, setUserBookies] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [userID, setUserID] = useState(1);

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

  useFocusEffect(
    useCallback(() => {
      getTransactionsByUser(db, userID).then((transactions) => {
        setUserTransactions(transactions);
      });
    }, [])
  );

  useEffect(() => {
    getBalanceByUser(db, userID).then((balance) => {
      setUserBalance(balance);
    });
    getAllBookies(db).then((bookies) => {
      setUserBookies(bookies);
    });
  }, []);

  const onConfirmTransaction = (bookieId, title, initialAmount, transactionAmount, updatedBalance) => {
    updateBalance(db, bookieId, updatedBalance, userID).then(() => {
      setUserBalance(prevBalances => 
        prevBalances.map(item => 
          item.bookieId === bookieId ? { ...item, balance: Number(updatedBalance) } : item
        )
      );
      closeTransactionModal();
    });
    const timestamp = new Date().toISOString();
    const description = `${title} for ${transactionAmount} with ${transactionBookie}`;
    insertTransaction(db, bookieId, userID, title, initialAmount, transactionAmount, updatedBalance, timestamp, description).then(() => {
      console.log('Transaction inserted');
    });
    getTransactionsByUser(db, userID).then((transactions) => {
      setUserTransactions(transactions);
    });
  }

  // Dummy data for ProfitDashboard
  const amountWon = 240.00;
  const amountWagered = 120.00;

  return (
    <View style={styles.container}>
      <LoginPage visible={loginModalVisible} close={closeLoginModal} login={login}/>
      <SignUpPage visible={signUpModalVisible} close={closeSignUpModal}/>
      <TransactionModal 
        visible={transactionModalVisible} 
        close={closeTransactionModal}
        title={transactionTitle}
        bookie={transactionBookie}
        bookieId={transactionBookieId}
        balance={userBalance}
        onConfirm={onConfirmTransaction}
      />
      <HomeHeader history={handleBetHistory} login={openLoginModal} signup={openSignUpModal} />
      <ScrollView
        showVerticalScrollIndicator={false}
      >
        <ProfitDashboard 
          wagered={amountWagered} 
          won={amountWon} 
          openTransaction={openTransactionModal} 
          balance={userBalance} 
          bookies={userBookies}
          transactions={userTransactions}
        />
        <TodaysBets bets={playoffBets}/>
        <YesterdaysBets bets={myBetList}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
