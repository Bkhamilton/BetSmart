import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '../../components/Header/Header';
import { sportsData, nbaTeams, nflTeams, mlbTeams, nhlTeams } from '../../data/exampleTeamData';
import MainButtons from '../../components/PlaceBet/MainButtons';

export default function NewBetScreen() {

  const [curSport, setcurSport] = useState({title:'', games:[]})
  const [curGame, setcurGame] = useState({home:'', away:''})
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

  useEffect(() => {
    fetchData();
    retrieveData();
  });

  // Function to select a sport and set the current sport and category
  const selectSport = (sport) => {
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
    if (curGame.home === game.home && curGame.away === game.away) {
      setcurGame({home:'', away:''});
      setCurHomeTeam({team:'', players:[]});
      setCurAwayTeam({team:'', players:[]});
      setcurCategory('Game');
    } else {
      setcurGame(game);
      setCurHomeTeam({team:game.home, players:[]});
      setCurAwayTeam({team:game.away, players:[]});
      setcurCategory('Team');
    }
  }

  // Function to fetch data from API and store it in AsyncStorage
  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.prop-odds.com/beta/games/nba?date=2024-03-28&tz=America/New_York&api_key=AaHYFBJJXgbcJyBYy3OiMVuv1eJAd4JIYkQWFOPTLf4`);
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
        setRandomData(JSON.stringify(value));
        console.log(JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Place Bet'}/>
      <Text>{randomData} A</Text>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ paddingVertical: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Choose {curCategory}</Text>
        </View>
        { curSport.title.length > 0 &&
          <View style={{ alignItems: 'center' }}>
            <View style={{ paddingVertical: 4, paddingHorizontal: 12, borderWidth: 1, marginTop: 6, borderRadius: 8, }}>
              <Text>{curSport.title}</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {curSport.games.map((game, index) => (
                <TouchableOpacity 
                  key={index} style={{ borderWidth: 1, marginHorizontal: 10, paddingHorizontal: 8, paddingVertical: 4, marginVertical: 4, }}
                  onPress={() => selectGame(game)}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{game.away} vs {game.home}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        { curSport.title.length == 0 &&
          <View style={styles.buttonsContainer}>
            <MainButtons sports={sportsData} onPress={selectSport} />
          </View>
        }
      </View>
        { curSport.title.length > 0 &&
          <View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 0 }}
              data={sportsData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity 
                    style={[styles.gameContainer]} // Set your desired height here
                    onPress={() => selectSport(item)}
                    testID={`game_${item.title}`}
                  >
                    <Text style={styles.gameText}>{item.title}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        }
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
  gameContainer: {
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
  gameText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
