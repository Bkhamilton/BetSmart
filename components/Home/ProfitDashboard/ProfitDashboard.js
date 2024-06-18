import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View, Pressable } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import BalanceChecker from '@/components/Home/ProfitDashboard/BalanceChecker/BalanceChecker';

export default function ProfitDashboard({ wagered, won, openTransaction, bookies, transactions }) {
    const profit = won - wagered;
    const arrowDirection = profit > 0 ? 'chevron-up' : 'chevron-down';
    const arrowColor = profit > 0 ? 'green' : 'red';

    const { greenText, grayBackground, grayBorder } = useTheme();

    const BetResults = () => {
      return (
        <View style={styles.row}>
            <View style={[styles.leftBox, { backgroundColor: grayBackground, borderWidth: 1, borderColor: grayBorder }]}>
                <Text style={{ paddingLeft: 16 }}>Total Won</Text>
                <Text style={[styles.moneyText, { color: greenText }]}>${won.toFixed(2)}</Text>
            </View>
            <View style={[styles.indicator, { backgroundColor: 'transparent' }]}>
                <View style={styles.circle}>
                    <FontAwesome name={arrowDirection} size={20} color={arrowColor} style={{ marginTop: -4 }}/>
                </View>
            </View>
            <View style={[styles.rightBox, { backgroundColor: grayBackground, borderWidth: 1, borderColor: grayBorder }]}>
                <Text>Total Bet</Text>
                <Text style={[styles.moneyText, { color: '#ff5757' }]}>${wagered.toFixed(2)}</Text>
            </View>
        </View>
      );
    }

    return (
    <>
        <BalanceChecker 
            openTransaction={openTransaction} 
            bookies={bookies}
            transactions={transactions}
        />
        <BetResults />
    </>
  );
}

const styles = StyleSheet.create({
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
