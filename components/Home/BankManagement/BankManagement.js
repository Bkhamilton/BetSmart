import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Pressable, ClearView, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function BankManagement({ transactions }) {

    const { grayBackground, grayBorder, iconColor } = useTheme();

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
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>$150</Text>
                    </ClearView>
                    <ClearView style={styles.transactionContainer}>
                        <Text style={styles.headerText}>Deposits</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>$100</Text>
                    </ClearView>
                    <ClearView style={styles.transactionContainer}>
                        <Text style={styles.headerText}>Withdrawals</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>$50</Text>
                    </ClearView>
                </ClearView>
                <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.bottomButton, { backgroundColor: grayBorder, borderColor: grayBorder }]}>
                        <Text style={{ fontSize: 14, fontWeight: '600' }}>View Transactions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bottomButton, { backgroundColor: grayBorder, borderColor: grayBorder }]}>
                        <Text style={{ fontSize: 14, fontWeight: '600' }}>Add Bookie</Text>
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
        flex: 0.35,
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
    }
  });
