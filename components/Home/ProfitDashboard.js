import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '../Themed';

import Colors from '@/constants/Colors';

export default function ProfitDashboard({ wagered, won }) {
    const profit = won - wagered;
    const arrowDirection = profit > 0 ? 'chevron-up' : 'chevron-down';
    const arrowColor = profit > 0 ? 'green' : 'red';
  
    return (
    <View style={styles.container}>
        <View style={styles.centeredBox}>
            <View style={styles.box}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 60, width: 60, borderRadius: 30, borderWidth: 1 }}>
                    <FontAwesome name="dollar" size={38} color="black" />
                </View>
            </View>
            <View style={styles.centerBox}>
                <Text>CURRENT BALANCE</Text>
                <Text style={[styles.bigMoneyText, { marginTop: 8 }]}>${profit.toFixed(2)}</Text>
            </View>
            <View style={styles.box}>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity>
                        <FontAwesome name="arrow-up" size={18} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="arrow-down" size={18} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text>+$10.90</Text>
                    <Text>-$5.00</Text>
                    <Text>+$2.30</Text>
                </View>
            </View>
        </View>
        <View style={styles.row}>
            <View style={styles.leftBox}>
                <Text>Total Won</Text>
                <Text style={[styles.moneyText, { color: 'green' }]}>${won.toFixed(2)}</Text>
            </View>
            <View style={styles.indicator}>
                <View style={styles.circle}>
                    <FontAwesome name={arrowDirection} size={20} color={arrowColor} style={{ marginTop: -4 }}/>
                </View>
            </View>
            <View style={styles.rightBox}>
                <Text>Total Bet</Text>
                <Text style={[styles.moneyText, { color: 'red' }]}>${wagered.toFixed(2)}</Text>
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
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1, 
    justifyContent: 'center',
    borderRadius: 8,
  },
  box: {
    flex: 0.3,
  },
  centerBox: {
    flex: 0.4,
    paddingTop: 28,
    paddingBottom: 24, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row', 
    marginTop: 8
  },
  leftBox: {
    flex: 1, 
    alignItems: 'flex-start', 
    marginLeft: 16, 
    marginRight: 4, 
    paddingVertical: 12,
    borderWidth: 1, 
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  rightBox: {
    flex: 1, 
    alignItems: 'flex-end', 
    marginRight: 16, 
    marginLeft: 4, 
    paddingVertical: 12,
    borderWidth: 1, 
    justifyContent: 'center',
    paddingHorizontal: 8,
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
});