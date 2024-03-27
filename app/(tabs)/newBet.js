import { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '../../components/Header/Header';
import { nbaTeams, nflTeams, mlbTeams, nhlTeams } from '../../data/exampleTeamData';

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

  const sports = [
    {
      title: "NBA",
      games: [{
        home: "LAL",
        away: "MIL"
      },{
        home: "BOS",
        away: "PHI"
      }]
    },
    {
      title: "NFL",
      games: []
    },
    {
      title: "NCAA",
      games: [{
        home: "UConn",
        away: "Creighton"
      },{
        home: "Arizona",
        away: "Kentucky"
      }]
    },
    {
      title: "MLB",
      games: [{
        home: "LAD",
        away: "SD"
      }]
    },
    {
      title: "MLS",
      games: [{
        home: "LAFC",
        away: "LA Galaxy"
      },{
        home: "NYCFC",
        away: "NY Red Bulls"
      }]
    },
    {
      title: "NHL",
      games: [{
        home: "NYR",
        away: "NYI"
      },{
        home: "BOS",
        away: "PHI"
      },{
        home: "WSH",
        away: "PIT"
      }
    ]
    },      
    {
      title: "PGA",
      games: [{
        home: "Tiger Woods",
        away: "Rory McIlroy"
      },{
        home: "Brooks Koepka",
        away: "Dustin Johnson"
      }]
    },
    {
      title: "UFC",
      games: [{
        home: "Conor McGregor",
        away: "Dustin Poirier"
      },{
        home: "Israel Adesanya",
        away: "Robert Whittaker"
      }]
    }
  ]

  return (
    <View style={styles.container}>
      <Header title={'Place Bet'}/>
      <View style={{ alignItems: 'center', }}>
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
            {sports.map((sport, index) => (
              <TouchableOpacity
                key={index}
                style={styles.mainButtonContainer}
                onPress={() => selectSport(sport)}
              >
                <Text style={styles.mainButtonText}>{sport.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      </View>
        { curSport.title.length > 0 &&
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
              data={sports}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity 
                    style={[styles.gameContainer, { height: 50 }]} // Set your desired height here
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
    width: '80%',
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
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  gameText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
