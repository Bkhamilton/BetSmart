import React, { useContext } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';
import BankButtons from './BankButtons';
import RecentTransactions from './RecentTransactions';

export default function BalanceChecker({ openTransaction, openChooseBookie, transactions }) {

    const { userBalance, bookie, setBookie } = useContext(UserContext);

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
      openTransaction(type, bookie);
    };
    
    const balanceValue = bookie.name === 'Total' 
      ? userBalance?.reduce((total, item) => total + item.balance, 0) 
      : userBalance?.find(item => item.bookieId === bookie.id)?.balance || 0;

    const RecentTransactionsEmpty = () => {
      return (
        <ClearView style={{ flex: 0.26 }}>

        </ClearView>
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
        <ClearView style={styles.centerBox}>
          <Text>{bookie.name.toUpperCase()} BALANCE</Text>
          <Text style={[styles.bigMoneyText, { marginTop: 8 }]}>
            ${balanceValue.toFixed(2)}
          </Text>
        </ClearView>
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
  centerBox: {
    flex: 0.46,
    paddingTop: 28,
    paddingBottom: 24, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigMoneyText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});