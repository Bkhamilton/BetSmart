import { useEffect, useState, useCallback, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { retrieveGamesDate } from '@/api/prop-odds/games.js';
import { retrieveMarketsDB } from '@/api/prop-odds/markets.js';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import { removeLeg, updateBetSlipAmounts } from '@/contexts/BetContext/betSlipHelpers';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import MainButtons from '@/components/PlaceBet/SelectGame/MainButtons';
import GameList from '@/components/PlaceBet/SelectGame/GameList/GameList';
import SportSlider from '@/components/PlaceBet/SelectGame/SportSlider';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import BetSlipModal from '@/components/Modals/BetSlipModal/BetSlipModal';
import useTheme from '@/hooks/useTheme';
import DatePicker from '@/components/PlaceBet/SelectGame/DatePicker';

export default function SelectGameScreen() {

  const db = useSQLiteContext();

  const { setCurrentGame, league, setLeague, setBookie, setBookieId, betSlip, setBetSlip } = useContext(BetContext);
  const { leagues } = useContext(DBContext);

  const router = useRouter();

  const handleSelectGame = ({ game }) => {
    setCurrentGame(game);
    router.navigate('newBet/betDetails', { game });
  };

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedToday);

  const [header, setHeader] = useState('Place Bet');

  const [allSportsData, setAllSportsData] = useState([]);
  const [leagueSelected, setLeagueSelected] = useState(false);

  const [totalLegs, setTotalLegs] = useState(0);

  const [chooseBookieModal, setChooseBookieModal] = useState(false);
  const [betSlipModal, setBetSlipModal] = useState(false);

  const openBookieModal = () => {
    setChooseBookieModal(true);
  }

  const closeBookieModal = () => {
    setChooseBookieModal(false);
  }

  const openBetSlipModal = () => {
    setBetSlipModal(true);
  }

  const closeBetSlipModal = () => {
    setBetSlipModal(false);
  }

  const selectBookie = (bookie) => {
    setChooseBookieModal(false);
    setBookie(bookie.name);
    setBookieId(bookie.id);
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

  const removeProp = (bet, leg) => {
    const isEmpty = removeLeg(betSlip, bet, leg);
    if (isEmpty) {
      closeBetSlipModal();
      setBetSlip(null);
    }
    setTotalLegs(betSlip ? betSlip.bets.reduce((total, bet) => total + bet.legs.length, 0) : 0);
  }

  const removeBetSlip = () => {
    closeBetSlipModal();
    setBetSlip(null);
    setTotalLegs(0);
  }

  const confirmBet = (wager, winnings) => {
    updateBetSlipAmounts(betSlip, wager, winnings);
    console.log('Bet Slip:', JSON.stringify(betSlip));

    closeBetSlipModal();
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
      retrieveGamesDate(db, ["NBA", "MLB", "NHL"], date).then((games) => {
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
          <BalanceBox openModal={openBookieModal}/>
        </View>
      </View>
    );
  }

  return (
    <>
      <SelectGameHeader />
      <ChooseBookie
        visible={chooseBookieModal}
        close={closeBookieModal}
        selectBookie={selectBookie}
      />
      {
        betSlip && (
          <BetSlipModal
            visible={betSlipModal}
            close={closeBetSlipModal}
            removeProp={removeProp}
            removeBetSlip={removeBetSlip}
            confirm={confirmBet}
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
                    betSlip={betSlip}
                    onPress={openBetSlipModal}
                  />
                }
              </>
            ) : (
              <View style={styles.buttonsContainer}>
                <MainButtons
                  selectLeague={selectLeague}
                />
                {
                  betSlip &&
                  <BetSlipBanner
                    betSlip={betSlip}
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
