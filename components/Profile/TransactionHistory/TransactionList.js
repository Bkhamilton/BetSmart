import React from 'react';
import { StyleSheet, SectionList, Image } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { bookieImages } from '@/constants/bookieConstants';

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
        const { grayBackground, grayBorder, backgroundColor, redText, greenText } = useTheme();
        const date = new Date(transaction.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    
        return (
            <View style={[styles.transactionContainer, { borderColor: grayBorder, backgroundColor: grayBackground }]}>
                {/* Left Side - Bookie and Details */}
                <ClearView style={styles.leftContainer}>
                    <Image 
                        source={bookieImages[transaction.bookieName]}
                        style={styles.iconContainer}
                    />
                    <ClearView style={styles.detailsContainer}>
                        <Text style={styles.bookieName}>{transaction.bookieName}</Text>
                        <Text style={styles.transactionType}>{transaction.transactionType}</Text>
                        <Text style={styles.dateText}>{formattedDate}</Text>
                    </ClearView>
                </ClearView>
    
                {/* Right Side - Amount and Balances */}
                <ClearView style={styles.rightContainer}>
                    <View style={[
                        styles.amountPill,
                        { 
                            backgroundColor: transaction.transactionType === 'Deposit' 
                                ? greenText + '20' // Add opacity
                                : redText + '20',
                            borderColor: transaction.transactionType === 'Deposit' 
                                ? greenText 
                                : redText
                        }
                    ]}>
                        <Text style={[
                            styles.amountText,
                            { color: transaction.transactionType === 'Deposit' ? greenText : redText }
                        ]}>
                            {transaction.transactionType === 'Deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </Text>
                    </View>
                    
                    <ClearView style={styles.balanceContainer}>
                        <Text style={styles.balanceText}>
                            <Text style={{ opacity: 0.7 }}>From </Text>${transaction.initialBalance.toFixed(2)}
                        </Text>
                        <Text style={styles.balanceText}>
                            <Text style={{ opacity: 0.7 }}>To </Text>${transaction.finalBalance.toFixed(2)}
                        </Text>
                    </ClearView>
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
    },
    leftContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    detailsContainer: {
        justifyContent: 'center',
        marginLeft: 12,
    },
    bookieName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    transactionType: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        opacity: 0.6,
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    amountPill: {
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderWidth: 1,
        marginBottom: 4,
    },
    amountText: {
        fontSize: 16,
        fontWeight: '600',
    },
    balanceContainer: {
        alignItems: 'flex-end',
    },
    balanceText: {
        fontSize: 12,
        opacity: 0.9,
        lineHeight: 16,
    },
});