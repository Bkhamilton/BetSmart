import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { UserContext } from '@/contexts/UserContext';
import { DBContext } from '@/contexts/DBContext';
import { getBetSlipsLast7Days, getBetSlipsByBookieLast7Days } from '@/db/betslips/BetSlips';
import { getWonBetSlipCountByBookieLast7Days, getProfitByBookieLast7Days } from '@/db/betslips/BetSlipsResults';
import { getWonBetSlipCountLast7Days, getProfitLast7Days } from '@/db/betslips/BetSlipsResults';

export default function BetSlipResults() {

    const { greenText, grayBackground, grayBorder, redText } = useTheme();
    const { user, trigger, bookie, signedIn } = useContext(UserContext);

    const { db } = useContext(DBContext);

    const [betsPlaced, setBetsPlaced] = useState(0);
    const [betsWon, setBetsWon] = useState(0);
    const [profit, setProfit] = useState(0);

    useEffect(() => {
        if (!user) return;
        if (!signedIn) return;
        if (user.id === 0) {
            setBetsPlaced(0);
            setBetsWon(0);
            setProfit(0);
            return;
        }
        if (bookie.id === 0) {
            // get Total Bets Placed for all bookies
            getBetSlipsLast7Days(db, user.id).then((res) => {
                setBetsPlaced(res);
            });
            // get Total Bets Won for all bookies
            getWonBetSlipCountLast7Days(db, user.id).then((res) => {
                setBetsWon(res);
            });
            // get Total Profit for all bookies
            getProfitLast7Days(db, user.id).then((res) => {
                setProfit(res);
            });
        } else {
            getBetSlipsByBookieLast7Days(db, user.id, bookie.id).then((res) => {
                setBetsPlaced(res);
            });
            getWonBetSlipCountByBookieLast7Days(db, user.id, bookie.id).then((res) => {
                setBetsWon(res);
            });
            getProfitByBookieLast7Days(db, user.id, bookie.id).then((res) => {
                setProfit(res);
            });
        }
    }, [trigger, user, signedIn, bookie]);

    return (
        <>
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
                    <Text style={[styles.moneyText, { color: profit > 0 ? greenText : redText }]}>
                    {profit > 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}
                    </Text>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 4 }}>
                <Text style={{ fontSize: 10, opacity: 0.6, fontWeight: '400', textAlign: 'center' }}>Last 7 Days</Text>
            </View>        
        </>

    );
}

const styles = StyleSheet.create({
    moneyText: {
        fontSize: 20,
        fontWeight: 'bold',
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