import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';

export default function BankManagement({ transactions }) {
    return (
      <View style={styles.container}>
        <View>
          <Text style={{ fontSize: 16 }}>Transactions</Text>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      borderWidth: 1,
      paddingVertical: 1,
    },
  });
