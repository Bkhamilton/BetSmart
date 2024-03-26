import { useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '../../components/Header/Header';

export default function NewBetScreen() {

  const [curSport, setcurSport] = useState({title:'', games:[]})

  const selectSport = (sport) => {
    if (curSport.title === sport.title) {
      setcurSport({title:'', games:[]});
    } else {
      setcurSport(sport);
    }
  };

  const sports = [
    {
      title: "NBA",
      games: [{
        home: "LAL",
        away: "MIL"
      },{
        home: "BOS",
        away: " "
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
    }            
  ]

  return (
    <View style={styles.container}>
      <Header title={'Place Bet'}/>
      <View style={{ alignItems: 'center', }}>
        <View style={{ paddingVertical: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Choose Sport</Text>
        </View>
        { curSport.title.length > 0 &&
          <View style={{ alignItems: 'center' }}>
            <View style={{ paddingVertical: 4, paddingHorizontal: 12, borderWidth: 1, marginTop: 6, borderRadius: 8, }}>
              <Text>{curSport.title}</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {curSport.games.map((game, index) => (
                <View key={index} style={{ borderWidth: 1, marginHorizontal: 10, paddingHorizontal: 8, paddingVertical: 4, marginVertical: 4, }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{game.away} vs {game.home}</Text>
                </View>
              ))}
            </View>
          </View>

        }
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
  }
});
