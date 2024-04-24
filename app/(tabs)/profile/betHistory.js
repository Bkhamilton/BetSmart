import { StyleSheet, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import ChooseBetType from '@/components/Profile/BetHistory/ChooseBetType';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();

    const iconColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;

    const router = useRouter();

    const handleClose = () => {
      router.navigate('profile/profilePage');
    };

    const [selectedType, setSelectedType] = useState('Today');

    function changeType(type) {
      setSelectedType(type);
    }

    return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={handleClose}
          >
            <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>        
        </View>
        <ChooseBetType selectType={changeType} type={selectedType}/>
        <ScrollView>
          
        </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 84, 
    paddingHorizontal: 20, 
    paddingTop: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  settingsHeader: {
    paddingHorizontal: 20, 
    paddingTop: 48, 
    paddingBottom: 40
  },
  settingsHeaderText: {
    fontSize: 38, 
    fontWeight: 'bold'
  },
  accountHeader: {
    paddingHorizontal: 20, 
    paddingVertical: 12
  },
  accountHeaderText: {
    fontSize: 24, 
    fontWeight: '500'
  },
});
