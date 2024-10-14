import { useEffect, useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { retrieveGamesDate, retrieveAllGames } from '@/api/prop-odds/games.js';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext'; 
import { UserContext } from '@/contexts/UserContext';
import { removeLeg, updateBetSlipAmounts, updateBetSlipBookie } from '@/contexts/BetContext/betSlipHelpers';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, View } from '@/components/Themed';
import MainButtons from '@/components/PlaceBet/SelectGame/MainButtons';
import GameList from '@/components/PlaceBet/SelectGame/GameList/GameList';
import SportSlider from '@/components/PlaceBet/SelectGame/SportSlider';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import BetSlipModal from '@/components/Modals/BetSlipModal/BetSlipModal';
import SelectLeague from '@/components/Modals/SelectLeague';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import useHookNewBet from '@/hooks/useHookNewBet';
import DatePicker from '@/components/PlaceBet/SelectGame/DatePicker';

export default function SelectGameScreen() {

  const db = useSQLiteContext();

  const { league, setLeague, betSlip, confirmBetSlip } = useContext(BetContext);
  const { leagues } = useContext(DBContext);
  const { setTrigger } = useContext(UserContext);

  const { handleSelectGame } = useRouting();

  const {
    betSlipModalVisible,
    chooseBookieModalVisible,
    openBetSlipModal,
    closeBetSlipModal,
    openChooseBookieModal,
    closeChooseBookieModal,
    selectBookie,
    removeProp,
    removeBetSlip,
    confirmBet,
  } = useHookNewBet();

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedToday);

  const [header, setHeader] = useState('Place Bet');

  const [allSportsData, setAllSportsData] = useState([]);
  const [leagueSelected, setLeagueSelected] = useState(false);

  const [totalLegs, setTotalLegs] = useState(0);

  const [selectLeagueModal, setSelectLeagueModal] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setTrigger(prev => !prev);

    setRefreshing(false);
  }

  const openSelectLeagueModal = () => {
    setSelectLeagueModal(true);
  }

  const closeSelectLeagueModal = () => {
    setSelectLeagueModal(false);
  }

  const selectLeague = (newLeague) => {
    if (league?.leagueName === newLeague.leagueName) {
      setLeague({});
      setHeader('Place Bet');
      setLeagueSelected(false);
    } else {
      setLeague(newLeague);
      setHeader(newLeague.leagueName);
      setLeagueSelected(true);
    }
  }

  const onConfirmBet = (wager, winnings, bookieId) => {
    confirmBet(wager, winnings, bookieId);
    onRefresh();
  }

  const updateDate = (direction) => {
    const currentDate = new Date(date); // Get the current date

    // Check the direction parameter
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate()); // Set the date to the previous day
    } else if (direction === 'next') {
      currentDate.setDate(currentDate.getDate() + 2); // Set the date to the next day
    } else {
      console.log('Invalid direction parameter. Please use "prev" or "next".');
      return; // Exit the function if the direction parameter is invalid
    }

    // Update the date state with the new date
    setDate(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`);
  }

  useEffect(() => {
    const fetchSportsData = async () => {
      retrieveAllGames(db, date).then((games) => {
        setAllSportsData(games);
      });
    };
  
    fetchSportsData();
  }, [date]);

  const curLeagueData = allSportsData?.find(sportData => sportData.sport === league?.leagueName);
  const curLeagueGames = curLeagueData ? curLeagueData.data : [];

  const { grayBorder, iconColor } = useTheme();

  const SelectGameHeader = () => {
    return (
      <View style={[styles.headerContainer, { borderColor: grayBorder }]}>
        <View style={{ flex: 0.3 }}>
          
        </View>
        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{header}</Text>
        </View>
        <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <BalanceBox openModal={openChooseBookieModal}/>
        </View>
      </View>
    );
  }

  return (
    <>
      <SelectGameHeader />
      <ChooseBookie
        visible={chooseBookieModalVisible}
        close={closeChooseBookieModal}
        selectBookie={selectBookie}
      />
      {
        betSlip && (
          <BetSlipModal
            visible={betSlipModalVisible}
            close={closeBetSlipModal}
            removeProp={removeProp}
            removeBetSlip={removeBetSlip}
            confirm={onConfirmBet}
          />
        )
      }
      {
        leagues.length > 1 && (
          <SelectLeague
            visible={selectLeagueModal}
            close={closeSelectLeagueModal}
            selectLeague={selectLeague}
          />
        )
      }
      <View style={styles.mainContainer}>
        {
          leagues.length > 1 && (
            leagueSelected ? (
              <>
                <View style={{ paddingTop: 10, paddingBottom: 6 }}>
                  <SportSlider
                    selectLeague={selectLeague}
                  />
                  <DatePicker
                    date={date}
                    updateDate={updateDate}
                  />
                </View>
                <GameList
                  games={curLeagueGames.games}
                  selectGame={game => handleSelectGame({ game })}
                />
                {
                  betSlip &&
                  <BetSlipBanner
                    onPress={openBetSlipModal}
                  />
                }
              </>
            ) : (
              <View style={styles.buttonsContainer}>
                <MainButtons
                  selectLeague={selectLeague}
                  openModal={openSelectLeagueModal}
                />
                {
                  betSlip &&
                  <BetSlipBanner
                    onPress={openBetSlipModal}
                  />
                }
              </View>
            )
          )
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  headerContainer: {
    height: 84, 
    paddingHorizontal: 10, 
    paddingTop: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1, 
    alignItems: 'center',
  }
});
