import React from 'react';
import { StyleSheet, SectionList } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function TransactionList({ transactions }) {

    const { grayBackground, grayBorder, backgroundColor, redText } = useTheme();

    // Function to group transactions by month
    const groupTransactionsByMonth = (transactions) => {
        const grouped = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.timestamp);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const monthYear = `${month} ${year}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(transaction);
            return acc;
        }, {});

        return Object.keys(grouped).map((monthYear) => ({
            title: monthYear,
            data: grouped[monthYear],
        }));
    };

    const groupedTransactions = groupTransactionsByMonth(transactions);

    const TransactionComponent = ({ transaction }) => {
        return (
            <View style={[styles.transactionContainer, { borderColor: grayBorder, backgroundColor: grayBackground }]}>
                <ClearView style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={[styles.iconContainer, { backgroundColor: grayBorder, borderColor: backgroundColor }]}>
                        <Text style={{ color: 'white' }}>0</Text>
                    </View>
                    <ClearView style={{ justifyContent: 'center', marginLeft: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 2 }}>{transaction.bookieName}</Text>
                        <Text style={{ fontSize: 16, opacity: 0.7, marginTop: 2 }}>{transaction.transactionType}</Text>
                    </ClearView>
                </ClearView>
                <ClearView style={{ justifyContent: 'center' }}>
                    <View style={[styles.transactionAmount, { backgroundColor: transaction.transactionType === 'Deposit' ? grayBorder : redText, borderColor: transaction.transactionType === 'Deposit' ? grayBorder : redText }]}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>${transaction.amount.toFixed(2)}</Text>
                    </View>
                </ClearView>
            </View>
        );
    };

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.header}>
            <Text style={[styles.headerText]}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={groupedTransactions}
                renderItem={({ item }) => <TransactionComponent transaction={item} />}
                keyExtractor={(item, index) => index.toString()}
                renderSectionHeader={renderSectionHeader}
                renderSectionFooter={() => <View style={{ height: 10 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12
    },
    header: {
        padding: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
    },
    transactionAmount: {
        borderWidth: 1, 
        borderRadius: 4, 
        padding: 4,
    }
});