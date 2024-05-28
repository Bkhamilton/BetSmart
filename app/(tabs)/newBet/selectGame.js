import { useEffect, useState, useCallback, useContext } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Image } from 'react-native';
import { Text, View, Pressable } from '@/components/Themed';
import { sportsData } from '@/data/exampleTeamData';
import MainButtons from '@/components/PlaceBet/MainButtons';
import { retrieveGamesDB } from '@/api/prop-odds/games.js';
import GameList from '@/components/PlaceBet/GameList.js';
import SportSlider from '@/components/PlaceBet/SelectGame/SportSlider';
import { BetContext } from '@/contexts/BetContext';
import draftkings from '@/assets/images/DraftKings.png';
import { useSQLiteContext } from 'expo-sqlite';
import { getBalance, updateBalance } from '@/db/user-specific/Balance';
import { getAllBookies } from '@/db/general/Bookies';
import { getAllLeagues } from '@/db/general/Leagues';
import useTheme from '@/hooks/useTheme';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import { useFocusEffect } from '@react-navigation/native';
import ChooseBookie from '@/components/Modals/ChooseBookie';

export default function SelectGameScreen() {

  const db = useSQLiteContext();

  const { setCurrentGame, setLeague, setBookie, setBookieId } = useContext(BetContext);

  const router = useRouter();

  const handleSelectGame = ({ game }) => {
    setCurrentGame(game);
    setLeague(curSport.title);
    router.navigate('newBet/betDetails', { game });
  };

  const [header, setHeader] = useState('Place Bet');

  const [curSport, setcurSport] = useState({title:'', games:[]})
  const [allSportsData, setAllSportsData] = useState([]);
  const [sportSelected, setSportSelected] = useState(false);
  const [userBalance, setUserBalance] = useState([{ bookieId: 1, balance: 0 }, { bookieId: 2, balance: 0 }])
  const [bookies, setBookies] = useState([{ id: 0, name: '', description: ''}]);
  const [leagues, setLeagues] = useState([{"description": "", "id": 0, "leagueName": "", "sport": ""}]);
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
    setBookie(bookie.name);
    setBookieId(bookie.id);
  }

  // Function to select a sport and set the current sport and category
  const selectSport = (sport) => {
    if (curSport.title === sport.title) {
      setcurSport({title:'', games:[]});
      setHeader('Place Bet');
      setSportSelected(false);
    } else {
      setcurSport(sport);
      setHeader(sport.title)
      setSportSelected(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBalance(db, userID).then((balance) => {
        setUserBalance(balance);
      });
    }, [])
  );

  useEffect(() => {
    const fetchSportsData = async () => {
      retrieveGamesDB(db, ["NBA", "MLB", "NHL"]).then((data) => {
        setAllSportsData(data);
      });
    };

    getAllBookies(db).then((bookies) => {
      setBookies(bookies);
    });

    getAllLeagues(db).then((leagues) => {
      setLeagues(leagues);
    });

    fetchSportsData();
  }, []);

  const curSportData = allSportsData.find(sportData => sportData.sport.toLowerCase() === curSport.title.toLowerCase());
  const curSportGames = curSportData ? curSportData.data : [];

  const { iconColor, mainGreen } = useTheme();

  const SelectGameHeader = () => {
    return (
      <View style={styles.headerContainer}>
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
      <View style={styles.mainContainer}>
        { sportSelected && leagues.length > 1 &&
          <>
            <View style={{ paddingVertical: 10  }}>
              <SportSlider sports={sportsData} selectSport={selectSport} curSport={curSport} leagues={leagues}/>
            </View> 
            <GameList games={curSportGames.games} selectGame={game => handleSelectGame({ game })} sport={curSportGames.league}/>
          </> 
        }
        { !sportSelected && leagues.length > 1 &&
          <View style={styles.buttonsContainer}>
            <MainButtons sports={sportsData} onPress={selectSport} leagues={leagues}/>
          </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 100,
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
