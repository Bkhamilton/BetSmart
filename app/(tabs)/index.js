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
import useTheme from '@/hooks/useTheme';
import HomeHeader from '../../components/Home/HomeHeader';

export default function HomeScreen() {

  const db = useSQLiteContext();

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  const [transactionTitle, setTransactionTitle] = useState('Deposit');
  const [transactionBookie, setTransactionBookie] = useState('DraftKings');
  const [userBalance, setUserBalance] = useState([{ Bookie: 'DraftKings', Balance: 0 }, { Bookie: 'FanDuel', Balance: 0 }])
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
  }, []);

  const onConfirmTransaction = (bookie, updatedBalance) => {
    updateBalance(db, bookie, updatedBalance, userID).then(() => {
      setUserBalance(prevBalances => 
        prevBalances.map(item => 
          item.Bookie === bookie ? { ...item, Balance: Number(updatedBalance) } : item
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
        balance={userBalance}
        onConfirm={onConfirmTransaction}
      />
      <HomeHeader history={handleBetHistory} login={openLoginModal} signup={openSignUpModal} />
      <ScrollView
        showVerticalScrollIndicator={false}
      >
        <ProfitDashboard wagered={amountWagered} won={amountWon} openTransaction={openTransactionModal} balance={userBalance}/>
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
