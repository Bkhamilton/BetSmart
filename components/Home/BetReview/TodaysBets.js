import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../../Themed';

import Colors from '@/constants/Colors';

export default function TodaysBets({ bets }) {
    return (
      <View style={styles.container}>
          <View style={{ backgroundColor: 'transparent', paddingBottom: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>Today's Bets</Text>
          </View>
          <View style={styles.mainInfoContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 38, fontWeight: '700' }}>10</Text>
                <Text style={{ fontSize: 18, marginTop: 16, marginLeft: 4 }}>bets</Text>
            </View>
          </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    mainInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
    },
  });