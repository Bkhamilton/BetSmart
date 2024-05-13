import { useEffect, useState, useCallback, useContext } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Image } from 'react-native';
import { Text, View, Pressable } from '@/components/Themed';
import { sportsData } from '@/data/exampleTeamData';
import MainButtons from '@/components/PlaceBet/MainButtons';
import { getGames, fetchData, retrieveData } from '@/api/prop-odds.js';
import GameList from '@/components/PlaceBet/GameList.js';
import SportSlider from '@/components/PlaceBet/SportsSlider.js';
import { BetContext } from '@/contexts/BetContext';
import draftkings from '@/assets/images/DraftKings.png';
import { useSQLiteContext } from 'expo-sqlite';
import { getBalance, getAllUsers, getUser, updateBalance } from '@/api/sqlite';
import useTheme from '@/hooks/useTheme';
import BalanceBox from '../../../components/PlaceBet/BalanceBox';

export default function SelectGameScreen() {

  const db = useSQLiteContext();

  const { setCurrentGame, setLeague } = useContext(BetContext);

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
  const [userBalance, setUserBalance] = useState([{ Bookie: 'DraftKings', Balance: 0 }, { Bookie: 'FanDuel', Balance: 0 }])
  const [userID, setUserID] = useState(1);

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

  useEffect(() => {
    const fetchSportsData = async () => {
      const data = await retrieveData(['nba', 'mlb', 'nhl']); // replace with the sports you're interested in
      setAllSportsData(data);
    };
    getBalance(db, userID).then((balance) => {
      setUserBalance(balance);
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
          <BalanceBox userBalance={userBalance} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SelectGameHeader />
      <View style={{ flex: 1, alignItems: 'center' }}>
        { sportSelected &&
          <>
            <View style={{ paddingVertical: 10  }}>
              <SportSlider sports={sportsData} selectSport={selectSport} curSport={curSport}/>
            </View> 
            <GameList games={curSportGames.games} selectGame={game => handleSelectGame({ game })} sport={curSportGames.league}/>
          </> 
        }
        { !sportSelected &&
          <View style={styles.buttonsContainer}>
            <MainButtons sports={sportsData} onPress={selectSport} />
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
});
