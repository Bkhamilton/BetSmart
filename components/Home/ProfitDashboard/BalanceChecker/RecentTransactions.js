import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Pressable } from '@/components/Themed';

export default function RecentTransactions({ transactions, bookieId }) {

    const bookieTransactions = bookieId === 0 ? transactions : transactions.filter(transaction => transaction.bookieId === bookieId);

    const formatTransaction = (transaction) => {
        return `${transaction.transactionType === 'Deposit' ? '+' : '-'}$${transaction.amount}`;
    }

    const [opacity, setOpacity] = React.useState(1);

    const onPressIn = () => {
        setOpacity(0.6);
    }

    const onPressOut = () => {
        setOpacity(1);
    }

    return (
        <View style={styles.box}>
            <Pressable 
                style={[styles.transactionContainer, { opacity}]}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                {[...bookieTransactions].reverse().slice(0, 6).map((transaction, index) => (
                    <View key={index} style={{ backgroundColor: 'transparent' }}>
                        <Text style={{ opacity: transaction.transactionType === 'Deposit' ? 1 : 0.5, 
                            fontWeight: transaction.transactionType === 'Deposit' ? '500' : '600' }}>{formatTransaction(transaction)}</Text>
                    </View>
                ))}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'transparent',
        flex: 0.26,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    transactionContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'flex-end', 
        justifyContent: 'flex-end',
        marginRight: 4,
        paddingHorizontal: 4,
        paddingBottom: 8,
        height: 120,
        borderRadius: 8,
    },
});