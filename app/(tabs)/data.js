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

  return (
    <View style={styles.container}>
      <Header title={'Analytics'}/>
      <ScrollView>
        <DataHeader />
        <TimeSelector selectTime={selectTime} curTime={selectedTime}/>
        <AnalyticsDisplay data={selectedTime}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
