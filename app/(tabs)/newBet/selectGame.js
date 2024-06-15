import { useEffect, useState, useCallback, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { retrieveGamesDate } from '@/api/prop-odds/games.js';
import { BetContext } from '@/contexts/BetContext/BetContext';
import { DBContext } from '@/contexts/DBContext';
import { createLeg, createBet, createBetSlip, updateBetSlip } from '@/contexts/BetContext/betSlipHelpers';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import MainButtons from '@/components/PlaceBet/SelectGame/MainButtons';
import GameList from '@/components/PlaceBet/SelectGame/GameList/GameList';
import SportSlider from '@/components/PlaceBet/SelectGame/SportSlider';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import BetSlipBanner from '@/components/PlaceBet/BetSlipBanner';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import BetSlipModal from '@/components/Modals/BetSlipModal';
import { getBalance } from '@/db/user-specific/Balance';
import { getAllBookies } from '@/db/general/Bookies';
import { getAllLeagues } from '@/db/general/Leagues';
import useTheme from '@/hooks/useTheme';
import DatePicker from '@/components/PlaceBet/SelectGame/DatePicker';

export default function SelectGameScreen() {

  const db = useSQLiteContext();

  const { setCurrentGame, setLeague, setBookie, setBookieId, betSlip, setBetSlip } = useContext(BetContext);
  const { bookies, leagues } = useContext(DBContext);

  const router = useRouter();

  const handleSelectGame = ({ game }) => {
    setCurrentGame(game);
    setLeague(curLeague.leagueName);
    router.navigate('newBet/betDetails', { game });
  };

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedToday);

  const [header, setHeader] = useState('Place Bet');

  const [curLeague, setcurLeague] = useState({});
  const [allSportsData, setAllSportsData] = useState([]);
  const [leagueSelected, setLeagueSelected] = useState(false);

  const [userBalance, setUserBalance] = useState([])
  const [userID, setUserID] = useState(1);

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

  const selectLeague = (league) => {
    if (curLeague?.leagueName === league.leagueName) {
      setcurLeague({});
      setHeader('Place Bet');
      setLeagueSelected(false);
    } else {
      setcurLeague(league);
      setHeader(league.leagueName)
      setLeagueSelected(true);
    }
  }

  const selectProp = (props) => {
    const { game, type, target, stat, value, odds } = props;

    const leg = createLeg(type, target, stat, value, odds);
    const bet = createBet(game.date, curLeague.leagueName, game.homeTeamName, game.awayTeamName, odds, [leg]);

    const today = new Date();

    if (betSlip) {
      const newBetSlip = updateBetSlip(betSlip, bet, leg);
      setBetSlip(newBetSlip);
      setTotalLegs(newBetSlip.bets.reduce((total, bet) => total + bet.legs.length, 0));
    } else {
      const newBetSlip = createBetSlip(1, 'Single', today, odds, 0, 0, [bet]);
      setBetSlip(newBetSlip);
      setTotalLegs(1);
    }
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

  useFocusEffect(
    useCallback(() => {
      getBalance(db, userID).then((balance) => {
        setUserBalance(balance);
      });
    }, [])
  );

  useEffect(() => {
    const fetchSportsData = async () => {
      retrieveGamesDate(db, ["NBA", "MLB", "NHL"], date).then((data) => {
        setAllSportsData(data);
      });
    };
  
    fetchSportsData();
  }, [date]);

  const curLeagueData = allSportsData?.find(sportData => sportData.sport === curLeague?.leagueName);
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
          <BalanceBox userBalance={userBalance} openModal={openBookieModal}/>
        </View>
      </View>
    );
  }

  const todaysDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <SelectGameHeader />
      <ChooseBookie
        userBalance={userBalance}
        bookies={bookies}
        visible={chooseBookieModal}
        close={closeBookieModal}
        selectBookie={selectBookie}
      />
      {
        betSlip && (
          <BetSlipModal
            visible={betSlipModal}
            close={closeBetSlipModal}
            betslip={betSlip}
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
                    leagues={leagues}
                    curLeague={curLeague}
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
                  selectProp={selectProp}
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
                  leagues={leagues}
                  selectLeague={selectLeague}
                />
                {
                  betSlip &&
                  <BetSlipBanner
                    totalLegs={totalLegs}
                    betSlip={betSlip}
                    onPress={() => console.log(JSON.stringify(betSlip, null, 2))}
                  />
                }
              </View>
            )
          )
        }
      </View>
    </View>
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
