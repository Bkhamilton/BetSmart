import { useEffect, useState, useCallback, useContext } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View, TouchableOpacity, Pressable } from '@/components/Themed';
import { sportsData, nbaTeams, nflTeams, mlbTeams, nhlTeams, nbaGamesToday } from '@/data/exampleTeamData';
import MainButtons from '@/components/PlaceBet/MainButtons';
import { getGames, fetchData, retrieveData } from '@/api/prop-odds.js';
import GameList from '@/components/PlaceBet/GameList.js';
import GameListSlider from '@/components/PlaceBet/GameListSlider.js';
import SportSlider from '@/components/PlaceBet/SportsSlider.js';
import { FontAwesome5 } from '@expo/vector-icons';
import { BetContext } from '@/contexts/BetContext';

export default function SelectGameScreen() {
  const { currentGame, setCurrentGame } = useContext(BetContext);
  const { league, setLeague } = useContext(BetContext);

  const router = useRouter();

  const handleSelectGame = ({ game }) => {
    setCurrentGame(game);
    setLeague(curSport.title);
    router.navigate('newBet/betDetails', { game });
  };

  const [header, setHeader] = useState('Place Bet');
  const [curSport, setcurSport] = useState({title:'', games:[]})
  const [curGame, setcurGame] = useState({"away_team": "", "game_id": "", "home_team": "", "participants": [], "start_timestamp": ""})
  const [curCategory, setcurCategory] = useState('Sport')
  const [curHomeTeam, setCurHomeTeam] = useState({
    team: '',
    players: []
  })
  const [curAwayTeam, setCurAwayTeam] = useState({
    team: '',
    players: []
  })

  const [allSportsData, setAllSportsData] = useState([]);

  const [sportSelected, setSportSelected] = useState(false);
  const [gameSelected, setGameSelected] = useState(false);


  // Function to select a sport and set the current sport and category
  const selectSport = (sport) => {
    setcurGame({"away_team": "", "game_id": "", "home_team": "", "participants": [], "start_timestamp": ""});
    if (curSport.title === sport.title) {
      setcurSport({title:'', games:[]});
      setHeader('Place Bet');
      setcurCategory('Sport');
      setSportSelected(false);
    } else {
      setcurSport(sport);
      setHeader(sport.title)
      setcurCategory('Game');
      setSportSelected(true);
    }
  };

  useEffect(() => {
    const fetchSportsData = async () => {
      const data = await retrieveData(['nba', 'mlb', 'nhl']); // replace with the sports you're interested in
      setAllSportsData(data);
    };
  
    fetchSportsData();
  }, []);

  const curSportData = allSportsData.find(sportData => sportData.sport.toLowerCase() === curSport.title.toLowerCase());
  const curSportGames = curSportData ? curSportData.data : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flex: 0.2 }}>
          <Text style={{ fontSize: 24, fontWeight: '500' }}>$200</Text>
        </View>
        <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{header}</Text>
        </View>
        <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
          <TouchableOpacity>
            <FontAwesome5 name='wallet' size={24} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', paddingTop: 16, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Choose {curCategory}</Text>
        </View>
        { sportSelected && 
          <View style={{ paddingVertical: 4  }}>
            <SportSlider sports={sportsData} selectSport={selectSport} curSport={curSport}/>
          </View>
        }
        { sportSelected &&
          <View style={{ alignItems: 'center' }}>
            {
              curGame.home_team.length > 0 &&
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, }}>
                  <View style={{ flex: 1, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 8 }}>
                    <Text style={{ textAlign: 'center' }}>{curHomeTeam.team}</Text>
                  </View>
                  <View style={{ flex: 1, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 8 }}>
                    <Text style={{ textAlign: 'center' }}>{curAwayTeam.team}</Text>
                  </View>
                </View>
            }
            { !gameSelected && <GameList games={curSportGames.games} selectGame={game => handleSelectGame({ game })} sport={curSportGames.league}/> }
          </View>
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
  mainButtonContainer: {
    borderWidth: 1,
    borderRadius: 16,
    height: 90,
    width: 90,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  sportContainer: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  gameRowContainer: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    borderWidth: 1,
    borderRadius: 0,
    width: 120,
    paddingVertical: 8,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerContainer: {
    height: 84, 
    paddingHorizontal: 20, 
    paddingTop: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
