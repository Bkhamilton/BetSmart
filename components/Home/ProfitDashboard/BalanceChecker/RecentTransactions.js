import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function RecentTransactions({ transactions, bookieId }) {

    const bookieTransactions = bookieId === 0 ? transactions : transactions.filter(transaction => transaction.bookieId === bookieId);

    const formatTransaction = (transaction) => {
        return `${transaction.transactionType === 'Deposit' ? '+' : '-'}$${transaction.amount}`;
    }

    return (
        <View style={styles.box}>
            <View 
                style={styles.transactionContainer}
            >
                {[...bookieTransactions].reverse().slice(0, 6).map((transaction, index) => (
                    <View key={index} style={{ backgroundColor: 'transparent' }}>
                        <Text style={{ opacity: transaction.transactionType === 'Deposit' ? 1 : 0.5, 
                            fontWeight: transaction.transactionType === 'Deposit' ? '500' : '600' }}>{formatTransaction(transaction)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'transparent',
        flex: 0.26,
    },
    transactionContainer: {
        backgroundColor: 'transparent', 
        alignItems: 'flex-end', 
        justifyContent: 'flex-end',
        paddingRight: 8,
        paddingBottom: 8,
        height: 120,
    },
});