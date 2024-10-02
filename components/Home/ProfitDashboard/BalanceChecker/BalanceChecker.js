import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import useTheme from '@/hooks/useTheme';
import { getTransactionsByUser } from '@/db/user-specific/Transactions';
import BankButtons from './BankButtons';
import RecentTransactions from './RecentTransactions';

export default function BalanceChecker({ openTransaction, openChooseBookie, transactions }) {

    const { user, userBalance, bookie, setBookie } = useContext(UserContext);

    const { bookieColors, bookieBorderColors } = useTheme();

    // function to switch to next bookieId in userBalance. If at the end of userBalance, switch to Total. If at Total, switch back to userBalance[0]
    const switchBookie = (bookieId) => {
      const bookieIndex = userBalance.findIndex(item => item.bookieId === bookieId);
      if (bookieIndex === userBalance.length - 1) {
        setBookie({ id: 0, name: 'Total' });
      } else {
        setBookie({ id: userBalance[bookieIndex + 1].bookieId, name: userBalance[bookieIndex + 1].bookieName });
      }
    };

    const selectTransaction = (type) => {
        openTransaction(type, userBalance, bookie.name);
    };
    
    const balanceValue = bookie.name === 'Total' 
      ? userBalance?.reduce((total, item) => total + item.balance, 0) 
      : userBalance?.find(item => item.bookieId === bookie.id)?.balance || 0;

    const RecentTransactionsEmpty = () => {
      return (
        <View style={[styles.box, { flex: 0.26 }]}>

        </View>
      );
    }

    return (
      <Pressable 
        style={({pressed}) => ({
          ...styles.centeredBox,
          backgroundColor: bookieColors[bookie.name],
          borderColor: bookieBorderColors[bookie.name],
          opacity: pressed ? 0.8 : 1,
        })}
        onPress={openChooseBookie}
      >
        <BankButtons
          selectBookie={switchBookie}
          openTransaction={selectTransaction}
          bookie={bookie}
        />
        <View style={styles.centerBox}>
          <Text>{bookie.name.toUpperCase()} BALANCE</Text>
          <Text style={[styles.bigMoneyText, { marginTop: 8 }]}>
            ${balanceValue.toFixed(2)}
          </Text>
        </View>
        { 
          transactions.length > 0 ? 
            <RecentTransactions transactions={transactions} bookieId={bookie.id}/> 
              :  
            <RecentTransactionsEmpty /> 
        }
      </Pressable>
    );
  }

const styles = StyleSheet.create({
  centeredBox: {
      flexDirection: 'row',
      alignItems: 'center', 
      marginHorizontal: 10,
      marginTop: 12,
      borderWidth: 1, 
      justifyContent: 'center',
      borderRadius: 8,
  },
  box: {
      backgroundColor: 'transparent'
  },
  centerBox: {
      flex: 0.46,
      paddingTop: 28,
      paddingBottom: 24, 
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  bigMoneyText: {
      fontSize: 32,
      fontWeight: 'bold',
  },
  moneyText: {
      fontSize: 24,
      fontWeight: 'bold',
  },
  dollarContainer: {
      alignItems: 'center', 
      justifyContent: 'center',
      height: 100, 
      width: 100, 
      borderRadius: 55, 
      transform: [{ translateY: 20 }],
      opacity: 0.3,
      backgroundColor: 'transparent',
      zIndex: 1,
  },
});