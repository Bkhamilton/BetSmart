import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Dimensions } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView } from '@/components/Themed';
import { myBetList, playoffBets } from '@/data/exampleBetData';
import Header from '@/components/Header/Header';
import ProfitDashboard from '@/components/Home/ProfitDashboard';
import LoginPage from '@/components/Modals/LoginPage';
import SignUpPage from '@/components/Modals/SignUpPage';
import YesterdaysBets from '@/components/Home/BetReview/YesterdaysBets';
import TodaysBets from '@/components/Home/BetReview/TodaysBets';
import TransactionModal from '@/components/Modals/TransactionModal';

import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  const [transactionTitle, setTransactionTitle] = useState('Deposit');
  const [transactionBookie, setTransactionBookie] = useState('DraftKings');
  const [userBalance, setUserBalance] = useState([]); // [TODO] Replace with actual user balance from API

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

  // Dummy data for ProfitDashboard
  const amountWon = 240.00;
  const amountWagered = 120.00;

  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;

  const HistoryButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} accessibilityLabel="Open Bet History">
      <FontAwesome5 name='history' size={28} color={iconColor} />
    </TouchableOpacity>
  );
  
  const LoginButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} accessibilityLabel="Open Login">
      <Ionicons name='person' size={28} color={iconColor} />
    </TouchableOpacity>
  );
  
  const SignUpButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} accessibilityLabel="Open Sign Up">
      <Ionicons name='person-add' size={28} color={iconColor} />
    </TouchableOpacity>
  );

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
      />
      <Header title={'BetSmart'}>
        <HistoryButton onPress={handleBetHistory} />
        <LoginButton onPress={openLoginModal} />
        <SignUpButton onPress={openSignUpModal} />
      </Header>
      <ScrollView>
        <StatusBar style="auto" backgroundColor='transparent'/>
        <ProfitDashboard wagered={amountWagered} won={amountWon} openTransaction={openTransactionModal}/>
        <TodaysBets bets={playoffBets}/>
        <YesterdaysBets bets={myBetList}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
