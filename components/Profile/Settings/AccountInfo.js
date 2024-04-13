import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from '@/components/Themed';

export default function AccountInfo({ onPress }) {
  return (
    <View style={styles.accountContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'transparent' }}>
            <View style={styles.accountImageContainer}/>
            <View style={styles.accountInfoContainer}>
                <Text style={{ fontWeight: '500', fontSize: 18 }}>Username</Text>
                <Text>Profile Settings</Text>
            </View>
        </View>
        <View style={styles.accountArrowContainer}>
            <TouchableOpacity style={{ backgroundColor: 'transparent', paddingHorizontal: 6, paddingVertical: 10 }}>
                <FontAwesome5 name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    accountContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingLeft: 20, 
      paddingVertical: 8,
      backgroundColor: '#F5F5F5',
    },
    accountImageContainer: {
      height: 60, 
      width: 60, 
      borderRadius: 30, 
      borderWidth: 1
    },
    accountInfoContainer: {
      paddingHorizontal: 10,
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    accountArrowContainer: {
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingRight: 12,
    }
  });
  