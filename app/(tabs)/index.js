import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Dimensions } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView } from '@/components/Themed';
import { myBetList, playoffBets } from '@/data/exampleBetData';
import ProfitDashboard from '@/components/Home/Balance/ProfitDashboard';
import LoginPage from '@/components/Modals/LoginPage';
import SignUpPage from '@/components/Modals/SignUpPage';
import YesterdaysBets from '@/components/Home/BetReview/YesterdaysBets';
import TodaysBets from '@/components/Home/BetReview/TodaysBets';
import TransactionModal from '@/components/Modals/TransactionModal';
import { useSQLiteContext } from 'expo-sqlite';
import { createTables } from '@/api/sqlite';
import { getBalance, updateBalance } from '@/db/user-specific/Balance';
import { getAllBookies, getBookies } from '@/db/general/Bookies';
import useTheme from '@/hooks/useTheme';
import HomeHeader from '../../components/Home/HomeHeader';

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

  function updateTransactionInfo(title, balance, bookie) {
    setTransactionTitle(title);
    setTransactionBookie(bookie);
    const bookieId = userBookies.find(item => item.name === bookie)?.bookieId;
    setTransactionBookieId(bookieId);
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
    getBalance(db, userID).then((balance) => {
      setUserBalance(balance);
    });
    getBookies(db, userID).then((bookies) => {
      console.log(bookies);
      setUserBookies(bookies);
    });
  }, []);

  const onConfirmTransaction = (bookieId, updatedBalance) => {
    updateBalance(db, bookieId, updatedBalance, userID).then(() => {
      setUserBalance(prevBalances => 
        prevBalances.map(item => 
          item.bookieId === bookieId ? { ...item, balance: Number(updatedBalance) } : item
        )
      );
      closeTransactionModal();
    });
  }

  // Dummy data for ProfitDashboard
  const amountWon = 240.00;
  const amountWagered = 120.00;

  return (
    <View style={styles.container}>
      <LoginPage visible={loginModalVisible} close={closeLoginModal}/>
      <SignUpPage visible={signUpModalVisible} close={closeSignUpModal}/>
      <TransactionModal 
        visible={transactionModalVisible} 
        close={closeTransactionModal}
        title={transactionTitle}
        bookie={transactionBookie}
        bookieId={transactionBookieId}
        balance={userBalance}
        userBookies={userBookies}
        onConfirm={onConfirmTransaction}
      />
      <HomeHeader history={handleBetHistory} login={openLoginModal} signup={openSignUpModal} />
      <ScrollView
        showVerticalScrollIndicator={false}
      >
        <ProfitDashboard wagered={amountWagered} won={amountWon} openTransaction={openTransactionModal} balance={userBalance} bookies={userBookies}/>
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
