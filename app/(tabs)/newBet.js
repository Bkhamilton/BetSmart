import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '../../components/Header/Header';
import { sportsData, nbaTeams, nflTeams, mlbTeams, nhlTeams, nbaGamesToday } from '../../data/exampleTeamData';
import MainButtons from '../../components/PlaceBet/MainButtons';
import { getGames } from '../../api/prop-odds.js';
import secrets from '../../secrets.js';
import { nbaTeamAbbreviations } from '../../data/teamAbbreviations.js'; 
import GameList from '../../components/PlaceBet/GameList.js';
import SportList from '../../components/PlaceBet/SportList.js';
import GameListSlider from '../../components/PlaceBet/GameListSlider.js';

export default function NewBetScreen() {

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

  const [randomData, setRandomData] = useState('');

  // Function to select a sport and set the current sport and category
  const selectSport = (sport) => {
    setcurGame({"away_team": "", "game_id": "", "home_team": "", "participants": [], "start_timestamp": ""});
    if (curSport.title === sport.title) {
      setcurSport({title:'', games:[]});
      setcurCategory('Sport');
    } else {
      setcurSport(sport);
      setcurCategory('Game');
    }
  };

  // Function to select a game and set the current game, as well as the current team and players for the home and away teams
  const selectGame = (game) => {
    if (curGame.home_team === game.home_team && curGame.away_team === game.away_team) {
      setcurGame({"away_team": "", "game_id": "", "home_team": "", "participants": [], "start_timestamp": ""});
      setCurHomeTeam({team:'', players:[]});
      setCurAwayTeam({team:'', players:[]});
      setcurCategory('Game');
    } else {
      setcurGame(game);
      setCurHomeTeam({team:game.home_team, players:[]});
      setCurAwayTeam({team:game.away_team, players:[]});
      setcurCategory('Team');
    }
  }

  // Function to fetch data from API and store it in AsyncStorage
  const fetchData = async () => {
    try {
      const sport = 'nba'; // replace with the sport you're interested in
      const data = await getGames(sport);
      await AsyncStorage.setItem('gameData', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to retrieve data from AsyncStorage
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('gameData');
      if (value !== null) {
        // We have data!!
        setRandomData(JSON.parse(value));
        console.log(JSON.parse(value));
      } else {
        // No data in AsyncStorage, fetch from API
        fetchData();
      }
    } catch (error) {
      // Error retrieving data
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  // Function to get the abbreviation for a team name
  const getTeamAbbreviation = (teamName) => {
    return nbaTeamAbbreviations[teamName] || teamName;
  };

  return (
    <View style={styles.container}>
      <Header title={'Place Bet'}/>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', paddingVertical: 16, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Choose {curCategory}</Text>
        </View>

        { curSport.title.length > 0 &&
          <View style={{ alignItems: 'center' }}>
            <View style={{ paddingVertical: 4, paddingHorizontal: 12, borderWidth: 1, marginTop: 6, borderRadius: 8, }}>
              <Text>{curSport.title}</Text>
            </View>
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
            { curGame.home_team.length == 0 && <GameList games={randomData.games} selectGame={selectGame} /> }
          </View>
        }
        { curSport.title.length == 0 &&
          <View style={styles.buttonsContainer}>
            <MainButtons sports={sportsData} onPress={selectSport} />
          </View>
        }
      </View>
      { curGame.home_team.length > 0 && <GameListSlider games={randomData.games} selectGame={selectGame} /> }
      { curSport.title.length > 0 && <SportList sports={sportsData} selectSport={selectSport} /> }
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
});
