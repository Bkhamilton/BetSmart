import { StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, Pressable, ScrollView } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '@/data/teamAbbreviations';
import CategorySlider from '@/components/PlaceBet/BetDetails/CategorySlider';
import IntroInfo from '@/components/PlaceBet/BetDetails/IntroInfo';
import draftkings from '@/assets/images/DraftKings.png';
import { useSQLiteContext } from 'expo-sqlite';
import { getBalance, getAllUsers, getUser, updateBalance } from '@/api/sqlite';
import useTheme from '@/hooks/useTheme';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import ChooseBookie from '@/components/Modals/ChooseBookie';

export default function BetDetailsScreen() {
  const { league, currentGame, setBookie } = useContext(BetContext);
  const router = useRouter();

  const db = useSQLiteContext();

  const [userBalance, setUserBalance] = useState([{ Bookie: 'DraftKings', Balance: 0 }, { Bookie: 'FanDuel', Balance: 0 }])
  const [userID, setUserID] = useState(1);

  const [chooseBookieModal, setChooseBookieModal] = useState(false);

  const openBookieModal = () => {
    setChooseBookieModal(true);
  }

  const closeBookieModal = () => {
    setChooseBookieModal(false);
  }

  const selectBookie = (bookie) => {
    setChooseBookieModal(false);
    setBookie(bookie);
  }

  const handleClose = () => {
    router.navigate('newBet/selectGame');
  };

  // Object mapping sports to their respective abbreviation objects
  const sportAbbreviations = {
      nba: nbaTeamAbbreviations,
      mlb: mlbTeamAbbreviations,
      nhl: nhlTeamAbbreviations,
  };

  // Function to get the abbreviation for a team name
  const getTeamAbbreviation = (teamName, sport) => {
      const abbreviations = sportAbbreviations[sport.toLowerCase()];
      return abbreviations ? (abbreviations[teamName] || teamName) : teamName;
  }

  const { mainGreen, iconColor } = useTheme();

  useEffect(() => {
    getBalance(db, userID).then((balance) => {
      setUserBalance(balance);
    });
  }, []);
  
  const GameHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={{ flex: 0.3 }}>
          <TouchableOpacity onPress={handleClose}>
            <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'flex-start', marginLeft: -10, }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{league}</Text>
        </View>
        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <BalanceBox userBalance={userBalance} openModal={openBookieModal}/>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <ChooseBookie
        userBalance={userBalance}
        visible={chooseBookieModal}
        close={closeBookieModal}
        selectBookie={selectBookie}
      />
      <GameHeader />
      <ScrollView>
        <IntroInfo currentGame={currentGame} />
        <CategorySlider />
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
    paddingLeft: 20,
    paddingRight: 10, 
    paddingTop: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});