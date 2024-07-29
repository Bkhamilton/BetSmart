import { StyleSheet, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllBetSlips } from '@/db/user-specific/BetSlips';
import { getAllParticipantBets } from '@/db/user-specific/ParticipantBets';
import { getAllLegs } from '@/db/user-specific/Legs';
import useTheme from '@/hooks/useTheme';

import Colors from '@/constants/Colors';
import ChooseBetType from '@/components/Profile/BetHistory/ChooseBetType';

export default function SettingsScreen() {
    
    const { iconColor } = useTheme();

    const db = useSQLiteContext();

    const router = useRouter();

    const handleClose = () => {
      router.navigate('profile/profilePage');
    };

    const [selectedType, setSelectedType] = useState('Today');

    function changeType(type) {
      setSelectedType(type);
    }

    useEffect(() => {
      const fetchBetSlips = async () => {
        try {
          const betSlips = await getAllBetSlips(db);
          console.log('All bet slips:', betSlips);
        } catch (error) {
          console.error('Error fetching bet slips:', error);
        }
      };

      const fetchParticipantBets = async () => {
        try {
          const participantBets = await getAllParticipantBets(db);
          console.log('All participant bets:', participantBets);
        } catch (error) {
          console.error('Error fetching participant bets:', error);
        }
      };

      const fetchLegs = async () => {
        try {
          const legs = await getAllLegs(db);
          console.log('All legs:', legs);
        } catch (error) {
          console.error('Error fetching legs:', error);
        }
      };

      fetchBetSlips();
      fetchParticipantBets();
      fetchLegs();
    }, []);

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
