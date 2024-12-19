import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Pressable, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function RecentTransactions({ transactions, bookieId }) {

    const { grayBackground } = useTheme();

    const bookieTransactions = bookieId === 0 ? transactions : transactions.filter(transaction => transaction.bookieId === bookieId);

    const formatTransaction = (transaction) => {
        return `${transaction.transactionType === 'Deposit' ? '+' : '-'}$${transaction.amount}`;
    }

    const [opacity, setOpacity] = React.useState(0.8);

    const onPressIn = () => {
        setOpacity(0.4);
    }

    const onPressOut = () => {
        setOpacity(0.8);
    }

    return (
        <ClearView style={styles.box}>
            <Pressable 
                style={[styles.transactionContainer, { opacity, backgroundColor: grayBackground }]}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                {[...bookieTransactions].reverse().slice(0, 6).map((transaction, index) => (
                    <ClearView key={index}>
                        <Text 
                            style={{ opacity: transaction.transactionType === 'Deposit' ? 1 : 0.5, fontWeight: transaction.transactionType === 'Deposit' ? '500' : '600' }}
                        >
                            {formatTransaction(transaction)}
                        </Text>
                    </ClearView>
                ))}
            </Pressable>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 0.26,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    transactionContainer: {
        alignItems: 'flex-end', 
        justifyContent: 'flex-end',
        marginRight: 4,
        paddingHorizontal: 4,
        paddingBottom: 8,
        height: 120,
        borderRadius: 8,
    },
});