import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function BankManagement({ streak }) {

    const { grayBackground, grayBorder, iconColor } = useTheme();

    return (
        <ClearView style={styles.container}>
            <View style={{ paddingBottom: 8, paddingLeft: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Bank Management</Text>
            </View>
            <View 
                style={[styles.mainInfo, { borderColor: grayBorder, shadowColor: iconColor, backgroundColor: grayBackground }]}
            >
                <ClearView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ClearView style={styles.transactionContainer}>
                        <Text style={styles.headerText}>Deposits</Text>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>$100</Text>
                    </ClearView>
                    <ClearView style={styles.transactionContainer}>
                        <Text style={styles.headerText}>Withdrawals</Text>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>$50</Text>
                    </ClearView>
                </ClearView>
                <ClearView style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 4, paddingBottom: 2 }}>
                    <Text style={{ fontSize: 10, opacity: 0.6, fontWeight: '400' }}>Last 7 Days</Text>
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
});