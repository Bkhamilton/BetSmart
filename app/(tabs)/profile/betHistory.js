import { StyleSheet, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { getTodaysBetSlips } from '@/db/user-specific/BetSlips';
import { getAllValidParticipantBets } from '@/db/user-specific/ParticipantBets';
import { getAllValidLegs } from '@/db/user-specific/Legs';
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

    const [betSlips, setBetSlips] = useState([]);

    function changeType(type) {
      setSelectedType(type);
    }

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;  

    useEffect(() => {
      const fetchData = async () => {
        try {
          const betSlips = await getTodaysBetSlips(db, formattedToday);
          const betSlipIds = betSlips.map(betSlip => betSlip.id);
          const participantBets = await getAllValidParticipantBets(db, betSlipIds);
          const participantBetIds = participantBets.map(participantBet => participantBet.id);
          const legs = await getAllValidLegs(db, participantBetIds);
  
          // Add legs to participantBets
          const participantBetsWithLegs = participantBets.map(participantBet => ({
            ...participantBet,
            legs: legs.filter(leg => leg.participantBetId === participantBet.id)
          }));
    
          // Add participantBets to betSlips
          const betSlipsWithBets = betSlips.map(betSlip => ({
            ...betSlip,
            bets: participantBetsWithLegs.filter(participantBet => participantBet.betSlipId === betSlip.id)
          }));
    
          setBetSlips(betSlipsWithBets);
          console.log('Today\'s bet slips with bets and legs:', JSON.stringify(betSlipsWithBets, null, 2));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
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
