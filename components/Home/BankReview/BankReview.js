import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View, ClearView, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import useRouting from '@/hooks/useRouting';
import { bookieImages } from '@/constants/bookieConstants';
import useUserBalDataState from '@/hooks/useUserBalDataState';
import { UserContext } from '@/contexts/UserContext';

export default function BankReview({ transactions, addBookie }) {

    const { signedIn, user } = useContext(UserContext);

    const { grayBackground, grayBorder, iconColor } = useTheme();

    const { handleTransactions } = useRouting();

    const { monthlyDeposits, monthlyWithdrawals } = useUserBalDataState();

    const onAddBookie = () => {
        if (!signedIn) {
            alert('You must be signed in to add a bookie.');
            return;
        }
        addBookie();
    }

    return (
        <ClearView style={styles.container}>
            <View style={{ paddingBottom: 8, paddingLeft: 12 }}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>Bankroll</Text>
            </View>
            <View 
                style={[styles.mainInfo, { borderColor: grayBorder, shadowColor: iconColor, backgroundColor: grayBackground }]}
            >
                <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ClearView style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.headerText}>Top Bookie</Text>
                        <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Image source={bookieImages['DraftKings']} style={{ width: 40, height: 40, borderRadius: 4 }} />
                            <Text style={{ fontSize: 12, fontWeight: '600' }}>+$50</Text>
                        </ClearView>
                    </ClearView>
                    <ClearView style={{ flex: 0.7, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <ClearView style={styles.transactionContainer}>
                            <Text style={styles.headerText}>Deposits</Text>
                            <Text style={{ fontSize: 20, fontWeight: '600', paddingVertical: 4 }}>${monthlyDeposits}</Text>
                        </ClearView>
                        <ClearView style={styles.transactionContainer}>
                            <Text style={styles.headerText}>Withdrawals</Text>
                            <Text style={{ fontSize: 20, fontWeight: '600', paddingVertical: 4 }}>${monthlyWithdrawals}</Text>
                        </ClearView>
                        <ClearView style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>Diff.</Text>
                            <Text style={{ fontSize: 18, fontWeight: '600', paddingVertical: 4 }}>${monthlyDeposits - monthlyWithdrawals}</Text>
                        </ClearView>
                    </ClearView>
                </ClearView>
                <ClearView style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 4, paddingBottom: 2 }}>
                    <Text style={{ fontSize: 10, opacity: 0.6, fontWeight: '400' }}>Last 30 Days</Text>
                </ClearView>
                <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity 
                        style={[styles.bottomButton, { backgroundColor: grayBorder, borderColor: grayBorder }]}
                        onPress={handleTransactions}
                    >
                        <Text style={styles.buttonText}>View Transactions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.bottomButton, { backgroundColor: grayBorder, borderColor: grayBorder }]}
                        onPress={onAddBookie}
                    >
                        <Text style={styles.buttonText}>Add Bookie</Text>
                    </TouchableOpacity>
                </ClearView>
            </View>
        </ClearView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,   
    },
    mainInfo: {
        borderWidth: 1,
        paddingTop: 4,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
    },
    transactionContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButton: {
        flex: 1,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 4,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    }
  });
