import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Feather, Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../Themed';
import { useColorScheme } from 'react-native';

import Colors from '@/constants/Colors';

export default function ProfitDashboard({ wagered, won }) {
    const profit = won - wagered;
    const arrowDirection = profit > 0 ? 'chevron-up' : 'chevron-down';
    const arrowColor = profit > 0 ? 'green' : 'red';
  
    const colorScheme = useColorScheme();

    const backgroundGreen = colorScheme === 'dark' ? Colors.dark.mainGreen : Colors.light.mainGreen;
    const accentGreen = colorScheme === 'dark' ? Colors.dark.accentGreen : Colors.light.accentGreen;
    const backgroundBlue = colorScheme === 'dark' ? Colors.dark.mainBlue : Colors.light.mainBlue;
    const accentBlue = colorScheme === 'dark' ? Colors.dark.accentBlue : Colors.light.accentBlue;
    const grayBackground = colorScheme === 'dark' ? '#313131' : '#B8B8B8';

    const [betIndex, setBetIndex] = React.useState(0);

    const pressUp = () => {
      setBetIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
    };

    const pressDown = () => {
      setBetIndex((prevIndex) => (prevIndex === 2 ? 2 : prevIndex + 1));
    };

    const textStyles = [
      [styles.bigText, styles.mediumText, styles.smallText],
      [styles.mediumText, styles.bigText, styles.mediumText],
      [styles.smallText, styles.mediumText, styles.bigText],
    ];    

    const recentResults = [10.9, -5, 2.3, 15.80, -8.50, 6.7];

    // Function to format the value of the recent bet results
    const formatValue = (num) => {
      const sign = num >= 0 ? '+' : '-';
      return `${sign}$${Math.abs(num).toFixed(2)}`;
    };

    return (
    <View style={styles.container}>
        <View style={[styles.centeredBox, { backgroundColor: backgroundGreen, borderColor: backgroundGreen }]}>
            <View style={[styles.box, { overflow: 'hidden', height: '100%', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]}>
                <View style={[styles.dollarContainer, { borderColor: accentGreen }]}>
                    <FontAwesome name="dollar" size={60} color={accentGreen}/>
                </View>
            </View>
            <View style={styles.centerBox}>
                <Text>CURRENT BALANCE</Text>
                <Text style={[styles.bigMoneyText, { marginTop: 8 }]}>${profit.toFixed(2)}</Text>
            </View>
            <View style={styles.box}>
                <View style={{ alignItems: 'flex-end', paddingRight: 8, backgroundColor: 'transparent' }}>
                <TouchableOpacity 
                  style={{ backgroundColor: 'transparent', opacity: betIndex === 0 ? 1 : 0.5 }}
                  onPress={pressUp}
                >
                  <FontAwesome name="arrow-up" size={18} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ backgroundColor: 'transparent', opacity: betIndex === 2 ? 1 : 0.5 }}
                  onPress={pressDown}
                >
                  <FontAwesome name="arrow-down" size={18} color="black"/>
                </TouchableOpacity>
                </View>
                <View style={styles.moneyBox}>
                  <Text style={textStyles[betIndex][0]}>{formatValue(recentResults[0])}</Text>
                  <Text style={textStyles[betIndex][1]}>{formatValue(recentResults[1])}</Text>
                  <Text style={textStyles[betIndex][2]}>{formatValue(recentResults[2])}</Text>
                </View>
            </View>
        </View>
        <View style={styles.row}>
            <View style={[styles.leftBox, { backgroundColor: grayBackground }]}>
                <Text style={{ paddingLeft: 16 }}>Total Won</Text>
                <Text style={[styles.moneyText, { color: '#36d363' }]}>${won.toFixed(2)}</Text>
            </View>
            <View style={[styles.indicator, { backgroundColor: 'transparent' }]}>
                <View style={styles.circle}>
                    <FontAwesome name={arrowDirection} size={20} color={arrowColor} style={{ marginTop: -4 }}/>
                </View>
            </View>
            <View style={[styles.rightBox, { backgroundColor: grayBackground }]}>
                <Text>Total Bet</Text>
                <Text style={[styles.moneyText, { color: '#ff5757' }]}>${wagered.toFixed(2)}</Text>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  centeredBox: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginHorizontal: 10,
    marginTop: 12,
    borderWidth: 1, 
    justifyContent: 'center',
    borderRadius: 8,
  },
  box: {
    flex: 0.3,
    backgroundColor: 'transparent'
  },
  centerBox: {
    flex: 0.4,
    paddingTop: 28,
    paddingBottom: 24, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row', 
    marginTop: 8
  },
  leftBox: {
    flex: 1, 
    alignItems: 'flex-start', 
    marginLeft: 10, 
    marginRight: 4, 
    paddingVertical: 12,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  rightBox: {
    flex: 1, 
    alignItems: 'flex-end', 
    marginRight: 10, 
    marginLeft: 4, 
    paddingVertical: 12,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  bigMoneyText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  moneyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 1,
  },
  circle: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dollarContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    height: 110, 
    width: 110, 
    borderRadius: 55, 
    borderWidth: 10, 
    transform: [{ translateY: 45 }],
    opacity: 0.3,
    backgroundColor: 'transparent'
  },
  moneyBox: {
    alignItems: 'flex-end', 
    paddingRight: 4, 
    paddingTop: 14, 
    backgroundColor: 'transparent'
  },  
  bigText: {
    opacity: 0.7
  },
  mediumText: {
    fontSize: 12,
    opacity: 0.6
  },
  smallText: {
    fontSize: 10,
    opacity: 0.4
  },
});