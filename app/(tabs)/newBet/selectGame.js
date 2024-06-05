import { useEffect, useState, useCallback, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { retrieveGamesDB } from '@/api/prop-odds/games.js';
import { BetContext } from '@/contexts/BetContext';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, View, Pressable } from '@/components/Themed';
import MainButtons from '@/components/PlaceBet/SelectGame/MainButtons';
import GameList from '@/components/PlaceBet/SelectGame/GameList';
import SportSlider from '@/components/PlaceBet/SelectGame/SportSlider';
import BalanceBox from '@/components/PlaceBet/BalanceBox';
import ChooseBookie from '@/components/Modals/ChooseBookie';
import { getBalance, updateBalance } from '@/db/user-specific/Balance';
import { getAllBookies } from '@/db/general/Bookies';
import { getAllLeagues } from '@/db/general/Leagues';

export default function SelectGameScreen() {

  const db = useSQLiteContext();

  const { setCurrentGame, setLeague, setBookie, setBookieId } = useContext(BetContext);

  const router = useRouter();

  const handleSelectGame = ({ game }) => {
    setCurrentGame(game);
    setLeague(curLeague.leagueName);
    router.navigate('newBet/betDetails', { game });
  };

  const [header, setHeader] = useState('Place Bet');

  const [curLeague, setcurLeague] = useState({});
  const [allSportsData, setAllSportsData] = useState([]);
  const [leagueSelected, setLeagueSelected] = useState(false);

  const [userBalance, setUserBalance] = useState([])
  const [bookies, setBookies] = useState([]);
  const [leagues, setLeagues] = useState([]);
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

  const selectProp = (game, value, odds) => {
    console.log(JSON.stringify(game, null, 2));
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

  const curLeagueData = allSportsData.find(sportData => sportData.sport === curLeague?.leagueName);
  const curLeagueGames = curLeagueData ? curLeagueData.data : [];

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
        { leagueSelected && leagues.length > 1 &&
          <>
            <View style={{ paddingVertical: 10  }}>
              <SportSlider 
                leagues={leagues} 
                curLeague={curLeague}
                selectLeague={selectLeague}
              />
            </View> 
            <GameList 
              games={curLeagueGames.games} 
              selectGame={game => handleSelectGame({ game })}
              selectProp={selectProp}
            />
          </> 
        }
        { !leagueSelected && leagues.length > 1 &&
          <View style={styles.buttonsContainer}>
            <MainButtons 
              leagues={leagues} 
              selectLeague={selectLeague}
            />
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
