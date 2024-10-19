import React, { useEffect, useState, useContext } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View, Pressable } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';
import { UserContext } from '@/contexts/UserContext';
import { getBetSlipResultsBetAmount, getBetSlipResultsWinnings } from '@/db/betslips/BetSlipsResults';
import useTheme from '@/hooks/useTheme';
import BalanceChecker from '@/components/Home/ProfitDashboard/BalanceChecker/BalanceChecker';

export default function ProfitDashboard({ openTransaction, openChooseBookie, transactions }) {

    const { greenText, grayBackground, grayBorder } = useTheme();
    const { user, trigger, setTrigger, bookie, signedIn } = useContext(UserContext);

    const db = useSQLiteContext();

    const [totalWinnings, setTotalWinnings] = useState(0);
    const [totalBetAmount, setTotalBetAmount] = useState(0);
    const [profit, setProfit] = useState(0);
    const [arrowDirection, setArrowDirection] = useState('chevron-down');
    const [arrowColor, setArrowColor] = useState('red');

    useEffect(() => {
        if (!user) return;
        if (!signedIn) return;
        getBetSlipResultsWinnings(db, user.id).then((res) => {
            setTotalWinnings(res[0].totalWinnings);
        });
        getBetSlipResultsBetAmount(db, user.id).then((res) => {
            setTotalBetAmount(res[0].totalBetAmount);
        });
    }, [trigger, user, signedIn]);

    useEffect(() => {
        const calculatedProfit = totalWinnings - totalBetAmount;
        setProfit(calculatedProfit);
        setArrowDirection(calculatedProfit > 0 ? 'chevron-up' : 'chevron-down');
        setArrowColor(calculatedProfit > 0 ? 'green' : 'red');
    }, [totalWinnings, totalBetAmount]);

    const BetResults = () => {
      return (
        <View style={styles.row}>
            <View style={[styles.leftBox, { backgroundColor: grayBackground, borderWidth: 1, borderColor: grayBorder }]}>
                <Text style={{ paddingLeft: 16 }}>Total Won</Text>
                <Text style={[styles.moneyText, { color: greenText }]}>${totalWinnings.toFixed(2)}</Text>
            </View>
            <View style={[styles.indicator, { backgroundColor: 'transparent' }]}>
                <View style={styles.circle}>
                    <FontAwesome name={arrowDirection} size={20} color={arrowColor} style={{ marginTop: -4 }}/>
                </View>
            </View>
            <View style={[styles.rightBox, { backgroundColor: grayBackground, borderWidth: 1, borderColor: grayBorder }]}>
                <Text>Total Bet</Text>
                <Text style={[styles.moneyText, { color: '#ff5757' }]}>${totalBetAmount.toFixed(2)}</Text>
            </View>
        </View>
      );
    }

    return (
    <>
        <BalanceChecker 
            openTransaction={openTransaction} 
            openChooseBookie={openChooseBookie}
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
