import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity, Text, View, Modal } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function TransactionModal({ title, initialAmount, onConfirm  }) {
  return (
    <Modal>
        <Text>{title}</Text>
        <TextInput value={amount} onChangeText={setAmount} />
        <TouchableOpacity 
            onPress={handleConfirm}
            >
            <Text>Confirm</Text>
        </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 1,
  },
});