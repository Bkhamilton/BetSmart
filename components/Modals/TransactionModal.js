import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Image, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';

export default function TransactionModal({ visible, close, title, bookie, balance, onConfirm  }) {

  const [amount, setAmount] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  if (balance) {
    balance = balance.map(item => {
      return {
        Bookie: item.Bookie,
        Balance: Number(item.Balance),
      };
    });
  } else {
    balance = [];
  }

  var selectedBookie = balance.find(item => item.Bookie === bookie);
  if (!selectedBookie) {
    const totalBalance = balance.reduce((sum, item) => sum + item.Balance, 0);
    selectedBookie = { bookie: 'Total', balance: totalBalance };
  }
  const initialAmount = selectedBookie.Balance;

  const bookieImages = {
    'DraftKings': draftkings,
    'FanDuel': fanduel,
  };

  const handleClose = () => {
    setAmount('');
    close();
  };

  const handleConfirm = () => {
    if (amount === '') {
      alert('Please enter an amount');
      return;
    }
  
    // Convert amount to a number
    const numericAmount = Number(amount);
    const numericInitialAmount = Number(initialAmount);
  
    let updatedBalance;
    if (title === 'Withdraw') {
      if (numericAmount > initialAmount) {
        alert('You cannot withdraw more than your current balance');
        return;
      }
      updatedBalance = numericInitialAmount - numericAmount;
    } else if (title === 'Deposit') {
      updatedBalance = numericInitialAmount + numericAmount;
    }

    updatedBalance = Number(updatedBalance.toFixed(2));
  
    onConfirm(bookie, updatedBalance);
    setAmount('');
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={close}
      style={styles.modalContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Main Modal Box */}
          <View style={styles.mainPage}>
            {/* Title */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity 
                onPress={handleClose}
              >
                <FontAwesome name='close' size={40} color={'red'}/>
              </TouchableOpacity>
            </View>
            <View style={styles.underline}></View>
            
            {/* Bookie */}
            <View style={[styles.infoBox, { flexDirection: 'row', justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={styles.inputBox}>
                  <Image source={bookieImages[bookie]} style={{ width: 24, height: 24, borderRadius: 4 }} />
                </View>
                <Text style={[styles.BoxTitle, { marginLeft: 4 }]}>{bookie}</Text>
              </View>
              <View style={styles.inputBox}>
                <Text>{Number(initialAmount).toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.underline}></View>

            {/* Amount */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.BoxTitle}>Amount</Text>
              <View style={styles.inputBox}>
                {amount !== '' && <Text style={styles.sign}>{title === 'Deposit' ? '+' : '-'}</Text>}
                <TextInput
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(text) => {
                    if (/^\d*\.?\d{0,2}$/.test(text)) { // Check if text matches the desired format
                      setAmount(text);
                    }
                  }}
                  maxLength={10}
                  // Add necessary props and event handlers for amount input
                />
              </View>
            </View>
            <View style={styles.underline}></View>
            {/* New Balance */}
            <View style={[styles.infoBox, { flexDirection: 'row', justifyContent: 'space-between' }]}>
              <View>
                
              </View>
              <View>
                <Text>{(selectedBookie.Balance + (title === 'Deposit' ? +amount : -amount)).toFixed(2)}</Text>
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: isLoading ? 'blue' : 'green', }]}
              onPress={() => {
                if (amount === '') {
                  alert('Please enter an amount');
                  return;
                }
                setIsLoading(true);
                handleConfirm();
              }}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPage: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
    marginVertical: 10,
  },
  infoBox: {
    marginVertical: 0,
  },
  BoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  confirmButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sign: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    marginRight: 2,
  },
});