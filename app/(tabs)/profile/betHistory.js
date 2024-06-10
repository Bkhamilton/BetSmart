import { StyleSheet, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

import Colors from '@/constants/Colors';
import ChooseBetType from '@/components/Profile/BetHistory/ChooseBetType';

export default function SettingsScreen() {
    
    const { iconColor } = useTheme();

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
          <View style={{ flex: 0.2, }}>
            <TouchableOpacity 
              onPress={handleClose}
            >
              <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
            </TouchableOpacity>  
          </View>
          <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>All Bets</Text>
          </View>
          <View style={{ flex: 0.2 }}>

          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
