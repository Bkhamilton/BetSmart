import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import Colors from '@/constants/Colors';
import draftkings from '@/assets/images/DraftKings.png';
import fanduel from '@/assets/images/FanDuel.jpg';

export default function TransactionModal({ visible, close, title, bookie, initialAmount, onConfirm  }) {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={close}
      style={styles.modalContainer}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={close}
          style={{ alignItems: 'flex-end'}} 
        >
          <FontAwesome name='close' size={40} color={'red'}/>
        </TouchableOpacity>

        {/* Main Modal Box */}
        <View style={styles.mainPage}>
          {/* Title */}
          <View style={styles.title}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.underline}></View>
          </View>
          
          {/* Bookie */}
          <View style={styles.infoBox}>
            <Text style={styles.BoxTitle}>Bookie</Text>
            <View style={styles.inputBox}>
              <Text>{bookie}</Text>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.infoBox}>
            <Text style={styles.BoxTitle}>Amount</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                value={initialAmount}
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
    borderBottomColor: Colors.primary,
    width: '100%',
    marginVertical: 10,
  },
  infoBox: {
    marginVertical: 10,
  },
  BoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
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