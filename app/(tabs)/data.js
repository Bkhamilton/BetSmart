import { StyleSheet, Dimensions } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Header from '../../components/Header/Header';
import { PieChart } from 'react-native-chart-kit';
import { useColorScheme } from 'react-native';
import React from 'react';

export default function DataScreen() {
  const amountWon = 140; // Dummy data
  const amountWagered = 120; // Dummy data
  const profit = amountWon - amountWagered;

  const DATA = [
    { value: amountWon, color: 'green', label: 'Amount Won' },
    { value: amountWagered, color: 'black', label: 'Amount Wagered' },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <View style={styles.container}>
      <Header title={'Data'}/>
      <View style={{ borderWidth: 1, alignItems: 'center', paddingVertical: 8 }}>
          <Text style={styles.title}>Profit Outlook</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={DATA}
              width={Dimensions.get('window').width}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              center={[100, 0]}
              absolute
              hasLegend={false}
            />
            <Text style={styles.profitText}>+${profit}</Text>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profitText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
