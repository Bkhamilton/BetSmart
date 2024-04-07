import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView } from '@/components/Themed';
import { myBetList } from '../../data/exampleBetData';
import Header from '../../components/Header/Header';
import ProfitDashboard from '../../components/Home/ProfitDashboard';
import TodaysBets from '../../components/Home/BetView/TodaysBets';
import BetView from '../../components/Home/BetView/BetView';

export default function HomeScreen() {

  // Dummy data for ProfitDashboard
  const amountWon = 240.00;
  const amountWagered = 120.00;

  return (
    <View style={styles.container}>
      <Header title={'BetSmart'}/>
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
