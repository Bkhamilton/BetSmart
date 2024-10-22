import React from 'react';
import { StyleSheet } from 'react-native';
import BalanceChecker from '@/components/Home/ProfitDashboard/BalanceChecker/BalanceChecker';
import BetSlipResults from './BetSlipResults';

export default function ProfitDashboard({ openTransaction, openChooseBookie, transactions }) {

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
