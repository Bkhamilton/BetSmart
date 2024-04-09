import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView } from '@/components/Themed';
import { myBetList } from '../../data/exampleBetData';
import Header from '../../components/Header/Header';
import ProfitDashboard from '../../components/Home/ProfitDashboard';
import LoginPage from '../../components/Modals/LoginPage';
import SignUpPage from '../../components/Modals/SignUpPage';
import TodaysBets from '../../components/Home/BetView/TodaysBets';
import BetView from '../../components/Home/BetView/BetView';

export default function HomeScreen() {

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false)
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

  // Dummy data for ProfitDashboard
  const amountWon = 240.00;
  const amountWagered = 120.00;

  return (
    <View style={styles.container}>
      <LoginPage visible={loginModalVisible} close={closeLoginModal}/>
      <SignUpPage visible={signUpModalVisible} close={closeSignUpModal}/>
      <Header title={'BetSmart'}>
        
        <TouchableOpacity
          onPress={openLoginModal}
        >
          <Ionicons name='person' size={28} color={'black'}/>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={openSignUpModal}
        >
          <Ionicons name='person-add' size={28} color={'black'}/>
        </TouchableOpacity>
        
      </Header>
      <ScrollView>
        <StatusBar style="auto" backgroundColor='transparent'/>
        <ProfitDashboard wagered={amountWagered} won={amountWon} />
        <BetView bets={myBetList}/>
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
