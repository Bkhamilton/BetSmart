import { StyleSheet, Dimensions } from 'react-native';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import Header from '../../components/Header/Header';
import React, { useState } from 'react';
import DataHeader from '../../components/Data/DataHeader';
import TimeSelector from '../../components/Data/TimeSelector';
import AnalyticsDisplay from '../../components/Data/AnalyticsDisplay';

export default function DataScreen() {
  const [selectedTime, setSelectedTime] = useState('Open');
  const [filteredData, setFilteredData] = useState([]);

  const selectTime = (timeRange) => {
    setSelectedTime(timeRange);
  };

  const MainHeader = () => {
    return (
      <View>
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Analytics</Text>
        </View>
        <TimeSelector selectTime={selectTime} curTime={selectedTime}/>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <MainHeader/>
      <ScrollView>
        <AnalyticsDisplay data={selectedTime}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 84, 
    paddingHorizontal: 20, 
    paddingTop: 48,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
});
