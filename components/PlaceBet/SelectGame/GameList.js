import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed'

export default function GameList({ games, selectGame }) {

    const getDate = (dateString) => {
        const date = new Date(dateString);
        const estDate = new Date(date.getTime());
        const month = estDate.getMonth() + 1; // getMonth returns month index starting from 0
        const day = estDate.getDate();
        return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`; // Returns the date in MM/DD format
    };
    
    const getTime = (dateString) => {
      const date = new Date(dateString);
      const estDate = new Date(date.getTime()); // Subtract 4 hours from UTC to get EST
      let hours = estDate.getHours();
      const minutes = estDate.getMinutes();
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutesStr}`; // Returns the time part in 12-hour format
    };
    
    const getAmPm = (dateString) => {
      const date = new Date(dateString);
      const estDate = new Date(date.getTime()); // Subtract 4 hours from UTC to get EST
      const hours = estDate.getHours();
      return hours >= 12 ? 'PM' : 'AM';
    };

    function BettingLine({ value }) {
        return (
            <TouchableOpacity style={styles.propContainer}>
                <Text>{value}</Text>
            </TouchableOpacity>
        );
    }

    function MainBettingLines() {
        return (
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {/* Moneyline */}
                <View>
                    <BettingLine value="-195"/>
                    <BettingLine value="+110"/>
                </View>
                {/* Spread */}
                <View>
                    <BettingLine value="-3.5"/>
                    <BettingLine value="+3.5"/>
                </View>
                {/* Total Pts */}
                <View>
                    <BettingLine value="O 218.5"/>
                    <BettingLine value="U 218.5"/>
                </View>
            </View>
        );
    }


    // Component for each game
    function GameComponent({ game }) {

        return (
          <TouchableOpacity 
            style={{ borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
            onPress={() => selectGame(game)}
          >
            <View style={{ flexDirection: 'row' }}>
                {/* Game Info. Team vs Team, Start Time */}
                <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 8 }}>
                        <View style={styles.gameTeamContainer}>
                            <View style={styles.teamIcon}/>
                            <Text>{game.awayTeamAbv}</Text>
                        </View>
                        <View style={styles.divider}/>
                        <View style={styles.gameTeamContainer}>
                            <View style={styles.teamIcon}/>
                            <Text>{game.homeTeamAbv}</Text>
                        </View>
                    </View>
                </View>
                {/* Odds for ML, Spread, Total */}
                <MainBettingLines />
            </View>
            <View style={styles.dateTimeContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 18 }}>{getTime(game.timestamp)}</Text>
                <Text style={{ fontSize: 12 }}>{getAmPm(game.timestamp)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 14 }}>{getDate(game.timestamp)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
    }

    return (
        <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'transparent' }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 100 }}
                data={games}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <GameComponent game={item} />
                )}
            />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 8,
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
  gameTeamContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  teamIcon: {
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    borderWidth: 1,
    marginRight: 8,
  },
  propContainer: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1, 
    borderBottomWidth: 1, 
    width: 150, 
    paddingTop: 4, 
    marginBottom: 4, 
    opacity: 0.1
  },
  dateTimeContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 10, paddingBottom: 2
  }
});
