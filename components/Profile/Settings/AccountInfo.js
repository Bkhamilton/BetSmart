import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from '@/components/Themed';

import Colors from '@/constants/Colors';

export default function AccountInfo({ onPress }) {
  const colorScheme = useColorScheme();

  const iconColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor = colorScheme === 'dark' ? '#1F1F1F' : '#F5F5F5';
  
  return (
    <View style={[styles.accountContainer, { backgroundColor: backgroundColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: 'transparent' }}>
            <View style={styles.accountImageContainer}/>
            <View style={styles.accountInfoContainer}>
                <Text style={{ fontWeight: '500', fontSize: 18 }}>Username</Text>
                <TouchableOpacity
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Text>Profile Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.accountArrowContainer}>
            <TouchableOpacity style={{ backgroundColor: 'transparent', paddingHorizontal: 6, paddingVertical: 10 }}>
                <FontAwesome5 name="chevron-right" size={24} color={iconColor} />
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
  