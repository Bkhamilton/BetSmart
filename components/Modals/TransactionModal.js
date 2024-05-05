import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';

export default function TransactionModal({ visible, close, title, bookie, balance, onConfirm  }) {

  var selectedBookie = balance.find(item => item.bookie === bookie);
  if (!selectedBookie) {
    const totalBalance = balance.reduce((sum, item) => sum + item.balance, 0);
    selectedBookie = { bookie: 'Total', balance: totalBalance };
  }
  const initialAmount = selectedBookie.balance;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={close}
      style={styles.modalContainer}
    >
      <View style={styles.container}>
        {/* Main Modal Box */}
        <View style={styles.mainPage}>
          {/* Title */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity 
              onPress={close}
            >
              <FontAwesome name='close' size={40} color={'red'}/>
            </TouchableOpacity>
          </View>
          <View style={styles.underline}></View>
          
          {/* Bookie */}
          <View style={[styles.infoBox, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={styles.BoxTitle}>{bookie}</Text>
            <View style={styles.inputBox}>
              <Text>{initialAmount}</Text>
            </View>
          </View>
          <View style={styles.underline}></View>

          {/* Amount */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.BoxTitle}>Amount</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Amount"
                // Add necessary props and event handlers for amount input
              />
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirm}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: 'green',
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
});