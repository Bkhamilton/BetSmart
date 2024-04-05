import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from '../../components/Header/Header';
import { sportsData, nbaTeams, nflTeams, mlbTeams, nhlTeams, nbaGamesToday } from '../../data/exampleTeamData';
import MainButtons from '../../components/PlaceBet/MainButtons';
import { getGames, fetchData, retrieveData } from '../../api/prop-odds.js';
import secrets from '../../secrets.js';
import { nbaTeamAbbreviations, mlbTeamAbbreviations, nhlTeamAbbreviations } from '../../data/teamAbbreviations.js'; 
import GameList from '../../components/PlaceBet/GameList.js';
import SportList from '../../components/PlaceBet/SportList.js';
import GameListSlider from '../../components/PlaceBet/GameListSlider.js';

export default function NewBetScreen() {

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

  const [randomData, setRandomData] = useState('');
  const [allSportsData, setAllSportsData] = useState([]);

  // Function to select a sport and set the current sport and category
  const selectSport = (sport) => {
    setcurGame({"away_team": "", "game_id": "", "home_team": "", "participants": [], "start_timestamp": ""});
    if (curSport.title === sport.title) {
      setcurSport({title:'', games:[]});
      setHeader('Place Bet');
      setcurCategory('Sport');
    } else {
      setcurSport(sport);
      setHeader(sport.title)
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
      <Header title={header}/>
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
            { curGame.home_team.length == 0 && <GameList games={curSportGames.games} selectGame={selectGame} sport={curSportGames.league}/> }
          </View>
        }
        { curSport.title.length == 0 &&
          <View style={styles.buttonsContainer}>
            <MainButtons sports={sportsData} onPress={selectSport} />
          </View>
        }
      </View>
      { curGame.home_team.length > 0 && <GameListSlider games={curSportGames.games} selectGame={selectGame} /> }
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
