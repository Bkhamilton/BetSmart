import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function AnalyticsDisplay({ data }) {
  return (
    <View style={styles.container}>
      <View>
        <View>
            <Text style={styles.dataTitleText}>PROFIT</Text>
        </View>
        <View style={styles.dataContainer}/>
      </View>
      <View>
        <View>
            <Text style={styles.dataTitleText}>BETS</Text>
        </View>
        <View style={styles.dataContainer}/>
      </View>
      <View>
        <View>
            <Text style={styles.dataTitleText}>SUCCESS</Text>
        </View>
        <View style={styles.dataContainer}/>
      </View>
      <View>
        <View>
            <Text style={styles.dataTitleText}>ROI</Text>
        </View>
        <View style={styles.dataContainer}/>
      </View>        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dataContainer: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    height: 100,
  },
  dataTitleText: {
    fontSize: 24,
    fontWeight: '600',
  },
});