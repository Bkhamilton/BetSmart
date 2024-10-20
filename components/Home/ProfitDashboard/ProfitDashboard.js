import React, { useEffect, useState, useContext } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity, Text, View, Pressable } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';
import { UserContext } from '@/contexts/UserContext';
import { getBetSlipResultsBetAmount, getBetSlipResultsWinnings } from '@/db/betslips/BetSlipsResults';
import useTheme from '@/hooks/useTheme';
import BalanceChecker from '@/components/Home/ProfitDashboard/BalanceChecker/BalanceChecker';

import { getBetSlipsLast7Days } from '@/db/betslips/BetSlips';
import { getWonBetSlipCountByBookieLast7Days } from '@/db/betslips/BetSlipsResults';

export default function ProfitDashboard({ openTransaction, openChooseBookie, transactions }) {

    const { greenText, grayBackground, grayBorder } = useTheme();
    const { user, trigger, setTrigger, bookie, signedIn } = useContext(UserContext);

    const db = useSQLiteContext();

    const [betsPlaced, setBetsPlaced] = useState(0);
    const [betsWon, setBetsWon] = useState(0);

    useEffect(() => {
        if (!user) return;
        if (!signedIn) return;
        if (user.id === 0) {
            setBetsPlaced(0);
            setBetsWon(0);
            return;
        }
        getBetSlipsLast7Days(db, user.id, bookie.id).then((res) => {
            setBetsPlaced(res);
        });
        getWonBetSlipCountByBookieLast7Days(db, user.id, bookie.id).then((res) => {
            setBetsWon(res);
        });
    }, [trigger, user, signedIn, bookie]);

    const BetSlipResults = () => {
        return (
            <View style={styles.resultContainer}>
                <View style={[styles.resultBox, { backgroundColor: grayBackground, borderWidth: 1, borderColor: grayBorder }]}>
                    <Text>Bets Won</Text>
                    <Text style={styles.moneyText}>{betsWon}</Text>
                </View>
                <View style={[styles.resultBox, { backgroundColor: grayBackground, borderWidth: 1, borderColor: grayBorder }]}>
                    <Text>Bets Placed</Text>
                    <Text style={styles.moneyText}>{betsPlaced}</Text>
                </View>
                <View style={[styles.resultBox, { backgroundColor: grayBackground, borderWidth: 1, borderColor: grayBorder }]}>
                    <Text>Profit</Text>
                    <Text style={[styles.moneyText]}>-$20.00</Text>
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
        <BetSlipResults />
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
        fontSize: 20,
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
    resultContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginHorizontal: 10,
    },
    resultBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        borderRadius: 8,
    },
});
