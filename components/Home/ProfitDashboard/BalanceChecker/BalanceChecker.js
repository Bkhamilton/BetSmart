import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { useSQLiteContext } from 'expo-sqlite';
import useTheme from '@/hooks/useTheme';
import { getTransactionsByUser } from '@/db/user-specific/Transactions';
import BankButtons from './BankButtons';
import RecentTransactions from './RecentTransactions';

export default function BalanceChecker({ openTransaction, openChooseBookie }) {

    const { user, userBalance } = useContext(UserContext);

    const db = useSQLiteContext();

    const { mainGreen, mainBlue, accentBlue } = useTheme();

    const [bookie, setBookie] = useState('DraftKings');
    const [bookieId, setBookieId] = useState(1);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (user) {
          getTransactionsByUser(db, user.id).then((transactions) => {
            setTransactions(transactions);
          });
        }
    }, [user]);

    const selectBookie = () => {
      setBookie((prevBookie) => {
        let newBookie;
        let newBookieId;
        if (prevBookie === 'DraftKings') {
          newBookie = 'FanDuel';
          newBookieId = 2;
        } else if (prevBookie === 'FanDuel') {
          newBookie = 'Total';
          newBookieId = 0;
        } else {
          newBookie = 'DraftKings';
          newBookieId = 1;
        }

        setBookieId(newBookieId);
    
        return newBookie;
      });
    };

    const selectTransaction = (type) => {
        openTransaction(type, userBalance, bookie);
    };

    const bookieColors = {
      DraftKings: {
        backgroundColor: mainGreen,
        borderColor: mainGreen,
      },
      FanDuel: {
        backgroundColor: mainBlue,
        borderColor: accentBlue,
      },
      Total: {
        backgroundColor: mainGreen,
        borderColor: mainGreen,
      },
    }
    
    const balanceValue = bookie === 'Total' 
      ? userBalance?.reduce((total, item) => total + item.balance, 0) 
      : userBalance?.find(item => item.bookieId === bookieId)?.balance || 0;

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
          backgroundColor: bookieColors[bookie].backgroundColor,
          borderColor: bookieColors[bookie].borderColor,
          opacity: pressed ? 0.8 : 1,
        })}
        onPress={openChooseBookie}
      >
        <BankButtons
          selectBookie={selectBookie}
          openTransaction={selectTransaction}
          bookie={bookie}
        />
        <View style={styles.centerBox}>
          <Text>{bookie.toUpperCase()} BALANCE</Text>
          <Text style={[styles.bigMoneyText, { marginTop: 8 }]}>
            ${balanceValue.toFixed(2)}
          </Text>
        </View>
        { 
          transactions.length > 0 ? 
            <RecentTransactions transactions={transactions} bookieId={bookieId}/> 
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