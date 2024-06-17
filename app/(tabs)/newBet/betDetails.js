import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import IntroInfo from '@/components/PlaceBet/BetDetails/IntroInfo';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import LeaguePropSlider from '@/components/PlaceBet/BetDetails/LeaguePropSlider';
import LeaguePropInfo from '@/components/PlaceBet/BetDetails/LeaguePropInfo';
import { getBalance } from '@/db/user-specific/Balance';
import { getAllBookies } from '@/db/general/Bookies';
import { getLeaguePropsForLeague } from '@/db/bet-general/LeagueProps';
import { getLeaguePropInfo } from '@/db/bet-general/LeaguePropsInfo';
import { getLeagueByName } from '@/db/general/Leagues';
import useTheme from '@/hooks/useTheme';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';

export default function BetDetailsScreen() {
   
  const { league, currentGame, setBookie, setBookieId, betSlip } = useContext(BetContext);

  const { bookies } = useContext(DBContext);

  const router = useRouter();

  const db = useSQLiteContext();

  const [leagueProps, setLeagueProps] = useState([]); // [ { id: 0, leagueId: 0, propName: '' }
  const [leaguePropInfo, setLeaguePropInfo] = useState([]); // [ { id: 0, leagueId: 0, propName: '', propValue: '' }

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

  const { mainGreen, iconColor, grayBorder } = useTheme();

  useEffect(() => {
    getLeaguePropsForLeague(db, league.id).then((props) => {
      const sortedProps = props.sort((a, b) => a.id - b.id);
      setLeagueProps(sortedProps);
    });
  }, []);

  useEffect(() => {
    if (curLeagueProp) {
      getLeaguePropInfo(db, league.id, curLeagueProp).then((info) => {
        const sortedInfo = info.sort((a, b) => a.id - b.id);
        setLeaguePropInfo(sortedInfo);
      });
    }
  }, [curLeagueProp]);
  
  const GameHeader = () => {
    return (
      <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
        <View style={{ flex: 0.3 }}>
          <TouchableOpacity onPress={handleClose}>
            <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'flex-start', marginLeft: -10, }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{league.leagueName}</Text>
        </View>
        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <BalanceBox openModal={openBookieModal}/>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <ChooseBookie
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
              leaguePropInfo={leaguePropInfo}
            />
          </>
        }
      </ScrollView>
      {
        betSlip &&
        <BetSlipBanner
          betSlip={betSlip}
          onPress={() => console.log(JSON.stringify(betSlip, null, 2))}
        />
      }
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