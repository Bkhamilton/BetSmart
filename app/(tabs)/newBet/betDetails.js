import { StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, Pressable, ScrollView } from '@/components/Themed';
import Header from '@/components/Header/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect, useContext } from 'react';
import { BetContext } from '@/contexts/BetContext';
import IntroInfo from '@/components/PlaceBet/BetDetails/IntroInfo';
import { useSQLiteContext } from 'expo-sqlite';
import { getBalance } from '@/db/user-specific/Balance';
import { getAllBookies } from '@/db/general/Bookies';
import { getLeaguePropsForLeague } from '@/db/bet-general/LeagueProps';
import { getLeagueByName } from '@/db/general/Leagues';
import useTheme from '@/hooks/useTheme';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import LeaguePropSlider from '@/components/PlaceBet/BetDetails/LeaguePropSlider';
import LeaguePropInfo from '@/components/PlaceBet/BetDetails/LeaguePropInfo';

export default function BetDetailsScreen() {
   
  const { league, currentGame, setBookie, setBookieId } = useContext(BetContext);
  const router = useRouter();

  const db = useSQLiteContext();

  const [userBalance, setUserBalance] = useState([]);
  const [leagueProps, setLeagueProps] = useState([]); // [ { id: 0, leagueId: 0, propName: '' }
  const [bookies, setBookies] = useState([{ id: 0, name: '', description: ''}]);
  const [userID, setUserID] = useState(1);

  const [curLeagueProp, setCurLeagueProp] = useState('Popular');

  const [chooseBookieModal, setChooseBookieModal] = useState(false);

  const openBookieModal = () => {
    setChooseBookieModal(true);
  }

  const closeBookieModal = () => {
    setChooseBookieModal(false);
  }

  const selectBookie = (bookie) => {
    setChooseBookieModal(false);
    setBookie(bookie.name);
    setBookieId(bookie.id);
  }

  const handleClose = () => {
    router.navigate('newBet/selectGame');
  };

  const selectLeagueProp = (prop) => {
    setCurLeagueProp(prop);
  };

  const { mainGreen, iconColor } = useTheme();

  useEffect(() => {
    getBalance(db, userID).then((balance) => {
      setUserBalance(balance);
    });
    getAllBookies(db).then((bookies) => {
      setBookies(bookies);
    });
    getLeagueByName(db, league).then((league) => {
      getLeaguePropsForLeague(db, league.id).then((props) => {
        const sortedProps = props.sort((a, b) => a.id - b.id);
        setLeagueProps(sortedProps);
      });
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
        bookies={bookies}
        visible={chooseBookieModal}
        close={closeBookieModal}
        selectBookie={selectBookie}
      />
      <GameHeader />
      <ScrollView>
        <IntroInfo currentGame={currentGame} />
        {
          leagueProps.length > 0 &&
          <>
            <LeaguePropSlider 
              leagueProps={leagueProps}
              selectLeagueProp={selectLeagueProp}
              curLeagueProp={curLeagueProp}
            />
            <LeaguePropInfo 
              leagueProp={curLeagueProp}
            />
          </>

        }
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