import React, { useState } from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';

export default function BalanceChecker({ openTransaction, balance, bookies, transactions }) {

    const { mainGreen, accentGreen, mainBlue, accentBlue, iconColor } = useTheme();

    const [bookie, setBookie] = useState('DraftKings');
    const [bookieId, setBookieId] = useState(1);

    const bookieImages = {
        'DraftKings': draftkings,
        'FanDuel': fanduel,
    };

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
        openTransaction(type, balance, bookie);
    };

    const balanceColor = bookie === 'FanDuel' ? mainBlue : mainGreen;
    const balanceBorderColor = bookie === 'FanDuel' ? accentBlue : mainGreen;
    
    const balanceValue = bookie === 'Total' 
      ? balance?.reduce((total, item) => total + item.balance, 0) 
      : balance?.find(item => item.bookieId === bookieId)?.balance || 0;


    const BankButtons = () => {
      return (
        <View style={[styles.box, { overflow: 'hidden', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, flex: 0.28, }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent', transform: [{ translateY: 8 }] }}>
            <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
              <TouchableOpacity
                onPress={() => selectTransaction('Deposit')}
                style={{ backgroundColor: 'transparent', paddingHorizontal: 10, }}
              >
                <FontAwesome6 name="sack-dollar" size={24} color={iconColor}/>
              </TouchableOpacity>
              <Text style={{ fontSize: 8, opacity: 0.7, fontWeight: '600' }}>Deposit</Text>
            </View>
            <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
              <TouchableOpacity 
                onPress={() => selectTransaction('Withdraw')}
                style={{ backgroundColor: 'transparent', paddingHorizontal: 10 }}
              >
                <FontAwesome6 name="hand-holding-dollar" size={24} color={iconColor}/>
              </TouchableOpacity>
              <Text style={{ fontSize: 8, opacity: 0.7, fontWeight: '600' }}>Withdraw</Text>
            </View>
          </View>
          <TouchableOpacity 
            onLongPress={selectBookie}
            style={[styles.dollarContainer, { borderColor: accentGreen, borderWidth: bookie === 'Total' ? 10 : 2 }]}
          >
            {bookie === 'Total' ? (
              <FontAwesome name="dollar" size={60} color={accentGreen}/>
            ) : (
              <Image source={bookieImages[bookie]} style={{ width: 100, height: 100, borderRadius: 50 }}/>
            )}
          </TouchableOpacity>
        </View>
      );
    };

    const RecentTransactions = () => {
      return (
        <View style={[styles.box, { flex: 0.26 }]}>
          <ScrollView 
            style={{ backgroundColor: 'transparent', flexDirection: 'column-reverse'  }}
            contentContainerStyle={{ 
              alignItems: 'flex-end', 
              justifyContent: 'flex-end', 
              paddingRight: 8,
              paddingBottom: 8,
            }}
          >
            {[...transactions].reverse().map((transaction, index) => (
              <View key={index} style={{ backgroundColor: 'transparent' }}>
                <Text>{transaction.transactionType === 'Deposit' ? '+' : '-'}${transaction.amount}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }

    const RecentTransactionsOld = () => {
      return (
        <View style={[styles.box, { flex: 0.26 }]}>

        </View>
      );
    }

    return (
      <Pressable 
        style={({pressed}) => ({
          ...styles.centeredBox,
          backgroundColor: balanceColor,
          borderColor: balanceBorderColor,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <BankButtons />
        <View style={styles.centerBox}>
            <Text>{bookie.toUpperCase()} BALANCE</Text>
            <Text style={[styles.bigMoneyText, { marginTop: 8 }]}>
              ${balanceValue.toFixed(2)}
            </Text>
        </View>
        {transactions.length > 0 && <RecentTransactions />}
        {transactions.length === 0 && <RecentTransactionsOld />}
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